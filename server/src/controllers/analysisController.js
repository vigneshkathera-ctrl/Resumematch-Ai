import { Analysis } from '../models/Analysis.js';
import { extractTextFromPdf } from '../services/pdfService.js';
import { aiService } from '../services/aiService.js';

export const createAnalysis = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume in PDF format.'
      });
    }

    const jobDescription = req.body.jobDescription?.trim();
    if (!jobDescription || jobDescription.length < 30) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a comprehensive job description (at least 30 characters).'
      });
    }

    // Extract text from the PDF file in memory
    const { text: resumeText } = await extractTextFromPdf(req.file.buffer);

    // Call the swappable AI service (with retry & Zod validation)
    const analysisResult = await aiService.analyzeResume({
      resumeText,
      jobDescription
    });

    // Save only the extracted text and analysis result, NOT the raw PDF binary
    const savedAnalysis = await Analysis.create({
      userId: req.user._id,
      jobTitle: analysisResult.jobTitle || 'Target Position',
      extractedResumeText: resumeText,
      jobDescription,
      matchScore: analysisResult.matchScore,
      matchedSkills: analysisResult.matchedSkills,
      missingKeywords: analysisResult.missingKeywords,
      sectionFeedback: analysisResult.sectionFeedback,
      improvedBullets: analysisResult.improvedBullets,
      topActions: analysisResult.topActions
    });

    res.status(201).json({
      success: true,
      data: savedAnalysis
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .select('jobTitle matchScore matchedSkills missingKeywords topActions createdAt updatedAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

