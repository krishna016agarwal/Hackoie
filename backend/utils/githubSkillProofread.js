import axios from "axios";

const GITHUB_API = "https://api.github.com";

const LANGUAGE_TO_SKILL_MAP = {
  javascript: ["javascript", "node.js", "react", "frontend"],
  typescript: ["typescript", "node.js", "react", "frontend"],
  python: ["python", "ml", "ai", "backend"],
  java: ["java", "spring", "backend"],
  "c++": ["c++", "dsa"],
  c: ["c", "systems"],
  go: ["golang", "backend", "systems"],
  rust: ["rust", "systems", "web3"],
  solidity: ["solidity", "web3", "smart-contracts"],
  html: ["html", "frontend"],
  css: ["css", "frontend"],
  dart: ["dart", "flutter", "mobile"],
  kotlin: ["kotlin", "android", "mobile"],
  swift: ["swift", "ios", "mobile"],
  php: ["php", "backend"],
};

const TOPIC_TO_SKILL_MAP = {
  react: "react",
  nextjs: "next.js",
  next: "next.js",
  express: "express",
  nodejs: "node.js",
  node: "node.js",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  machinelearning: "ml",
  deeplearning: "ai",
  ai: "ai",
  nlp: "nlp",
  blockchain: "web3",
  web3: "web3",
  mongodb: "mongodb",
  postgresql: "postgresql",
  docker: "docker",
  kubernetes: "kubernetes",
};

const parseGithubUsername = (value) => {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (!trimmed.includes("/")) {
    return trimmed.replace(/^@/, "").toLowerCase();
  }

  try {
    const withProtocol = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    if (!url.hostname.includes("github.com")) return null;
    const [username] = url.pathname.split("/").filter(Boolean);
    return username ? username.toLowerCase() : null;
  } catch {
    return null;
  }
};

const scoreGithubSignal = ({
  publicRepos,
  followers,
  accountAgeYears,
  totalStars,
  activeRepos,
  inferredSkillsCount,
}) => {
  let score = 0;

  score += Math.min(publicRepos, 30) * 0.8;
  score += Math.min(followers, 150) * 0.15;
  score += Math.min(accountAgeYears * 8, 24);
  score += Math.min(totalStars, 200) * 0.12;
  score += Math.min(activeRepos, 20) * 1.2;
  score += Math.min(inferredSkillsCount, 12) * 2.5;

  return Math.max(0, Math.min(100, Math.round(score)));
};

const getConfidence = (score) => {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  return "low";
};

const buildHeaders = () => {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "hackoie-github-verifier",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

const fetchAllRepos = async (username) => {
  const headers = buildHeaders();
  const repos = [];

  for (let page = 1; page <= 3; page += 1) {
    const { data } = await axios.get(
      `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100&page=${page}`,
      { headers }
    );

    if (!Array.isArray(data) || data.length === 0) break;
    repos.push(...data);

    if (data.length < 100) break;
  }

  return repos;
};

export const analyzeGithubSkillSignal = async (githubInput) => {
  const username = parseGithubUsername(githubInput);

  if (!username) {
    return {
      status: "not_provided",
      score: 0,
      confidence: "low",
      summary: "No valid GitHub username/profile provided.",
      inferredSkills: [],
      analyzedAt: new Date(),
      username: null,
      profile: null,
    };
  }

  try {
    const headers = buildHeaders();

    const { data: profile } = await axios.get(`${GITHUB_API}/users/${username}`, {
      headers,
    });

    const repos = await fetchAllRepos(username);

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const activeRepos = repos.filter((repo) => {
      const lastPush = repo.pushed_at ? new Date(repo.pushed_at).getTime() : 0;
      const sixMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 180;
      return lastPush >= sixMonthsAgo;
    }).length;

    const languageBuckets = new Map();
    const topicBuckets = new Map();

    repos.forEach((repo) => {
      if (repo.language) {
        const key = repo.language.toLowerCase();
        languageBuckets.set(key, (languageBuckets.get(key) || 0) + 1);
      }

      if (Array.isArray(repo.topics)) {
        repo.topics.forEach((topic) => {
          const key = String(topic).toLowerCase();
          topicBuckets.set(key, (topicBuckets.get(key) || 0) + 1);
        });
      }
    });

    const topLanguages = [...languageBuckets.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([language, count]) => ({ language, count }));

    const topTopics = [...topicBuckets.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));

    const inferredSkillSet = new Set();

    topLanguages.forEach(({ language }) => {
      const mappedSkills = LANGUAGE_TO_SKILL_MAP[language] || [language];
      mappedSkills.forEach((skill) => inferredSkillSet.add(skill));
    });

    topTopics.forEach(({ topic }) => {
      const mapped = TOPIC_TO_SKILL_MAP[topic];
      if (mapped) inferredSkillSet.add(mapped);
    });

    const createdAt = profile.created_at ? new Date(profile.created_at) : new Date();
    const accountAgeYears = Math.max(
      0,
      Number(((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365)).toFixed(1))
    );

    const inferredSkills = [...inferredSkillSet].slice(0, 12);

    const score = scoreGithubSignal({
      publicRepos: profile.public_repos || 0,
      followers: profile.followers || 0,
      accountAgeYears,
      totalStars,
      activeRepos,
      inferredSkillsCount: inferredSkills.length,
    });

    return {
      status: "verified",
      score,
      confidence: getConfidence(score),
      summary: `GitHub signal built from ${repos.length} public repos with ${activeRepos} recently active repos.`,
      inferredSkills,
      analyzedAt: new Date(),
      username,
      profile: {
        publicRepos: profile.public_repos || 0,
        followers: profile.followers || 0,
        following: profile.following || 0,
        accountAgeYears,
        totalStars,
        totalForks,
        activeRepos,
        topLanguages,
        topTopics,
      },
    };
  } catch (error) {
    const message =
      error?.response?.status === 404
        ? "GitHub profile not found."
        : "Could not verify GitHub right now.";

    return {
      status: "error",
      score: 0,
      confidence: "low",
      summary: message,
      inferredSkills: [],
      analyzedAt: new Date(),
      username,
      profile: null,
    };
  }
};
