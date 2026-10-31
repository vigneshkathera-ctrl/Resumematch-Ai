import { GeminiProvider, extractJsonFromText } from './geminiProvider.js';
import { aiAnalysisOutputSchema } from '../utils/validationSchemas.js';
import { truncateText } from './pdfService.js';

class AIService {
  constructor(provider = new GeminiProvider()) {
    this.provider = provider;
  }

  /**
   * Swap out the AI provider implementation at runtime or configuration.
   * @param {object} provider
   */
  setProvider(provider) {
    this.provider = provider;
  }

  /**
   * Evaluates resume against job description and validates result against Zod schema.
   * Retries once on validation or JSON parsing failure.
   * @param {object} params
   * @param {string} params.resumeText
   * @param {string} params.jobDescription
   * @returns {Promise<import('zod').infer<typeof aiAnalysisOutputSchema>>}
   */
  async analyzeResume({ resumeText, jobDescription }) {
    if (!resumeText || !jobDescription) {
      const err = new Error('Both resume text and job description are required for analysis.');
      err.statusCode = 400;
      throw err;
    }

    // Safely truncate very long inputs to protect token window & rate limits
    const safeResume = truncateText(resumeText, 15000);
    const safeJD = truncateText(jobDescription, 10000);

    let lastError = null;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const rawOutput = await this.provider.generateAnalysis(
          safeResume,
          safeJD,
          attempt === 2
            ? 'Return ONLY valid, parseable JSON strictly adhering to the requested schema. Do not include markdown code block notation.'
            : null
        );

        const cleanedJson = extractJsonFromText(rawOutput);
        const parsed = JSON.parse(cleanedJson);

        // Validate strictly using Zod
        const validatedData = aiAnalysisOutputSchema.parse(parsed);

        // Clamp matchScore cleanly to 0-100 range in case of float/boundary
        validatedData.matchScore = Math.min(100, Math.max(0, Math.round(validatedData.matchScore)));

        return validatedData;
      } catch (err) {
        lastError = err;
        console.warn(`[AIService] Attempt ${attempt} failed: ${err.message}`);

        // If rate limit error or auth error from provider, propagate immediately without unnecessary retry
        if (err.status === 429 || err.message?.includes('429') || err.message?.includes('quota')) {
          const rateErr = new Error('AI service rate limit reached. Please wait a moment and try again.');
          rateErr.statusCode = 429;
          throw rateErr;
        }

        if (err.status === 401 || err.status === 403 || err.message?.includes('API_KEY')) {
          const authErr = new Error('AI service authentication failed. Please verify the API key.');
          authErr.statusCode = 500;
          throw authErr;
        }

        if (attempt === maxAttempts) {
          break;
        }
      }
    }

    // If both attempts failed, return a clean error
    const finalErr = new Error(
      `Failed to generate valid structured analysis: ${lastError?.message || 'Invalid format'}`
    );
    finalErr.statusCode = 502;
    throw finalErr;
  }
}

export const aiService = new AIService();

