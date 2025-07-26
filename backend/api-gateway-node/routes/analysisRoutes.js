const express = require('express');
const analysisController=require('../controllers/analysercontroller')
const router = express.Router();

router.post('/analyze', analysisController.upload, analysisController.analyzeReport);


module.exports = router;
