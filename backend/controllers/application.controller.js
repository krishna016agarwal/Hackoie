import Application from "../models/Application.js";
import Hackathon from "../models/Hackathon.js";
import Ticket from "../models/ticket.js";
import { updateTicketStatus } from "../utils/updateTicketStatus.js";
import mongoose from "mongoose";
import { inngest } from "../inngest/client.js";
/**
 * APPLY TO TICKET
 */

export const createApplication = async (req, res) => {
  let application = null;
  let ticket = null;
  let userId = null;
  try {
    const { ticketId } = req.body;
    userId = req.user._id;
    if (!req.user.isProfileComplete) {
      return res.json({
        status:false,
        message: "Complete your profile before sending requests"
      });
    }

    if (!ticketId) {
      
      return res.json({ status:false,message: "Ticket ID is required" });
    }

    ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status !== "OPEN") {
      return res.json({
        status:false,
        message: "This ticket is no longer accepting applications"
      });
    }

    // ❌ Own ticket
    if (ticket.createdBy.toString() === userId.toString()) {
      return res.json({
        status:false,
        message: "You cannot apply to your own ticket"
      });
    }

    // ❌ Already a member
    if (ticket.members.some(m => m.toString() === userId.toString())) {
      return res.json({
        status:false,
        message: "You are already a member of this team"
      });
    }

    // ❌ Duplicate application for same ticket
    const existing = await Application.findOne({
      ticket: ticket._id,
      applicant: userId,
      status: { $in: ["PENDING", "REJECTED"] }
    });

    if (existing) {
      return res.json({
        status:false,
        message: "You have already applied to this ticket"
      });
    }

    // ✅ Create application
    application = await Application.create({
      ticket: ticket._id,
      applicant: userId,
      hackathonKey: ticket.hackathonKey
    });



    res.status(201).json({
      status:true,
      message: "Application sent successfully",
      application
    });

  } catch (error) {
    console.error("Create application error:", error);
    res.json({status:false, message: "Server error" });
  }
  try {
    if (application) {
      // 🔔 Notify admin (async)
      await inngest.send({
        name: "application.created",
        data: {
          ticketId: ticket._id.toString(),
          adminId: ticket.createdBy.toString(),
          applicantId: userId.toString()
        }
      })
    }
  } catch (error) {
    console.error("Post-commit side-effect failed:", error);
  }
};


/**
 * ACCEPT / REJECT REQUEST
 */


export const updateApplicationStatus = async (req, res) => {
  const session = await mongoose.startSession();

  let ticketId = null;          // ✅ SAFE OUTER SCOPE
  let applicantId = null;
  let finalStatus = null;

  try {
    session.startTransaction();

    const { applicationId } = req.params;
    const { status } = req.body;
    const adminId = req.user._id;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      throw new Error("Invalid status value");
    }

    /**
     * 1️⃣ Fetch application
     */
    const application = await Application
      .findById(applicationId)
      .session(session);

    if (!application) {
      throw new Error("Application not found");
    }

    if (application.status !== "PENDING") {
      throw new Error("Application already processed");
    }

    applicantId = application.applicant;
    finalStatus = status;

    /**
     * 2️⃣ Fetch ticket
     */
    const ticket = await Ticket
      .findById(application.ticket)
      .session(session);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticketId = ticket._id; // ✅ STORED SAFELY

    /**
     * 3️⃣ Authorization
     */
    if (ticket.createdBy.toString() !== adminId.toString()) {
      throw new Error("You are not authorized to manage this ticket");
    }

    /**
     * 4️⃣ ACCEPT LOGIC
     */
    if (status === "ACCEPTED") {

      // 🔐 HARD BLOCK

      // 🔍 CHECK: Is user already in ANY team for this hackathon?
      const alreadyInTeam = await Ticket.findOne({
        hackathonKey: application.hackathonKey,
        members: application.applicant
      }).session(session);

      await Application.deleteOne(
        {
          _id: application._id

        }
      ).session(session);

      if (alreadyInTeam) {
        throw new Error(
          "User is already part of a team for this hackathon"
        );
      }

      // 🔐 ADD MEMBER IF SLOT AVAILABLE
      const updatedTicket = await Ticket.findOneAndUpdate(
        {
          _id: ticket._id,
          status: "OPEN",
          $expr: { $lt: [{ $size: "$members" }, "$teamSize"] }
        },
        {
          $addToSet: { members: application.applicant }
        },
        {
          new: true,
          session
        }
      );

      if (!updatedTicket) {
        res.json({ status: false, message: "Team is already full. Cannot accept more members." });

      }


    } else {

      /**
       * 5️⃣ Update current application
       */
      await Application.updateOne(
        {
          _id: application._id,
          status: "PENDING"
        },
        {
          $set: { status: "REJECTED" }
        },
        { session }
      );
    }

    /**
     * 6️⃣ Commit transaction
     */
    await session.commitTransaction();
    session.endSession();

    /**
     * ✅ Respond immediately (DB SUCCESS)
     */
    res.json({
      message:
        status === "ACCEPTED"
          ? "User successfully added to the team"
          : "Application rejected",
      application
    });

  } catch (error) {
    await session.abortTransaction().catch(() => { });
    session.endSession();

    console.error("Transaction error:", error);

    return res.json({
      sttus:false,
      message: error.message || "Operation failed"
    });
  }

  /**
   * 7️⃣ SIDE EFFECTS (NO TRANSACTION)
   * These MUST NOT break API
   */
  try {
    if (ticketId) {
      await updateTicketStatus(ticketId);
    }

    if (finalStatus === "ACCEPTED" && applicantId && ticketId) {
      await inngest.send({
        name: "application.accepted",
        data: {
          userId: applicantId.toString(),
          ticketId: ticketId.toString()
        }
      });
    }
  } catch (err) {
    console.error("Post-commit side-effect failed:", err);
    // 🔕 silent fail (log only)
  }
};



export const getIncomingRequests = async (req, res) => {
  const myTickets = await Ticket.find({
    createdBy: req.user._id
  }).select("_id");

  const ticketIds = myTickets.map(t => t._id);

  const requests = await Application.find({
    ticket: { $in: ticketIds },
    status: "PENDING"
  })
    .populate("ticket", "title hackathonName teamSize members createdBy  location date description organization")
    .populate("applicant", "name skills github linkedin collage year email");

  res.json(requests);
};


export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user._id;

    /**
     * 1️⃣ Find application
     */
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    /**
     * 2️⃣ Authorization
     */
    if (application.applicant.toString() !== userId.toString()) {
      return res.json({status:false,
        message: "You are not authorized to delete this application"
      });
    }

    /**
     * 3️⃣ Business rule
     */
    if (application.status !== "PENDING") {
      return res.json({status:false,
        message: "Only pending applications can be deleted"
      });
    }

    /**
     * 4️⃣ Delete
     */
    await application.deleteOne();

    res.json({
      status: true,
      message: "Application deleted successfully"
    });

  } catch (error) {
    console.error("Delete application error:", error);

    res.json({
      status:false,
      message: "Failed to delete application"
    });
  }
};

export const getSentApplications = async (req, res) => {
  try {
    const userId = req.user._id;

    const applications = await Application.find({
      applicant: userId,
      status: { $in: ["PENDING"] }
    })
      .select("status createdAt ticket")
      .populate({
        path: "ticket",
        select: "title hackathonName organization teamSize members createdBy description  location date ",
        populate: {
          path: "createdBy",
          select: "name email collage branch year skills github linkedin phone"
        }
      })
      .lean();

    return res.status(200).json({
      status: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error("Get sent applications error:", error);
    return res.json({
      status: false,
      message: "Failed to fetch sent applications"
    });
  }
};