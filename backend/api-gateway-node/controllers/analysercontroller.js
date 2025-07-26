const multer=require('multer')
const AnalysisReport=require('../models/AnalysisReport')
const FormData=require('form-data')
const axios=require('axios')

const storage=multer.memoryStorage();

const upload=multer({storage:storage}).fields([
    {name:'currentReport',maxCount:1},
    {name:'previousReport',maxCount:1}
]);

exports.analyzeReport = async (req, res) => {
    try{
    console.log('FIles received by server,Preparing to call Python service...')

    if (!req.files || !req.files.currentReport) {
        return res.status(400).json({ message: "Please upload both current and previous reports." });
    }

    const form=new FormData();
    const currentReportFile=req.files.currentReport[0]
    form.append('file',currentReportFile.buffer,{
        filename:currentReportFile.originalname,
        contentType:currentReportFile.mimetype,
    })

    console.log('Calling Python service at:', process.env.PYTHON_SERVICE_URL);
    const response=await axios.post(process.env.PYTHON_SERVICE_URL,form,{
        headers:{
            ...form.getHeaders()
        }
    })

    const analysisData=response.data;
    console.log("Received analysis from Python service:", analysisData);

    const newReport=new AnalysisReport({
        filename: analysisData.filename,
        key_metrics: analysisData.key_metrics,
        management_tone: analysisData.management_tone,
        risk_summary: analysisData.risk_summary,
        raw_risk_factors: analysisData.raw_risk_factors,
        raw_management_discussion: analysisData.raw_management_discussion,
    });

    await newReport.save();
    console.log("Analysis report saved to MongoDB.");

    res.status(200).json(analysisData);
}
catch(error){
    console.error("Error in orchestration logic:", error.message);
    // Provide more detailed error feedback to the client
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


exports.upload=upload