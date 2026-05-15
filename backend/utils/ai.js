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
      model: "gemini-2.5-flash",
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
 -"ai/ml": "ai", "ml", "python", "data science", "deep learning", "statistics",
  -"ai": "artificial intelligence", "machine learning", "deep learning",
  -"ml": "machine learning", "python", "model training", "data science",
  -"deep learning": "neural networks", "cnn", "rnn", "transformers",
  -"nlp": "natural language processing", "transformers", "embeddings", "tokenization",
  -"computer vision": "image processing", "object detection", "cnn",
  -"data science": "python", "pandas", "numpy", "statistics", "data visualization",

  -"frontend": "react", "html", "css", "javascript", "ui", "ux", "responsive design",
  -"backend": "node", "express", "api", "authentication", "server",
 - "fullstack": "frontend", "backend", "api", "database",
 - "mern": "react", "node", "mongodb", "express",
 - "react": "react", "hooks", "state management",
 - "react native": "mobile development", "android", "ios",
 - "mobile development": "android", "ios", "react native", "native apps",

 - "system design": "scalability", "load balancing", "caching", "databases", "microservices",
 - "architecture design": "system architecture", "design patterns", "scalability",
 - "distributed systems": "consensus", "replication", "fault tolerance",
 - "microservices": "api gateway", "service discovery", "scalability",

 - "cloud computing": "aws", "gcp", "azure", "cloud services",
 - "aws": "ec2", "s3", "lambda", "cloudwatch",
 - "devops": "ci/cd", "docker", "kubernetes", "automation",
 - "docker": "containers", "containerization", "deployment",
 - "kubernetes": "orchestration", "scaling", "container management",

 - "blockchain": "smart contracts", "ethereum", "solidity", "web3",
 - "web3": "blockchain", "smart contracts", "decentralized apps",
 - "solidity": "ethereum", "smart contracts",

 - "database": "dbms", "sql", "nosql", "data modeling",
 - "dbms": "sql", "normalization", "transactions",
 - "mongodb": "nosql", "schema design", "aggregation",
 - "mysql": "sql", "indexes", "joins",
 - "postgresql": "sql", "transactions", "performance tuning",

 - "dsa": "data structures", "algorithms", "problem solving",
 - "algorithms": "sorting", "searching", "dynamic programming",
 - "competitive programming": "dsa", "algorithms", "time complexity",

 - "cybersecurity": "security", "encryption", "network security",
 - "ethical hacking": "penetration testing", "vulnerabilities", "security",
 - "hacking": "ethical hacking", "security testing",

 - "linux": "bash", "shell scripting", "os fundamentals",
 - "git": "version control", "branching", "collaboration",
 - "github": "git", "repositories", "ci/cd",
 - "windsurf": "ai ide", "developer tools",
 - "lovable": "ai ui", "product prototyping",
 - "inngest": "event driven", "background jobs", "workflows",
 - "clerk": "authentication", "user management",
 - "gemini": "ai models", "llm", "google ai",

  -"design": "ui", "ux", "product design",
  -"ui/ux": "wireframing", "prototyping", "usability",
 - "figma": "design tools", "ui design",

 - "robotics": "automation", "hardware", "control systems",
 - "drone": "uav", "aerial systems", "embedded systems",
 - "iot": "sensors", "embedded systems", "networking",

  -"radix": "blockchain infrastructure", "distributed ledger",
 - "operating systems": "process management", "memory management",
  -"computer networks": "tcp/ip", "network protocols", "routing",
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
