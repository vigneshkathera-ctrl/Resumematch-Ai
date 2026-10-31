import express from 'express';
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResumePdf } from '../middleware/uploadMiddleware.js';
import { analyzeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply auth protection to all analysis routes
router.use(protect);

// GET /api/analyses - Retrieve all past analyses for current user
router.get('/', getAnalyses);

// POST /api/analyses (and POST /api/analyze alias) - Analyze resume PDF against JD
router.post('/', analyzeLimiter, uploadResumePdf, createAnalysis);

// GET /api/analyses/:id - Retrieve specific analysis details
router.get('/:id', getAnalysisById);

// DELETE /api/analyses/:id - Remove an analysis
router.delete('/:id', deleteAnalysis);

export default router;

