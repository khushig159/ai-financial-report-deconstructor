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
        model=genai.GenerativeModel('gemini-1.5-flash-latest',generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        response=await model.generate_content_async([prompt,full_text[:40000]])
        return json.loads(response.text)
    except Exception as e:
        print(f'--Error in KPI Aalysis:{e}')
        return {"revenue": "Error", "netIncome": "Error", "eps": "Error"}

async def get_tone_analysis(mda_text: str):
    print("--- AI Task: Analyzing Management Tone ---")
    prompt = """
    You are an expert in financial linguistics. Analyze the tone of the following "Management's Discussion & Analysis" section.
    Is the tone more optimistic, neutral, or cautious than a standard report?
    Respond ONLY with a single, valid JSON object with two keys: "summary" (a one-sentence summary of the tone) and "cautiousness_score" (a score from 1 to 10, where 10 is extremely cautious).
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        response = await model.generate_content_async([prompt, mda_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Tone Analysis: {e}")
        return {"summary": "Error analyzing tone.", "cautiousness_score": -1}

async def get_risk_summary(risk_text: str):
    print("--- AI Task: Summarizing Risks ---")
    prompt = """
    You are a compliance officer. From the "Risk Factors" section provided, identify and summarize the top 3 most significant or newly emphasized risks.
    Respond ONLY with a single, valid JSON object with one key: "top_risks", which should be an array of strings. Each string should be a one-sentence summary of a key risk.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest', generation_config=genai.types.GenerationConfig(response_mime_type="application/json"))
        response = await model.generate_content_async([prompt, risk_text])
        return json.loads(response.text)
    except Exception as e:
        print(f"--- ERROR in Risk Summary: {e}")
        return {"top_risks": ["Error summarizing risks."]}

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

        doc_header = full_text[:3000].lower()
        is_10k = "form 10-k" in doc_header
        is_10q = "form 10-q" in doc_header

        if is_10k:
            print("--- Detected Form Type: 10-K (Using validated logic) ---")
            risk_start = r"Item\s+1\s*A\s*\..*?Risk\s+Factors"
            risk_end = r"Item\s+1\s*B\s*\."
            risk_factors_text = extract_last_match_section(full_text, risk_start, risk_end)

            mda_start = r"Item\s+7\s*\..*?Management['’]?s\s+Discussion"
            mda_end = r"Item\s+(?:7A|8)\s*\."
            mda_text = extract_last_match_section(full_text, mda_start, mda_end)

        elif is_10q:
            print("--- Detected Form Type: 10-Q ---")
            
             # --- THE CRITICAL FIX FOR 10-Q MD&A ---
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
        
        print(f"--- Parsing Complete: Found {len(risk_factors_text)} risk chars, {len(mda_text)} MDA chars.")

        print("--- Starting Sequential AI Analysis to respect API limits ---")
        
        kpi_results = await get_kpi_analysis(full_text)
        print("--- Waiting 30 seconds before next API call... ---")
        await asyncio.sleep(30)

        tone_results = await get_tone_analysis(mda_text) if mda_text else {"summary": "N/A", "cautiousness_score": 0}
        print("--- Waiting 30 seconds before next API call... ---")
        await asyncio.sleep(30)

        risk_results = await get_risk_summary(risk_factors_text) if risk_factors_text else {"top_risks": ["N/A"]}
        
        print("--- AI Analysis Complete ---")

        
        return {
            "filename": file.filename,
            "key_metrics": kpi_results,
            "management_tone": tone_results,
            "risk_summary": risk_results,
            "raw_risk_factors": risk_factors_text,
            "raw_management_discussion": mda_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")