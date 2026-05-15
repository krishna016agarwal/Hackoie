import { normalizeUrl } from "../utils/normalizeUrl.js";
import Hackathon from "../models/Hackathon.js";
import { generateHackathonKey } from "../utils/generateHackathonKey.js";
import { scrapeHackathon } from "../utils/scrapeHackathon.js";

export const NormalizedLink = async (req, res) => {
    try {
        let { rawUrl } = req.body;
        if (!rawUrl || typeof rawUrl !== "string") {
            return res.json({ status: false, text: "URL is required" });
        }

        // auto-add protocol if missing
        if (!rawUrl.startsWith("http")) {
            rawUrl = "https://" + rawUrl;
        }

        const url = new URL(rawUrl);

        // allow only http/https
        if (!["http:", "https:"].includes(url.protocol)) {

            return res.json({ status: false, text: "Unsupported URL protocol" });
        }
        const normalizedUrl = normalizeUrl(url);
        
        if (!normalizedUrl) return res.json({ status: false, text: "Error in normalizing the url" });

        const hackathonKey = generateHackathonKey(normalizedUrl);

        await Hackathon.findOneAndUpdate(
            { canonicalLink: normalizedUrl },
            { canonicalLink: normalizedUrl, hackathonKey },
            { upsert: true }
        );

        let scrapedData = {};


        scrapedData = await scrapeHackathon(normalizedUrl);
        const cleanData = Object.fromEntries(
            Object.entries(scrapedData ).map(([k, v]) => [k, v || null])
        );


        return res.json({ status: true, normalizedUrl, hackathonKey, cleanData });

    } catch (err) {
        return res.json({
            status: false,
            error: err.message || "Invalid URL"
        });
    }




};
