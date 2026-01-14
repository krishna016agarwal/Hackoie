export const normalizeUrl = (input) => {
  if (!input) return null;

  let url;

  try {
    url = new URL(input);
  } catch (err) {
    throw new Error("Invalid URL");
  }

  // Remove hash & query
  url.hash = "";
  url.search = "";

  const hostname = url.hostname.toLowerCase();

  // ---------------------------
  // DOMAIN-SPECIFIC RULES
  // ---------------------------

  // DEVFOLIO → subdomain is unique hackathon
  if (hostname.endsWith("devfolio.co")) {
    return `https://${hostname}`;
  }

  // UNSTOP → usually path-based
  if (hostname.includes("unstop.com")) {
    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    // Keep first 2 meaningful segments only
    // /hackathons/<slug>
    if (parts[0] === "hackathons" && parts[1]) {
      return `https://${hostname}/hackathons/${parts[1]}`;
    }
  }

  // DEFAULT (safe fallback)
  return `${url.protocol}//${hostname}${url.pathname.replace(/\/$/, "")}`;
};
