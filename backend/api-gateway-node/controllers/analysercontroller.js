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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
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

exports.upload = upload;