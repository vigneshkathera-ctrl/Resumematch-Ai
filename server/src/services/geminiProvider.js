import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildAnalysisPrompt } from '../utils/aiPrompt.js';

/**
 * Clean potential markdown wrappers from JSON string responses.
 * @param {string} raw
 * @returns {string}
 */
export const extractJsonFromText = (raw) => {
  if (!raw) return '';
  let cleaned = raw.trim();

  // Strip ```json ... ``` or ``` ... ``` code blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // If there are still surrounding characters, find the outer curly braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
};

export class GeminiProvider {
  getPrimaryModel() {
    return process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  }

  getApiKey() {
    return process.env.GEMINI_API_KEY;
  }

  /**
   * Generates analysis output using the Gemini API.
   * Automatically falls back across resilient model candidates if a model
   * experiences temporary 503 high-demand or rate spikes.
   * @param {string} resumeText
   * @param {string} jobDescription
   * @param {string} [instructionOverride]
   * @returns {Promise<string>} Raw text output from model
   */
  async generateAnalysis(resumeText, jobDescription, instructionOverride = null) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      const error = new Error(
        'GEMINI_API_KEY is not configured on the server. Please check your environment variables.'
      );
      error.statusCode = 500;
      throw error;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const primary = this.getPrimaryModel();

    // Priority-ordered candidate models: fast, reliable lite models first to avoid 503 spikes
    const candidateModels = Array.from(
      new Set([
        primary,
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.8-flash',
        'gemini-3.5-flash'
      ])
    );

    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        console.log(`[GeminiProvider] Attempting generation with model: ${modelName}`);

        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: instructionOverride || SYSTEM_PROMPT,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const prompt = buildAnalysisPrompt(resumeText, jobDescription);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (text) {
          console.log(`[GeminiProvider] Generation succeeded using ${modelName}`);
          return text;
        }
      } catch (err) {
        lastError = err;
        const errMsg = err.message || '';
        const isDemandSpike =
          err.status === 503 ||
          errMsg.includes('503') ||
          errMsg.includes('high demand') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('ResourceExhausted') ||
          errMsg.includes('quota');

        if (isDemandSpike) {
          console.warn(
            `[GeminiProvider] Model ${modelName} is experiencing demand limits (503). Auto-switching to fallback...`
          );
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }

        // For auth errors, rethrow immediately
        if (errMsg.includes('API_KEY_INVALID') || err.status === 401 || err.status === 403) {
          throw err;
        }

        console.warn(`[GeminiProvider] Model ${modelName} error: ${errMsg}. Trying next candidate...`);
      }
    }

    throw lastError || new Error('All candidate Gemini models failed to generate content.');
  }
}
