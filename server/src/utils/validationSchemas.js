import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const improvedBulletSchema = z.object({
  original: z.string().min(1, 'Original bullet point is required'),
  improved: z.string().min(1, 'Improved bullet point is required'),
  reason: z.string().min(1, 'Reason for improvement is required')
});

export const sectionFeedbackSchema = z.object({
  summary: z.string().default(''),
  skills: z.string().default(''),
  experience: z.string().default(''),
  projects: z.string().default('')
});

export const aiAnalysisOutputSchema = z.object({
  matchScore: z.number().min(0).max(100),
  jobTitle: z.string().min(1, 'Job title is required'),
  matchedSkills: z.array(z.string()).default([]),
  missingKeywords: z.array(z.string()).default([]),
  sectionFeedback: sectionFeedbackSchema,
  improvedBullets: z.array(improvedBulletSchema).default([]),
  topActions: z.array(z.string()).min(1, 'At least one action recommendation is required')
});

