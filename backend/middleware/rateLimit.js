import rateLimit from "express-rate-limit";

/**
 * Limit ticket creation per IP
 * Prevents bot spam & AI abuse
 */
export const ticketIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: "Too many requests from this IP. Please try again later."
  }
});
