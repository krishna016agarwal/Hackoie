import Ticket from "../models/ticket.js";

export const updateTicketStatus = async (ticketId) => {
  if (!ticketId) return;

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) return;

  const isFull = ticket.members.length >= ticket.teamSize;

  if (isFull && ticket.status !== "CLOSED") {
    ticket.status = "CLOSED";
    ticket.closedAt = new Date();
    await ticket.save();
  }

  if (!isFull && ticket.status === "CLOSED") {
    ticket.status = "OPEN";
    ticket.closedAt = null;
    await ticket.save();
  }
};


