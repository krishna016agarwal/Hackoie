import { chromium } from "playwright";

export const scrapeHackathon = async (url) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  const data = await page.evaluate(() => {

    const safeText = (el) =>
      el && el.innerText ? el.innerText.trim() : null;

    // Generic label-value extractor
    const getByLabel = (label) => {
      const elements = Array.from(document.querySelectorAll("span, div, p"));

      for (const el of elements) {
        const text = el.innerText?.trim();
        if (!text) continue;

        // STRICT match (not includes large content)
        if (text === label || text.startsWith(label + ":")) {
          const value =
            el.nextElementSibling?.innerText?.trim() ||
            text.replace(label + ":", "").trim();

          return value || null;
        }
      }
      return null;
    };

    return {
      name: safeText(document.querySelector("h1")),

      organization: safeText(
        document.querySelector("a[href*='/organization']")
      ),

      description: safeText(
        document.querySelector("div[data-testid='description']")
      ),

      date: getByLabel("Date"),
      location: getByLabel("Location"),
      teamSize: getByLabel("Team Size"),
    };
  });

  await browser.close();
  return data;
};
