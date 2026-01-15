import Recommendation from "../models/recommendation.js";
import Ticket from "../models/ticket.js";

export const getTicketRecommendations = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user._id;

        // 1️⃣ Validate ticket & ownership
        const ticket = await Ticket.findById(ticketId).select("createdBy");
        if (!ticket) {
            return res.status(404).json({
                status: false,
                message: "Ticket not found"
            });
        }

        if (ticket.createdBy.toString() !== userId.toString()) {
            return res.json({
                status: false,
                message: "You are not authorized to view recommendations"
            });
        }

        // 2️⃣ Fetch recommendations
        const recommendation = await Recommendation.findOne({
            ticket: ticketId
        })
            .populate({
                path: "recommendations.user",
                select: `
          name email phone skills
          college branch year
          github linkedin
        `
            })
            .lean();

        if (!recommendation) {
            return res.json({
                status: true,
                recommendations: []
            });
        }
        // Extract only users
        const usersOnly = recommendation.recommendations.map(r => r.user);

        return res.json({
            status: true,
            ticketId,
            generatedAt: recommendation.generatedAt,
            recommendations: usersOnly
        });
    } catch (error) {
        console.error("Get recommendations error:", error);
        res.json({
            status: false,
            message: "Failed to fetch recommendations"
        });
    }
};
