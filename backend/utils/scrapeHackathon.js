import { chromium } from "playwright-core";
import chromium_bin from "@sparticuz/chromium";

export const scrapeHackathon = async (url) => {
  let browser;

  try {
    if (process.env.VERCEL) {
      // CONFIG FOR VERCEL (Production)
      browser = await chromium.launch({
        args: chromium_bin.args,
        executablePath: await chromium_bin.executablePath(),
        headless: chromium_bin.headless,
      });
    } else {
      // CONFIG FOR WINDOWS (Local)
      // We use the full playwright package here to find your local browser automatically
      const playwrightLocal = await import("playwright");
      browser = await playwrightLocal.chromium.launch({ headless: true });
    }

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    // ---------- SCRAPPING LOGIC (UNCHANGED) ----------
    const data = await page.evaluate(() => {
      const safeText = (el) => (el && el.innerText ? el.innerText.trim() : null);

      const getByLabel = (label) => {
        const elements = Array.from(document.querySelectorAll("span, div, p, strong"));
        for (const el of elements) {
          const text = el.innerText?.trim();
          if (!text) continue;
          if (text.toLowerCase() === label.toLowerCase()) {
            return el.nextElementSibling?.innerText?.trim() || null;
          }
          if (text.toLowerCase().startsWith(label.toLowerCase() + ":")) {
            return text.replace(label + ":", "").trim();
          }
        }
        return null;
      };

      const MONTHS = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04",
        May: "05", Jun: "06", Jul: "07", Aug: "08",
        Sep: "09", Oct: "10", Nov: "11", Dec: "12"
      };

      const normalizeDate = (text) => {
        if (!text) return null;
        const exact = text.match(/(\d{1,2})\s?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?(\d{2,4})/i);
        if (exact) {
          let [, d, m, y] = exact;
          if (y.length === 2) y = "20" + y;
          return `${y}-${MONTHS[m]}-${d.padStart(2, "0")}`;
        }
        const range = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?(\d{1,2})\s?[-–]\s?\d{1,2},\s?(\d{4})/i);
        if (range) {
          let [, m, d, y] = range;
          return `${y}-${MONTHS[m]}-${d.padStart(2, "0")}`;
        }
        return null;
      };

      const getDateFromDOM = () => {
        for (const el of document.querySelectorAll("p, span, div")) {
          const parsed = normalizeDate(safeText(el));
          if (parsed) return parsed;
        }
        return null;
      };

      const getLocationFromDOM = () => {
        const byLabel = getByLabel("Location");
        if (byLabel) return byLabel;
        const paragraphs = Array.from(document.querySelectorAll("p"));
        for (let i = 0; i < paragraphs.length; i++) {
          const text = safeText(paragraphs[i]);
          if (text && text.toLowerCase().includes("happening in")) {
            return safeText(paragraphs[i + 1]);
          }
        }
        return null;
      };

      return {
        name: safeText(document.querySelector("h1")),
        organization: safeText(document.querySelector("h2")),
        description: safeText(document.querySelector("div[data-testid='description']")),
        date: getDateFromDOM(),
        location: getLocationFromDOM(),
        teamSize: getByLabel("Team Size"),
      };
    });
    // ---------- END OF SCRAPPING LOGIC ----------

    await browser.close();
    return data;

  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
};