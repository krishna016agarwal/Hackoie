import JoinRequest from "../models/JoinRequest.js";
import Ticket from "../models/ticket.js";
import Recommendation from "../models/recommendation.js";
import { inngest } from "../inngest/client.js";

// 🚀 SEND REQUEST
export const sendJoinRequest = async (req, res) => {
    try {
        const { ticketId, userId } = req.body;
        const requesterId = req.user._id;
        if (!req.user.isProfileComplete) {
            return res.status(403).json({
                message: "Complete your profile before sending reuests"
            });
        }
        // 1️⃣ Validate ticket ownership
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.createdBy.toString() !== requesterId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // 2️⃣ Prevent sending request to self
        if (userId.toString() === requesterId.toString()) {
            return res.status(400).json({ message: "Cannot invite yourself" });
        }

        // 3️⃣ Prevent requesting existing member
        if (ticket.members.includes(userId)) {
            return res.status(400).json({ message: "User already in team" });
        }

        // 4️⃣ Get recommendation data (optional but powerful)
        const recommendation = await Recommendation.findOne(
            { ticket: ticketId, "recommendations.user": userId },
            { "recommendations.$": 1 }
        );

        const recData = recommendation?.recommendations?.[0];

        // 5️⃣ Create request
        const joinRequest = await JoinRequest.create({
            ticket: ticketId,
            hackathonKey: ticket.hackathonKey,
            requestedBy: requesterId,
            requestedTo: userId,

        });

        return res.status(201).json({
            status: true,
            message: "Join request sent",
            joinRequest
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "Request already sent"
            });
        }

        console.error(err);
        res.status(500).json({ message: "Failed to send request" });
    }
};


// 📥 GET REQUESTS RECEIVED (for user)
export const getReceivedJoinRequests = async (req, res) => {
    try {
        const requests = await JoinRequest.find({
            requestedTo: req.user._id,
            status: "PENDING"
        })
            .populate("ticket", "title description teamSize hackathonLink createdBy members organization hackathonName date location")
            .populate("requestedBy", "name email college skills year branch github linkedin")
            .lean();

        res.json({ status: true, requests });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to fetch join requests",
            error: error.message
        });
    }

};

const safeInngestSend = async ({ ticketId, hackathonKey, joinedUserId }) => {
    try {
        await inngest.send({
            name: "ticket/team.updated",
            data: {
                ticketId: ticketId.toString(),
                hackathonKey,
                joinedUserId: joinedUserId.toString()
            }
        });
    } catch (err) {
        console.error("Inngest failed (ignored):", err.message);
        // ❌ DO NOTHING — DB & API should continue
    }
};


// 📤 RESPOND TO REQUEST
export const respondToJoinRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        if (!["ACCEPTED", "REJECTED"].includes(status)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const request = await JoinRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // 🔐 Only receiver can respond
        if (request.requestedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // ❌ Prevent double action
        if (request.status !== "PENDING") {
            return res.status(400).json({
                message: `Request already ${request.status.toLowerCase()}`
            });
        }

        // 👉 REJECT FLOW
        if (status === "REJECTED") {
            request.status = "REJECTED";
            await request.save();

            return res.json({
                status: true,
                message: "Request rejected"
            });
        }

        // ✅ ACCEPT FLOW
        const ticket = await Ticket.findById(request.ticket);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // 🚫 Team full
        if (ticket.members.length >= ticket.teamSize) {
            request.status = "CANCELLED";
            await request.save();

            return res.json({
                status: false,
                message: "Team is already full"
            });
        }

        // 🚫 Already member
        if (ticket.members.includes(req.user._id)) {
            safeInngestSend({
                ticketId: ticket._id,
                hackathonKey: ticket.hackathonKey,
                joinedUserId: req.user._id
            });

            return res.json({
                status: false,
                message: "You are already part of this team"
            });
        }

        // 🚫 Already in another team for same hackathon
        const existingTeam = await Ticket.findOne({
            hackathonKey: ticket.hackathonKey,
            members: req.user._id
        });

        if (existingTeam) {
            request.status = "CANCELLED";
            await request.save();

            safeInngestSend({
                ticketId: ticket._id,
                hackathonKey: ticket.hackathonKey,
                joinedUserId: req.user._id
            });

            return res.json({
                status: false,
                message:
                    "You have already joined another team for this hackathon. This request has been cancelled."
            });
        }

        // ✅ Accept request
        request.status = "ACCEPTED";
        await request.save();

        // ✅ Add member to team
        await Ticket.findByIdAndUpdate(ticket._id, {
            $addToSet: { members: req.user._id }
        });

        // 🔔 Inngest (NON-BLOCKING)
        safeInngestSend({
            ticketId: ticket._id,
            hackathonKey: ticket.hackathonKey,
            joinedUserId: req.user._id
        });

        return res.json({
            status: true,
            message: "You have successfully joined the team"
        });

    } catch (error) {

        res.status(500).json({
            status: false,
            message: "Failed to respond to join request"
        });
    }
};


