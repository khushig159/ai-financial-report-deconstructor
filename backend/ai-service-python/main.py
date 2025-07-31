import os
import json
import asyncio
import google.generativeai as genai
from google.generativeai.types import HarmCategory,HarmBlockThreshold
from dotenv import load_dotenv
import re
from fastapi import FastAPI, File, UploadFile, HTTPException
import fitz  # PyMuPDF

#configuration
load_dotenv()
GOOGLE_API_KEY=os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found")
genai.configure(api_key=GOOGLE_API_KEY)

# --- FastAPI App Initialization ---
app = FastAPI()

# --- Parser for LAST match (Works for 10-K and 10-Q Risk Factors) ---
def extract_last_match_section(full_text: str, start_pattern_str: str, end_pattern_str: str) -> str:
    """
    Extracts a section by finding the LAST occurrence of its start pattern.
    """
    try:
        start_pattern = re.compile(start_pattern_str, re.IGNORECASE | re.DOTALL)
        end_pattern = re.compile(end_pattern_str, re.IGNORECASE | re.DOTALL)

        all_start_matches = list(start_pattern.finditer(full_text))
        if not all_start_matches:
            return ""
        
        # Use the last match to skip the Table of Contents
        start_match = all_start_matches[-1]
        start_index = start_match.start()

        end_match = end_pattern.search(full_text, pos=start_index + 1)
        if not end_match:
            return full_text[start_index:].strip()

        end_index = end_match.start()
        return full_text[start_index:end_index].strip()
    except Exception as e:
        print(f"--- ERROR in last_match_parser: {e}")
        return ""

def extract_first_match_section(full_text: str, start_pattern_str: str, end_pattern_str: str) -> str:
    """
    Extracts a section by finding the FIRST occurrence of its start pattern.
    This is specifically for 10-Q Management's Discussion (Item 2 in Part I).
    """
    try:
        start_pattern = re.compile(start_pattern_str, re.IGNORECASE | re.DOTALL)
        end_pattern = re.compile(end_pattern_str, re.IGNORECASE | re.DOTALL)

        # Use the first match, which is the one in Part I
        start_match = start_pattern.search(full_text)
        if not start_match:
            return ""
        
        start_index = start_match.start()

        end_match = end_pattern.search(full_text, pos=start_index + 1)
        if not end_match:
            return full_text[start_index:].strip()

        end_index = end_match.start()
        return full_text[start_index:end_index].strip()
    except Exception as e:
        print(f"--- ERROR in first_match_parser: {e}")
        return ""


def extract_10q_mda_section(full_text: str, start_pattern_str: str, end_pattern_str: str) -> str:
    """
    Specifically for 10-Q MD&A. It first finds the end of the Table of Contents,
    then finds the FIRST match of the pattern in the report body.
    """
    try:
        # Step 1: Find the end of the Table of Contents.
        # A reliable marker is the last occurrence of "Part I" in the TOC area.
        toc_end_pattern = re.compile(r"part\s+i", re.IGNORECASE | re.DOTALL)
        toc_matches = list(toc_end_pattern.finditer(full_text[:5000])) # Search first ~5 pages
        
        content_start_index = 0
        if toc_matches:
            # The real content starts after the last TOC mention of "Part I"
            content_start_index = toc_matches[-1].end()
        
        report_body_text = full_text[content_start_index:]

        # Step 2: Find the FIRST match of the MD&A pattern within the report body.
        start_pattern = re.compile(start_pattern_str, re.IGNORECASE | re.DOTALL)
        end_pattern = re.compile(end_pattern_str, re.IGNORECASE | re.DOTALL)

        start_match = start_pattern.search(report_body_text)
        if not start_match:
            return ""
        
        start_index = start_match.start()

        end_match = end_pattern.search(report_body_text, pos=start_index + 1)
        if not end_match:
            return report_body_text[start_index:].strip()

        end_index = end_match.start()
        return report_body_text[start_index:end_index].strip()
    except Exception as e:
        print(f"--- ERROR in extract_10q_mda_section: {e}")
        return ""
    
def sanitize_text_for_ai(text: str) -> str:
    """A more aggressive function to clean text for AI JSON generation."""
    if not text:
        return ""
    # Replace backslashes with a safe character (like a space)
    text = text.replace('\\', ' ')
    # Replace double quotes with single quotes
    text = text.replace('"', "'")
    # Remove characters that are invalid in JSON strings and other control chars
    # This regex removes characters in the C0 and C1 control blocks, plus backspace.
    text = re.sub(r'[\x00-\x1F\x7F-\x9F\x08]', ' ', text)
    return text
 
async def get_kpi_analysis(full_text:str):
    print('--AI Task: Extracting KPIs--')
    prompt="""
    You are a financial analyst. From the provided financial report text, extract the exact values for
    Total Revenue, Net Income, and Diluted Earnings Per Share (EPS).
    Respond ONLY with a single, valid JSON object with three keys: "revenue", "netIncome", "eps".
    The values should be strings representing the primary figures (e.g., "$1,175 million", "1.31").
    If a value cannot be found, use "N/A".
    """
    try:
        model=genai.GenerativeModel('gemini-1.5-pro-latest',generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        # clean_text = sanitize_text_for_ai(full_text[:80000])
        response=await model.generate_content_async([prompt,full_text[:150000]])
        return json.loads(response.text)
    except Exception as e:
        print(f'--Error in KPI Aalysis:{e}')
        return {"revenue": "Error", "netIncome": "Error", "eps": "Error"}

async def get_tone_analysis(mda_text: str):
    print("--- AI Task: Analyzing Management Tone ---")
    prompt = """
You are an expert in financial linguistics. Analyze the tone of the following "Management's Discussion & Analysis" section.
    Is the tone more optimistic, neutral, or cautious than a standard report?

    IMPORTANT: Your response must be a single, valid JSON object. Ensure all special characters within the summary text, such as backslashes and quotes, are correctly escaped for JSON formatting.

    Respond ONLY with a JSON object with two keys: "summary" (a one-sentence summary of the tone) and "cautiousness_score" (a score from 1 to 10, where 10 is extremely cautious).
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        clean_text = sanitize_text_for_ai(mda_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Tone Analysis: {e}")
        return {"summary": "Error analyzing tone.", "cautiousness_score": -1}

async def get_risk_summary(risk_text: str):
    print("--- AI Task: Summarizing Risks ---")
    prompt = """
    You are a compliance officer. From the "Risk Factors" section provided, identify and summarize the top 3 most significant or newly emphasized risks.
    Respond ONLY with a single, valid JSON object with one key: "top_risks", which should be an array of strings. Each string should be a one-sentence summary of a key risk.
    IMPORTANT: Do not use any unicode escape sequences like \\u0024 in your response. Use the actual characters like $.

    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        clean_text = sanitize_text_for_ai(risk_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Risk Summary: {e}")
        return {"top_risks": ["Error summarizing risks."]}
    
async def get_competitor_analysis(mda_text: str):
    """Uses AI to identify competitors and the context of their mention."""
    print("--- AI Task: Analyzing Competitive Landscape ---")
    prompt = """
    You are a strategic analyst. Read the following "Management's Discussion & Analysis" section.
    Identify all mentions of specific competing companies.
    For each competitor found, provide a brief, three-sentence summary of the context in which they were mentioned (e.g., "competing on price", "mentioned as a market leader", "partner in a new venture").
    Respond ONLY with a single, valid JSON object with one key: "competitors". Ensure all special characters within the summary text, such as backslashes and quotes, are correctly escaped for JSON formatting.
    The value of "competitors" should be an array of objects, where each object has two keys: "name" (the competitor's name) and "context" (the summary).
    If no competitors are mentioned, return an empty array.
    IMPORTANT: Do not use any unicode escape sequences like \\u0024 in your response. Use the actual characters like $.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        clean_text = sanitize_text_for_ai(mda_text)
        response = await model.generate_content_async([prompt, clean_text])
        print(json.loads(response.text))
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Competitor Analysis: {e}")
        return {"competitors": [{"name": "Error", "context": "Failed to analyze competitive landscape."}]}
    
async def get_legal_summary(full_text: str):
    """Finds and summarizes the Legal Proceedings section from a focused chunk of the document."""
    print("--- AI Task: Summarizing Legal Proceedings ---")
    prompt = """
    You are a legal analyst. First, find the "Legal Proceedings" section in the provided financial report text.
    Once found, read the section and provide a concise summary of the key legal matters discussed.
    Focus on the main parties involved and the core issue of each proceeding.
    Respond ONLY with a single, valid JSON object with one key: "legal_summary",
    which should be an array of strings. Each string should be a summary of a single legal matter.
    If the section does not exist or no specific proceedings are mentioned, return an empty array.
    IMPORTANT: Do not use any unicode escape sequences like \\u0024 in your response. Use the actual characters like $.
    If the section does not exist, return an empty array.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        
        # --- THE CRITICAL OPTIMIZATION IS HERE ---
        # We create a "middle chunk" of the document to search within.
        # This starts after the typical intro sections and covers a large area.
        start_char = 15000  # Skip the first ~15 pages of boilerplate
        end_char = 150000 # Search within the next ~135 pages
        # middle_chunk = full_text[start_char:end_char]
        
        clean_text = sanitize_text_for_ai(full_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Legal Summary: {e}")
        return {"legal_summary": ["Error summarizing legal proceedings."]}
async def get_guidance_analysis(mda_text: str):
    """Identifies and classifies forward-looking statements."""
    print("--- AI Task: Analyzing Guidance & Outlook ---")
    prompt = """
    You are a quantitative analyst specializing in parsing forward-looking statements.
    Read the following "Management's Discussion & Analysis" section and identify any statement that provides guidance or an outlook on future performance.
    For each statement found, classify its sentiment as 'Positive', 'Neutral', or 'Negative'.
    IMPORTANT: Do not use any unicode escape sequences like \\u0024 in your response. Use the actual characters like $.

    Respond ONLY with a single, valid JSON object with one key: "guidance".
    The value of "guidance" should be an array of objects, where each object has two keys: "statement" (the quoted forward-looking statement) and "sentiment" (the classification).
    
    Example: [{"statement": "We expect net sales to grow between 7% and 11%", "sentiment": "Positive"}]
    
    If no forward-looking statements are found, return an empty array.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        clean_text = sanitize_text_for_ai(mda_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Guidance Analysis: {e}")
        return {"guidance": [{"statement": "Error analyzing guidance.", "sentiment": "Error"}]}

async def get_financial_statements(financial_statements_text: str):
    """Extracts the three core financial statements from a pre-parsed text block."""
    print("--- AI Task: Deconstructing Financial Statements ---")
    prompt = """
    You are an expert financial data extraction bot. The following text contains the core financial statements from a report.
    Your task is to parse the three main statements:
    1. Consolidated Statements of Operations (or Income Statement)
    2. Consolidated Balance Sheets
    3. Consolidated Statements of Cash Flows

    For each statement, extract the key line items and their values for the two most recent periods presented.
    
    Respond ONLY with a single, valid JSON object with three main keys: "income_statement", "balance_sheet", and "cash_flow_statement".
    Each key should contain an array of objects, where each object has three keys: "item" (the line item name), "current_period", and "previous_period".
    
    If a statement cannot be found, return an empty array for that key.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        clean_text = sanitize_text_for_ai(financial_statements_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Financial Statement Deconstruction: {e}")
        return {"income_statement": [], "balance_sheet": [], "cash_flow_statement": []}


async def get_holistic_review(full_text: str):
    """
    Performs multiple full-document analyses in a single, efficient AI call.
    It detects red flags and governance changes simultaneously.
    """
    print("--- AI Task: Performing Holistic Review (Red Flags & Governance) ---")
    prompt = """
    You are an expert forensic accountant and corporate governance analyst. Your task is to scan the entire provided financial report text for two types of information:
    
    1.  **Potential Red Flags:** Your task is to scan the entire provided financial report text for potential anomalies, inconsistencies, or red flags.
    Focus on subtle issues that might indicate risk, such as:
    - Unusual or complex accounting changes mentioned in the footnotes.
    - A significant increase in Accounts Receivable that is growing much faster than revenue.
    - Mentions of complex off-balance-sheet entities or special purpose vehicles.
    - Vague, evasive, or overly promotional language in the Management's Discussion section.
    - Significant, unexplained increases in inventory.
    - Changes in key auditors or management.
    2.  **Governance Changes:** Your task is to scan for any mentions of changes to key executive personnel or the board of directors. Look for names of people associated with key roles (e.g., CEO, CFO, COO, Chair of the Board, Director) and keywords like "appointed", "resigned", "retired", "departed", "joined the board".

    Respond ONLY with a single, valid JSON object with two keys: "red_flags" and "governance_changes".
    Each key should contain an array of strings. Each string should be a concise summary of a single finding.
    If no items are found for a category, return an empty array for that key.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        clean_text = sanitize_text_for_ai(full_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Holistic Review: {e}")
        return {"red_flags": ["Error detecting red flags."], "governance_changes": ["Error analyzing governance changes."]}
    
async def get_deep_qualitative_analysis(full_text: str):
    """Finds and extracts details about the company's debt schedule and covenants."""
    print("--- AI Task: Deconstructing Debt & Covenants ---")
    prompt = """
    You are an expert financial analyst with specialties in credit and ESG. Your task is to scan the provided financial report text for two types of information:
    1.  **Debt Schedule & Debt Covenants:** Find the table or section detailing the company's term debt. Extract the maturity year and the principal amount for each future year listed. Find any sentences that describe specific rules or covenants the company must follow related to its debt (e.g., "limit the aggregate amount of secured indebtedness," "consolidated net interest expense ratio cannot be less than 2.20 to 1.0").
    2. **ESG Mentions:**  Your task is to scan the provided financial report text for any statements related to ESG initiatives or risks.
    Categorize each finding into one of three categories: 'Environmental', 'Social', or 'Governance'.
    Examples:
    - Environmental: Climate change risks, carbon emissions, renewable energy projects.
    - Social: Employee diversity and inclusion programs, workplace safety, data privacy.
    - Governance: Board of directors composition, executive compensation policies, shareholder rights.

    Respond ONLY with a single, valid JSON object with two keys: "debt_details" and "esg_analysis".
    - "debt_details" should be an object with two keys: "debt_schedule" (an array of objects with "year" and "principal_due") and "covenants" (an array of strings).
    - "esg_analysis" should be an object with one key: "esg_mentions" (an array of objects with "category" and "statement").

    If either type of information is not found, return an empty array for that key.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        # This task requires a large context to find these specific details
        clean_text = sanitize_text_for_ai(full_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Debt Deconstruction: {e}")
        return {"debt_schedule": [], "covenants": []}
    
async def calculate_financial_ratios(financial_statements_json: dict):
    """Calculates key financial ratios from the structured statement data."""
    print("--- AI Task: Calculating Financial Ratios ---")
    prompt = """
    You are an expert financial analyst. Based on the provided JSON data from a company's financial statements, calculate the following key financial ratios for the 'current_period'.
    - Gross Margin %
    - Operating Margin %
    - Net Profit Margin %
    - Debt-to-Equity Ratio

    Use the following formulas and be precise:
    - Gross Margin % = (Gross margin / Total net sales) * 100
    - Operating Margin % = (Operating income / Total net sales) * 100
    - Net Profit Margin % = (Net income / Total net sales) * 100
    - Debt-to-Equity Ratio = (Total liabilities / Total shareholders' equity)

    Extract the necessary numbers from the 'income_statement' and 'balance_sheet' arrays in the provided JSON. The numbers are strings with commas, which you must parse correctly.
    Present the results as percentages rounded to two decimal places, or as a ratio rounded to two decimal places for Debt-to-Equity.

    Respond ONLY with a single, valid JSON object with one key: "ratios".
    The value should be an array of objects, where each object has two keys: "name" (the ratio's name) and "value" (the calculated string value, e.g., "44.12%", "1.52").

    If you cannot calculate a ratio because a specific line item is missing, omit it from the final array.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        # Convert the dict to a JSON string to send to the model
        json_input = json.dumps(financial_statements_json)
        response = await model.generate_content_async([prompt, json_input])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Ratio Analysis: {e}")
        return {"ratios": []}
async def summarize_footnotes(footnotes_text: str):
    """Creates a summarized index of the key topics in the financial footnotes."""
    print("--- AI Task: Summarizing Financial Footnotes ---")
    prompt = """
    You are a senior auditor. The following text contains the "Notes to Consolidated Financial Statements" from a financial report.
    Your task is to read this entire section and create a summarized index of the key topics discussed.
    For each major topic (e.g., "Note 1 - Summary of Significant Accounting Policies", "Note 4 - Financial Instruments", "Note 9 - Debt"), provide a concise, one or two-sentence summary of the most important information in that note.

    Respond ONLY with a single, valid JSON object with one key: "footnote_summary".
    The value should be an array of objects, where each object has two keys: "topic" (the name of the note, e.g., "Note 9 - Debt") and "summary" (your concise summary).
    
    If the provided text is empty or does not contain footnotes, return an empty array.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-pro-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        clean_text = sanitize_text_for_ai(footnotes_text)
        response = await model.generate_content_async([prompt, clean_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Footnote Summarization: {e}")
        return {"footnote_summary": []}
    
@app.get("/")
def read_root():
    return {"message": "AI Service is running"}

@app.post("/analyze")
async def analyze_report(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        full_text = "".join(page.get_text() for page in doc)
        doc.close()
        
        if not full_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

        print("\n--- Starting Definitive Form-Aware Analysis ---")
        
        risk_factors_text = ""
        mda_text = ""
        financial_statements_text=""

        doc_header = full_text[:3000].lower()
        is_10k = "form 10-k" in doc_header
        is_10q = "form 10-q" in doc_header

        if is_10k:
            print("--- Detected Form Type: 10-K (Using validated logic) ---")
            risk_start = r"Item\s+1\s*A\s*\..*?Risk\s+Factors"
            risk_end = r"Item\s+1\s*B\s*\."
            risk_factors_text = extract_last_match_section(full_text, risk_start, risk_end)
            financial_statements_text = extract_last_match_section(full_text, r"Item\s+8\s*\..*?Financial\s+Statements\s+and\s+Supplementary\s+Data", r"Item\s+9\s*\.")
            footnotes_text = extract_last_match_section(financial_statements_text, r"Notes\s+to\s+Consolidated\s+Financial\s+Statements", r"Item\s+9\s*\.")

            mda_start = r"Item\s+7\s*\..*?Management['’]?s\s+Discussion"
            mda_end = r"Item\s+(?:7A|8)\s*\."
            mda_text = extract_last_match_section(full_text, mda_start, mda_end)


        elif is_10q:
            print("--- Detected Form Type: 10-Q ---")
            
            # Step 1: Find the start of the actual report body, after the Table of Contents.
            # A reliable marker is the last occurrence of the "Part I" header.
            part_i_pattern = re.compile(r"part\s+i\s*–\s*financial\s+information", re.IGNORECASE | re.DOTALL)
            part_i_matches = list(part_i_pattern.finditer(full_text))
            content_start_index = 0
            if part_i_matches:
                content_start_index = part_i_matches[-1].start()
            
            # Create a new text block that contains only the actual report body.
            report_body_text = full_text[content_start_index:]

            # Step 2: Search for MD&A ONLY within the report body text.
            mda_start_10q = r"Item\s+2\s*\..*?Management['’]?s\s+Discussion\s+and\s+Analysis"
            mda_end_10q = r"Item\s+[34]\s*\."
            mda_text = extract_10q_mda_section(report_body_text, mda_start_10q, mda_end_10q)

            # 10-Q Risk Factors: Use the LAST match for Item 1A to skip the table of contents.
            risk_start_10q = r"Item\s+1\s*A\s*\..*?Risk\s+Factors"
            risk_end_10q = r"Item\s+2\s*\."
            risk_factors_text = extract_last_match_section(full_text, risk_start_10q, risk_end_10q)

            financial_statements_text = extract_10q_mda_section(report_body_text, r"Item\s+1\s*\..*?Financial\s+Statements", r"Item\s+2\s*\.")
            footnotes_text = extract_last_match_section(financial_statements_text, r"Notes\s+to\s+Consolidated\s+Financial\s+Statements", r"Item\s+2\s*\.")


        
        print(f"--- Parsing Complete: Found {len(risk_factors_text)} risk chars, {len(mda_text)} MDA chars.")

        print("--- Starting Sequential AI Analysis to respect API limits ---")
        
        kpi_results = await get_kpi_analysis(full_text)
        print("--- Waiting 15 seconds before next API call... ---")
        await asyncio.sleep(15)

        tone_results = await get_tone_analysis(mda_text) if mda_text else {"summary": "N/A", "cautiousness_score": 0}
        print("--- Waiting 15 seconds before next API call... ---")
        await asyncio.sleep(15)

        risk_results = await get_risk_summary(risk_factors_text) if risk_factors_text else {"top_risks": ["N/A"]}
        print("--- Waiting 15 seconds before next API call... ---")
        await asyncio.sleep(15)

        competitor_results = await get_competitor_analysis(mda_text) if mda_text else {"competitors": []}
        print("--- Waiting 15 seconds before next API call... ---")
        await asyncio.sleep(15)

        legal_results = await get_legal_summary(full_text)
        print("--- Waiting 15 seconds before next API call... ---")
        await asyncio.sleep(15)
        guidance_results = await get_guidance_analysis(mda_text) if mda_text else {"guidance": []}
        print("--- Waiting 15 seconds before next API call... ---")

        await asyncio.sleep(15)
        financial_statements_results = await get_financial_statements(financial_statements_text) if financial_statements_text else {"income_statement": [], "balance_sheet": [], "cash_flow_statement": []}

        await asyncio.sleep(15)
        holistic_review_results = await get_holistic_review(full_text)

        await asyncio.sleep(15)
        ratio_results = await calculate_financial_ratios(financial_statements_results) if financial_statements_results else {}

        await asyncio.sleep(15)
        deep_qualitative_results = await get_deep_qualitative_analysis(full_text)

        await asyncio.sleep(15)
        footnote_results = await summarize_footnotes(footnotes_text) if footnotes_text else {}

        print("--- AI Analysis Complete ---")

        print(competitor_results)
        print(legal_results)
        print(guidance_results)
        print(holistic_review_results.get('red_flags'))
        print(holistic_review_results.get('governance_changes'))
        print(ratio_results)
        print(deep_qualitative_results.get('debt_details'))
        print(deep_qualitative_results.get('esg_analysis'))

        return {
            "filename": file.filename,
            "key_metrics": kpi_results,
            "management_tone": tone_results,
            "risk_summary": risk_results,
            "raw_risk_factors": risk_factors_text,
            "raw_management_discussion": mda_text,
            "competitor_analysis": competitor_results,
            "legal_summary": legal_results,
            "guidance_analysis": guidance_results, 
            "financial_statements": financial_statements_results,
            "red_flags": holistic_review_results.get("red_flags", []),
            "governance_changes": holistic_review_results.get("governance_changes",[]),
            "financial_ratios": ratio_results, 
            "debt_details": deep_qualitative_results.get("debt_details", {}),
            "esg_analysis": deep_qualitative_results.get("esg_analysis", {}),
            "footnote_summary": footnote_results, # New field
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")