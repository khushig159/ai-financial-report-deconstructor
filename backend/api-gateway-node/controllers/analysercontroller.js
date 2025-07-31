const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const AnalysisReport = require('../models/AnalysisReport');
const {GoogleGenerativeAI}=require('@google/generative-ai')

const genAI=new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
    { name: 'currentReport', maxCount: 1 },
    { name: 'previousReport', maxCount: 1 }
]);

const analyzeFile = async (file) => {
    if (!file) return null;
    const form = new FormData();
    form.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
    });
    console.log(`Calling Python service for: ${file.originalname}`);
    const response = await axios.post(process.env.PYTHON_SERVICE_URL, form, {
        headers: { ...form.getHeaders() },
        // timeout: 180000
    });
    return response.data;
};

const getRiskComparison = async (previous_risk_text, current_risk_text) => {
    console.log("--- AI Task (Node.js): Comparing Risk Factors ---");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const prompt = `
    You are an expert financial compliance officer. Compare the "Risk Factors" from two consecutive reports.
    PREVIOUS: "${previous_risk_text}"
    CURRENT: "${current_risk_text}"
    Summarize the meaningful, substantive changes (new risks, removed risks, or significantly altered language).
    Respond ONLY with a single JSON object with one key: "comparison_summary", which is an array of strings.
    If there are no meaningful changes, return an empty array.
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace('```json', '').replace('```', '');
    return JSON.parse(text);
};

const generateExecutiveSummary = async (analysisData) => {
    console.log("--- AI Task (Node.js): Generating Executive Summary ---");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    // We create a summary of the data to feed into the final prompt.
    const summaryInput = `
    Key Metrics: Revenue: ${analysisData?.key_metrics?.revenue || 'N/A'}, Net Income: ${analysisData?.key_metrics?.netIncome || 'N/A'}, EPS: ${analysisData?.key_metrics?.eps || 'N/A'}.
    Management Tone: ${analysisData?.management_tone?.summary || 'N/A'} (Cautiousness Score: ${analysisData?.management_tone?.cautiousness_score || 'N/A'}/10).
    Top Risks Summary: ${(analysisData?.risk_summary?.top_risks || []).join('; ') || 'None listed'}.
    Detected Red Flags: ${(analysisData?.red_flags?.red_flags || []).join('; ') || 'None listed'}.
    Competitor Mentions: ${(analysisData?.competitor_analysis?.competitors || []).map(c => `${c.name}: ${c.context}`).join('; ') || 'None'}.
    Legal Proceedings: ${(analysisData?.legal_summary?.legal_summary || []).join('; ') || 'None'}.
    Forward-Looking Guidance: ${(analysisData?.guidance_analysis?.guidance || []).map(g => `${g.statement} (Sentiment: ${g.sentiment})`).join('; ') || 'None'}.
    Governance Changes: ${(analysisData?.governance_changes?.governance_changes || []).join('; ') || 'None'}.
`;


    const prompt = `
    You are a senior portfolio manager at a top investment bank like J.P. Morgan.
    Based on the following synthesized data points from a financial report, write a concise, insightful, one-paragraph executive summary for a busy executive.
    Your summary should weave these points into a coherent narrative. Do not just list the data.
    Start with a clear statement on the overall health and outlook (e.g., "The company presents a strong but cautious outlook...").
    Then, touch upon the key financial performance, the management's tone, the most critical risks, and any significant strategic or governance factors.

    Synthesized Data:
    ${summaryInput}
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("--- ERROR in Executive Summary generation:", error);
        return "Failed to generate executive summary.";
    }
};
const getIndustryBenchmarks = async (ratios) => {
    console.log("--- AI Task (Node.js): Getting Industry Benchmarks ---");
    if (!ratios || !ratios.ratios || ratios.ratios.length === 0) {
        return { benchmarks: [] };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const prompt = `
    You are a senior industry analyst. Based on the following financial ratios for a company, provide a general comparison against typical averages for the technology and retail sectors.
    Ratios: ${JSON.stringify(ratios.ratios)}

    For each ratio, provide a brief, two-sentence comparison (e.g., "This Gross Margin is considered strong for the retail sector.").

    Respond ONLY with a single, valid JSON object with one key: "benchmarks".
    The value of "benchmarks" should be an array of objects, where each object has three keys: "name" (the ratio's name), "value" (the ratio's value), and "comparison" (your one-sentence analysis).
    If you cannot provide a benchmark for a ratio, omit it from the array.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("--- ERROR in Industry Benchmark generation:", error);
        return { benchmarks: [] };
    }
};


exports.analyzeReport = async (req, res) => {
    try {
        console.log('--- analyzeReport function has started ---');

        // --- DETAILED DEBUGGING LOGS ---
        // console.log('--- Checking req.files object ---');
        // console.log('Is req.files present?', !!req.files);
        // if (req.files) {
        //     console.log('Is req.files.currentReport present?', !!req.files.currentReport);
        //     console.log('Is req.files.previousReport present?', !!req.files.previousReport);
        //     // Log the entire req.files object to see its structure
        //     console.log('Full req.files object:', JSON.stringify(req.files, null, 2));
        // }
        // --- END OF DEBUGGING LOGS ---

        if (!req.files || !req.files.currentReport || !req.files.previousReport) {
            console.log('--- ERROR: File check failed. One or more files are missing. ---');
            return res.status(400).json({ message: "File check failed. Please ensure both files are uploaded correctly." });
        }

        // console.log('--- File check passed. Proceeding with analysis. ---');

        const currentReportFile = req.files.currentReport[0];
        const previousReportFile = req.files.previousReport[0];

        console.log("Step 1: Analyzing current report...");
        const currentAnalysis = await analyzeFile(currentReportFile);
        console.log("Step 1 Complete. Current report analysis finished.");

        console.log("Step 2: Analyzing previous report...");
        const previousAnalysis = await analyzeFile(previousReportFile);
        console.log("Step 2 Complete. Previous report analysis finished.");
        
        if (!currentAnalysis || !previousAnalysis) {
            throw new Error("Failed to get analysis from Python service for one or both files.");
        }
        
        console.log("Received analysis for both files. Assembling final report.");

        const riskComparison=await getRiskComparison(
            previousAnalysis.raw_risk_factors,
            currentAnalysis.raw_risk_factors
        )

        const executiveSummary = await generateExecutiveSummary(currentAnalysis);
        console.log(executiveSummary)

        const industryBenchmarks =await getIndustryBenchmarks(currentAnalysis.financial_ratios);
        console.log(industryBenchmarks)

        const finalReport = {
            filename: currentReportFile.originalname,
            key_metrics: currentAnalysis.key_metrics,
            risk_comparison:riskComparison,
            management_tone: currentAnalysis.management_tone,
            risk_summary: currentAnalysis.risk_summary,
            raw_risk_factors: currentAnalysis.raw_risk_factors,
            competitor_analysis: currentAnalysis.competitor_analysis, 
            previous_raw_risk_factors: previousAnalysis.raw_risk_factors,
            raw_management_discussion: currentAnalysis.raw_management_discussion,
            legal_summary:currentAnalysis.legal_summary,
            guidance_analysis:currentAnalysis.guidance_analysis,
            financial_statements:currentAnalysis.financial_statements,
            governance_changes:currentAnalysis.governance_changes,
            red_flags:currentAnalysis.red_flags,
            executive_summary:executiveSummary,
            financial_ratios:currentAnalysis.financial_ratios,
            industry_benchmarks: industryBenchmarks,
            debt_details:currentAnalysis.debt_details,
            esg_analysis: currentAnalysis.esg_analysis,
            footnote_summary: currentAnalysis.footnote_summary,
        };


        const newReport = new AnalysisReport(finalReport);
        await newReport.save();

        console.log(finalReport)

        console.log("Analysis report saved to MongoDB.");

        res.status(200).json(finalReport);

    } catch (error) {
        console.error("Error in orchestration logic:", error.message);
        if (error.response) {
            console.error("Error details from Python service:", error.response.data);
            return res.status(500).json({ 
                message: "An error occurred during analysis in the Python service.",
                details: error.response.data 
            });
        }
        res.status(500).json({ message: "An internal server error occurred." });
    }
};

exports.getAnalysisHistory=async(req,res)=>{
    try{
        const filename=req.params.filename;
        console.log(`Fetching history for filename:${filename}`)
        const reports=await AnalysisReport.find({filename:filename}).sort({uploadDate:-1});

        if(!reports || reports.length===0){
            return res.status(404).json({ message: "No historical data found for this file." });
        }
        res.status(200).json(reports)
    }
    catch(error){
        console.error("Error fetching analysis history:", error); 
        res.status(500).json({ message: "An internal server error occurred while fetching history." });
    }
}
exports.upload = upload;