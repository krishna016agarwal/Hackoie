import Ticket from "../models/ticket.js";
import Application from "../models/Application.js";
import analyzeTicketRequirements from "../utils/ai.js";
import buildUserTokens from "../utils/buildUserToken.js";
import { updateTicketStatus } from "../utils/updateTicketStatus.js";
import { inngest } from "../inngest/client.js"
import { checkWeeklyTicketLimit } from "../utils/checkTicketLimit.js";
import { findMatchingUsers } from "../utils/findMatchingUsers.js";

/**
 * CREATE TICKET
 */
export const createTicket = async (req, res) => {
  if (!req.user.isProfileComplete) {
    return res.status(403).json({
      message: "Complete your profile before creating a ticket"
    });
  }

  const { hackathonKey } = req.body;

  try {
    // ❌ Prevent user joining another team for same hackathon
    const alreadyInHackathon = await Ticket.findOne({
      hackathonKey,
      members: req.user._id
    });



    if (alreadyInHackathon) {
      return res.status(400).json({
        message: "You are already part of a team for this hackathon"
      });
    }
    if (!hackathonKey) {
      return res.status(400).json({ message: "Invalid hackathon data" });
    }

    const alreadyTicketFormed = await Ticket.findOne({
      hackathonKey,
      createdBy: req.user._id
    });



    if (alreadyTicketFormed) {
      return res.status(400).json({
        message: "You have already created a ticket for this Hackathon"
      });
    }





    /**
     * 🔐 RATE LIMIT (FREE PLAN)
     */
    const allowed = await checkWeeklyTicketLimit(req.user._id);

    if (!allowed) {
      return res.status(429).json({
        message:
          "Free plan limit reached. You can create only 4 tickets per week."
      });
    }

    const {
      description = "",
      requirements = []
    } = await analyzeTicketRequirements(req.body.requirementsText);

    // Final safety normalization

    const finalDescription =
      typeof description === "string" && description.trim()
        ? description
        : "";

    const finalRequirements =
      Array.isArray(requirements) && requirements.length
        ? requirements
        : [];


    const ticket = await Ticket.create({
      ...req.body,
      description: finalDescription,
      requirementsText: req.body.requirementsText,
      requirements: finalRequirements,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    if (req.body.requirementsText && req.body.requirementsText.length > 0) {
      await findMatchingUsers(finalRequirements, req.user._id, ticket._id, ticket.hackathonKey);

    }

    res.status(201).json({ status: true, message: "Ticket created successfully", ticket });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to create ticket",
      error: error.message
    });
  }


};

/**
 * 1️⃣ Tickets CREATED by user (Admin view)
 */
export const getMyCreatedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      createdBy: req.user._id
    })
      .populate("members", "name skills github linkedin email phone collage branch year")
      .sort({ createdAt: -1 });

    // Attach applications to each ticket
    const ticketsWithRequests = await Promise.all(
      tickets.map(async (ticket) => {
        const applications = await Application.find({
          ticket: ticket._id
        }).populate("applicant", "name skills github linkedin");

        return {
          ...ticket.toObject(),
          applications
        };
      })
    );

    res.json(ticketsWithRequests);
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch created tickets",
      error: error.message
    });
  }

};

/**
 * 2️⃣ Tickets where user is a MEMBER (not admin)
 */
export const getMyJoinedTickets = async (req, res) => {
  const tickets = await Ticket.find({
    members: req.user._id,
    createdBy: { $ne: req.user._id }
  })
    .populate("createdBy", "name email")
    .populate("members", "name skills linkedin github");

  res.json(tickets);
};

/**
 * 3️⃣ Get requests RECEIVED by admin (all pending)
 */
export const getIncomingRequests = async (req, res) => {
  const myTickets = await Ticket.find({
    createdBy: req.user._id
  }).select("_id");

  const ticketIds = myTickets.map(t => t._id);

  const requests = await Application.find({
    ticket: { $in: ticketIds },
    status: "PENDING"
  })
    .populate("ticket", "title hackathonName date members")
    .populate("applicant", "name skills github linkedin");

  res.json(requests);
};


/**
 * 🏠 HOME FEED
 * Show tickets ranked by skill match
 * If no skills → show latest tickets
 */
export const getHomeFeed = async (req, res) => {
  try {
    const user = req.user;

    // 1️⃣ Build tokens from user profile
    const userTokens = buildUserTokens(user);

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    /**
     * 🚫 Exclude tickets created by the logged-in user
     */
    const baseQuery = {
      createdBy: { $ne: user._id },
      status: { $in: ["OPEN", "CLOSED"] },
      $or: [
        { status: "OPEN" },
        {
          status: "CLOSED",
          closedAt: { $gte: oneDayAgo }
        }
      ]
    };

    /**
     * 2️⃣ Tickets WITH matching requirements
     */
    const matchedTickets = await Ticket.find({
      ...baseQuery,
      requirements: { $in: userTokens }
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name college")
      .populate("members", "name college branch year skills github linkedin phone email")
      .limit(50);

    /**
     * 3️⃣ Tickets WITHOUT matching requirements
     */
    const otherTickets = await Ticket.find({
      ...baseQuery,
      $or: [
        { requirements: { $exists: false } },
        { requirements: { $size: 0 } },
        { requirements: { $nin: userTokens } }
      ]
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name college")
      .populate("members", "name college branch year skills github linkedin phone email")
      .limit(50);

    /**
     * 4️⃣ Response
     */
    res.json({
      matchedTickets,
      otherTickets
    });

  } catch (err) {
    console.error("Home feed error:", err);
    res.status(500).json({
      message: "Failed to load home feed"
    });
  }
};



export const deleteTicket = async (req, res) => {
  try {

    const { ticketId } = req.params;
    const  userId  = req.user._id;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found"
      });
    }

    // ✅ Only creator can delete
    if (ticket.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to delete this ticket"
      });
    }

    await ticket.deleteOne();

    res.json({
      status: true,
      message: "Ticket deleted successfully"
    });

  } catch (error) {
    console.error("Delete ticket error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to delete ticket"
    });
  }
};


export const removeMemberFromTicket = async (req, res) => {
  let ticket = null;
  
  let memberid2 = null;

  try {
    const { ticketId, memberId } = req.params;
    const userId = req.user._id;

    ticket = await Ticket.findById(ticketId);
    memberid2 = memberId;
   
    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found"
      });
    }

    if (ticket.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        status: false,
        message: "Only admin can remove members"
      });
    }

    if (memberId === userId.toString()) {
      return res.status(400).json({
        status: false,
        message: "Admin cannot remove himself"
      });
    }

    if (!ticket.members.includes(memberId)) {
      return res.status(400).json({
        status: false,
        message: "User is not a member of this ticket"
      });
    }

    ticket.members = ticket.members.filter(
      id => id.toString() !== memberId
    );

    await ticket.save();
    await updateTicketStatus(ticket);

    // ✅ MARK APPLICATION AS REMOVED
    await Application.findOneAndUpdate(
      {
        ticket: ticketId,
        applicant: memberId,
        status: "ACCEPTED"
      },
      {
        $set: { status: "REMOVED" }
      }
    );

    res.json({
      status: true,
      message: "Member removed successfully",
      members: ticket.members
    });

  } catch (error) {
    console.error("Remove member error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to remove member"
    });
  }

  // 🔔 SIDE EFFECT (SAFE)
  try {
    if (ticket) {
      await inngest.send({
        name: "member.kicked",
        data: {
          userId:memberid2,
          ticketId: ticket._id.toString()
        }
      });
    }
  } catch (error) {
    console.error("Post-commit side-effect failed:", error);
  }
};




export const leaveTicket = async (req, res) => {
  let ticket = null;
  let userId2 = null;

  try {
    const { ticketId } = req.body; // frontend sends { ticketId }
    const userId = req.user._id;   // token-based auth middleware

    ticket = await Ticket.findById(ticketId);
    userId2 = userId.toString();

    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found"
      });
    }

    if (!ticket.members.includes(userId)) {
      return res.status(400).json({
        status: false,
        message: "You are not a member of this ticket"
      });
    }

    // Remove user from members
    ticket.members = ticket.members.filter(
      id => id.toString() !== userId2
    );

    await ticket.save();



    res.json({
      status: true,
      message: "You have left the ticket successfully",
      members: ticket.members
    });

  } catch (error) {
    console.error("Leave ticket error:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to leave ticket"
    });
  }


};

// export const getTicketWithStatusClosed = async (req, res) => {
//   const {userId} = req.user._id;
//   const tickets = await Ticket.find({