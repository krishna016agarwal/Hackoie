import JoinRequest from "../models/JoinRequest.js";
import Ticket from "../models/ticket.js";
import Recommendation from "../models/recommendation.js";
import { inngest } from "../inngest/client.js";

// 🚀 SEND REQUEST
export const sendJoinRequest = async (req, res) => {
    try {
        const { ticketId, userId } = req.body;
        const requesterId = req.user._id;

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

        // 👉 If REJECTED → simple update
        if (status === "REJECTED") {
            request.status = "REJECTED";
            await request.save();

            return res.json({
                status: true,
                message: "Request rejected"
            });
        }

        // ✅ ACCEPT FLOW (SAFE)
        const ticket = await Ticket.findById(request.ticket);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // 🚫 Team size full check
        if (ticket.members.length >= ticket.teamSize) {
            return res.status(400).json({
                message: "Team is already full"
            });
        }

        // 🚫 Already a member check (extra safety)
        if (ticket.members.includes(req.user._id)) {
            return res.status(400).json({
                message: "You are already part of this team"
            });
        }
        // 🚫 Check if user is already in another team for this hackathon
        const existingTeam = await Ticket.findOne({
            hackathonKey: ticket.hackathonKey,
            members: req.user._id
        });

        if (existingTeam) {
            // Update the request status to CANCELLED
            request.status = "CANCELLED";
            await request.save();
            
            await inngest.send({
                name: "ticket/team.updated",
                data: {
                    ticketId: ticket._id.toString(),
                    hackathonKey: ticket.hackathonKey,
                    joinedUserId: req.user._id.toString()
                }
            });
            return res.status(400).json({
                message: "You have already joined another team for this hackathon. This request has been cancelled."
            });
        }

        // ✅ Update request status
        request.status = "ACCEPTED";
        await request.save();

        // ✅ Add user to team
        await Ticket.findByIdAndUpdate(ticket._id, {
            $addToSet: { members: req.user._id }
        });
        await inngest.send({
            name: "ticket/team.updated",
            data: {
                ticketId: ticket._id.toString(),
                hackathonKey: ticket.hackathonKey,
                joinedUserId: req.user._id.toString()
            }
        });
        return res.json({
            status: true,
            message: "You have successfully joined the team"
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Failed to respond to join request",
            error: error.message
        });
    }

};

