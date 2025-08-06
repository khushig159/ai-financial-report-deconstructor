import express from 'express';
const router = express.Router();
import { upload, analyzeReport, getAnalysisHistory,explainChart } from '../controllers/analysercontroller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/analyze', verifyToken, upload, analyzeReport);

router.get('/history/:ticker', verifyToken,getAnalysisHistory);

router.post('/explain',verifyToken,explainChart)

export default router;