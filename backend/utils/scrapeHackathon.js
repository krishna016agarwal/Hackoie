import { chromium } from "playwright-core";
import chromium_bin from "@sparticuz/chromium";

export const scrapeHackathon = async (url) => {
  let browser = null;

  try {
    const options = process.env.VERCEL 
      ? {
          args: [...chromium_bin.args, "--disable-gpu", "--single-process"],
          executablePath: await chromium_bin.executablePath(),
          headless: chromium_bin.headless,
        }
      : { headless: true };

    // Use full playwright locally, playwright-core on Vercel
    const launcher = process.env.VERCEL ? chromium : (await import("playwright")).chromium;
    browser = await launcher.launch(options);

    const context = await browser.newContext();
    const page = await context.newPage();

    // CRITICAL: Block heavy assets to save RAM
    await page.route('**/*', (route) => {
      const type = route.request().resourceType();
      if (['image', 'font', 'media', 'stylesheet'].includes(type)) {
        return route.abort();
      }
      route.continue();
    });

    // Unstop is a heavy SPA, we need networkidle but with a strict timeout
    await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });

    const data = await page.evaluate(() => {
      // ... (KEEP YOUR EXACT SCRAPPING LOGIC HERE) ...
      const safeText = (el) => (el && el.innerText ? el.innerText.trim() : null);
      const getByLabel = (label) => {
        const elements = Array.from(document.querySelectorAll("span, div, p, strong"));
        for (const el of elements) {
          const text = el.innerText?.trim();
          if (!text) continue;
          if (text.toLowerCase() === label.toLowerCase()) return el.nextElementSibling?.innerText?.trim() || null;
          if (text.toLowerCase().startsWith(label.toLowerCase() + ":")) return text.replace(label + ":", "").trim();
        }
        return null;
      };
      const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
      const normalizeDate = (text) => {
        if (!text) return null;
        const exact = text.match(/(\d{1,2})\s?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?(\d{2,4})/i);
        if (exact) { let [, d, m, y] = exact; if (y.length === 2) y = "20" + y; return `${y}-${MONTHS[m]}-${d.padStart(2, "0")}`; }
        const range = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?(\d{1,2})\s?[-–]\s?\d{1,2},\s?(\d{4})/i);
        if (range) { let [, m, d, y] = range; return `${y}-${MONTHS[m]}-${d.padStart(2, "0")}`; }
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
          if (text && text.toLowerCase().includes("happening in")) return safeText(paragraphs[i + 1]);
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

    return data;

  } catch (error) {
    console.error("Scraper Error:", error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close(); // Forces RAM cleanup
    }
  }
};