const express = require('express');
const analysisController=require('../controllers/analysercontroller')
const router = express.Router();

router.post('/analyze', analysisController.upload, analysisController.analyzeReport);

router.get('/history/:filename',analysisController.getAnalysisHistory);

module.exports = router;
