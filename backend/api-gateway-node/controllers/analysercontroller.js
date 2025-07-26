const multer=require('multer')

const storage=multer.memoryStorage();

const upload=multer({storage:storage}).fields([
    {name:'currentReport',maxCount:1},
    {name:'previousReport',maxCount:1}
]);

exports.analyzeReport = async (req, res) => {
    console.log('FIles received by server')
    console.log(req.files)

    if (!req.files || !req.files.currentReport || !req.files.previousReport) {
        return res.status(400).json({ message: "Please upload both current and previous reports." });
    }

    res.status(200).json({ 
        message: "Files received successfully. Ready for analysis on Day 11." 
    });
};


exports.upload=upload