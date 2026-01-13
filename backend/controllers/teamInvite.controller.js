// controllers/teamInvite.controller.js
import TeamInvite from "../models/teamInvite.js";
import Ticket from "../models/ticket.js";

export const sendTeamInvite = async (req, res) => {
  const { ticketId, userId } = req.body;
  const adminId = req.user._id;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (ticket.createdBy.toString() !== adminId.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const invite = await TeamInvite.create({
    ticket: ticketId,
    admin: adminId,
    invitedUser: userId,
    hackathonKey: ticket.hackathonKey
  });

  res.json({
    message: "Invite sent successfully",
    invite
  });
};
