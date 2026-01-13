import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicketRequirementsAndDescription = async (requirementsText) => {

 if (!requirementsText || !requirementsText.trim()) {
    return {
      description: "",
      requirements: []
    };
  }

  const agent = createAgent({
    model: gemini({
      model: "gemini-2.5-pro",
      apiKey: process.env.GEMINI_API_KEY
    }),
    name: "Hackathon Requirement & Description Generator",
    system: `
You are an expert AI assistant for a hackathon team-matching platform.

TASKS:
1. Generate a professional, eye-catching English description for teammate requirements.
2. Extract and normalize requirements into a clean array.

DESCRIPTION RULES:
- Professional and clear English
- Suitable for hackathon / competition postings
- Mention skills, college, year, and collaboration tone
- Do NOT mention the word "AI" or "generated"

REQUIREMENTS RULES:
- Return lowercase strings
- Remove duplicates
- Normalize college names (e.g. netaji subhas university of technology → nsut)
- Expand skills:
  - "ai/ml" → ai, ml, python, data science
  - "frontend" → react, html, css, javascript
  - "backend" → node, express, api
  - "mern" → react, node, mongodb, express
- Year normalization:
  - "1st year" → first year
  - "2nd year" → second year

OUTPUT FORMAT (STRICT):
Return ONLY raw JSON.
NO markdown.
NO explanations.

JSON STRUCTURE:
{
  "description": "string",
  "requirements": ["string"]
}

If no requirements exist, return:
{
  "description": "",
  "requirements": []
}
`
  });

  const response = await agent.run(`
Generate a professional description and normalized requirements from this input:

"${requirementsText}"
`);

  const raw = response.output?.[0]?.content;

  const cleanJSON = (text) => {
    if (!text) return null;
    return text.replace(/```json|```/gi, "").trim();
  };

  try {
    const cleaned = cleanJSON(raw);
    const parsed = JSON.parse(cleaned);

    return {
      description: parsed.description || "",
      requirements: Array.isArray(parsed.requirements)
        ? parsed.requirements
        : []
    };
  } catch (err) {
    console.error("❌ AI parse failed:", err.message);
    return {
      description: "",
      requirements: []
    };
  }
};

export default analyzeTicketRequirementsAndDescription;
