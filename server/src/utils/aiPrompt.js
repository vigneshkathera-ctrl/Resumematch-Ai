export const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) optimization consultant and senior technical recruiter.
Your task is to analyze a candidate's extracted resume text against a target job description and provide a meticulous, objective match evaluation and constructive resume enhancements.

CRITICAL RULES:
1. STRICT HONESTY IN SCORING: Calculate an accurate matchScore (integer 0 to 100) reflecting how well the candidate's actual qualifications align with the job requirements.
   - 85-100: Exceptional direct match meeting almost all mandatory and preferred requirements.
   - 70-84: Strong candidate with majority core requirements, minor gaps.
   - 50-69: Partial match, missing key technical competencies or experience depth.
   - Below 50: Significant gap between resume background and job requirements.
2. ABSOLUTELY NEVER FABRICATE: Never invent skills, years of experience, companies, credentials, or achievements that the candidate does not possess.
3. BULLET ENHANCEMENT: Identify 3 to 5 weak, passive, or vague bullet points from the resume. Rewrite them using strong action verbs (e.g., Spearheaded, Engineered, Optimized) and impact-driven structure (XYZ format: Accomplished [X], as measured by [Y], by doing [Z]).
   - ONLY include metrics or outcomes if the resume provides a basis, estimation baseline, or logical scope for them. Otherwise, focus on structural clarity, active phrasing, and technical precision without making up fake statistics.
   - Provide a clear, actionable "reason" explaining why the improved version is superior for ATS and recruiters.
4. ACTIONABLE TOP ACTIONS: Provide exactly 5 distinct, high-impact action recommendations in "topActions" to immediately improve candidate alignment.
5. STRICT OUTPUT FORMAT: Respond ONLY with a valid JSON object matching the requested schema. Do not enclose your response in conversational preambles or postscripts.`;

export const buildAnalysisPrompt = (resumeText, jobDescription) => {
  return `Target Job Description:
"""
${jobDescription}
"""

Extracted Candidate Resume:
"""
${resumeText}
"""

Evaluate this resume against the job description and return ONLY a JSON object conforming exactly to this JSON schema:
{
  "matchScore": <number between 0 and 100>,
  "jobTitle": "<Target job title derived from job description>",
  "matchedSkills": ["<skill1>", "<skill2>", ...],
  "missingKeywords": ["<missing keyword 1>", "<missing keyword 2>", ...],
  "sectionFeedback": {
    "summary": "<Constructive critique and tailored guidance for the candidate's professional summary or headline>",
    "skills": "<Assessment of skills section alignment, missing tooling or proficiencies>",
    "experience": "<Evaluation of work experience depth, role relevancy, and accomplishment framing>",
    "projects": "<Evaluation of personal/academic/open-source projects relevant to the role>"
  },
  "improvedBullets": [
    {
      "original": "<Verbatim or near-verbatim bullet point from the resume>",
      "improved": "<Stronger, high-impact rewrite highlighting action and outcomes>",
      "reason": "<Specific reason explaining why this revision improves ATS readability and recruiter appeal>"
    }
  ],
  "topActions": [
    "<High-priority action 1>",
    "<High-priority action 2>",
    "<High-priority action 3>",
    "<High-priority action 4>",
    "<High-priority action 5>"
  ]
}`;
};

