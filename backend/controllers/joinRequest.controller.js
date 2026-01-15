import JoinRequest from "../models/JoinRequest.js";
import Ticket from "../models/ticket.js";
import Recommendation from "../models/recommendation.js";


// 🚀 SEND REQUEST
export const sendJoinRequest = async (req, res) => {
    try {
        const { ticketId, userId } = req.body;
        const requesterId = req.user._id;
        if (!req.user.isProfileComplete) {
            return res.json({
                message: "Complete your profile before sending reuests"
            });
        }
        // 1️⃣ Validate ticket ownership
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (ticket.createdBy.toString() !== requesterId.toString()) {
            return res.json({ message: "Not authorized" });
        }

        // 2️⃣ Prevent sending request to self
        if (userId.toString() === requesterId.toString()) {
            return res.json({ message: "Cannot invite yourself" });
        }

        // 3️⃣ Prevent requesting existing member
        if (ticket.members.includes(userId)) {
            return res.json({ message: "User already in team" });
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
     //   console.log(err);
        if (err.code === 11000) {
            return res.json({
                message: "Request already sent"
            });
        }

        console.error(err);
        res.json({ message: "Failed to send request" });
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
        res.json({
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
            return res.json({ message: "Invalid action" });
        }

        const request = await JoinRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // 🔐 Only receiver can respond
        if (request.requestedTo.toString() !== req.user._id.toString()) {
            return res.json({ message: "Unauthorized" });
        }

        // ❌ Prevent double action
        if (request.status !== "PENDING") {
            return res.json({
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
            await JoinRequest.deleteOne({ _id: request._id });

            return res.json({
                status: false,
                message: "Team is already full"
            });
        }

        // 🚫 Already member
        if (ticket.members.includes(req.user._id)) {
            await JoinRequest.deleteOne({ _id: request._id });

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

            await JoinRequest.deleteOne({ _id: request._id });



            return res.json({
                status: false,
                message:
                    "You have already joined another team for this hackathon. This request has been cancelled."
            });
        }

        // ✅ Accept request
        await JoinRequest.deleteOne({ _id: request._id });

        // ✅ Add member to team
        await Ticket.findByIdAndUpdate(ticket._id, {
            $addToSet: { members: req.user._id }
        });



        return res.json({
            status: true,
            message: "You have successfully joined the team"
        });

    } catch (error) {

        res.json({
            status: false,
            message: "Failed to respond to join request"
        });
    }
};


