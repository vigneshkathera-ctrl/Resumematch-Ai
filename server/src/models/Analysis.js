import mongoose from 'mongoose';
import { MemoryAnalysis, isMongoConnected } from './store.js';

const improvedBulletSchema = new mongoose.Schema(
  {
    original: { type: String, required: true },
    improved: { type: String, required: true },
    reason: { type: String, required: true }
  },
  { _id: false }
);

const sectionFeedbackSchema = new mongoose.Schema(
  {
    summary: { type: String, default: '' },
    skills: { type: String, default: '' },
    experience: { type: String, default: '' },
    projects: { type: String, default: '' }
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true
    },
    extractedResumeText: {
      type: String,
      required: true
    },
    jobDescription: {
      type: String,
      required: true
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    matchedSkills: {
      type: [String],
      default: []
    },
    missingKeywords: {
      type: [String],
      default: []
    },
    sectionFeedback: {
      type: sectionFeedbackSchema,
      default: () => ({})
    },
    improvedBullets: {
      type: [improvedBulletSchema],
      default: []
    },
    topActions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const MongooseAnalysis = mongoose.model('Analysis', analysisSchema);

// Resilient wrapper: uses MongoDB when connected, in-memory store when offline
export const Analysis = new Proxy(MongooseAnalysis, {
  get(target, prop) {
    if (!isMongoConnected() && prop in MemoryAnalysis) {
      return MemoryAnalysis[prop];
    }
    return target[prop];
  }
});
