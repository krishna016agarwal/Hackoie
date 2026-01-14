import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { NormalizedLink } from "../controllers/hackathonLink.js";
import {
  createTicket,
  getMyCreatedTickets,
  getMyJoinedTickets,
  getIncomingRequests,
  getHomeFeed,
  deleteTicket,
  removeMemberFromTicket,
  leaveTicket
} from "../controllers/ticket.controller.js";

import { validateTicketBody } from "../middleware/validateTicket.js";
import { ticketIpLimiter } from "../middleware/rateLimit.js";
import { getTicketRecommendations } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.post("/", protect, ticketIpLimiter, validateTicketBody, createTicket);

router.get("/created", protect, getMyCreatedTickets);
router.get("/joined", protect, getMyJoinedTickets);
router.get("/requests", protect, getIncomingRequests);
// router.get("/", getHomeTickets)
router.get("/home", protect, getHomeFeed);
router.delete("/ticket/:ticketId", protect, deleteTicket);
router.delete("/:ticketId/member/:memberId", protect, removeMemberFromTicket);
router.post("/link", protect, NormalizedLink);
router.get("/ticket/:ticketId", protect, getTicketRecommendations);
router.delete("/left", protect, leaveTicket);

export default router;
