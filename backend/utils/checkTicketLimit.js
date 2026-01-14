import Ticket from "../models/ticket.js";

export const checkWeeklyTicketLimit = async (userId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

  const count = await Ticket.countDocuments({
    createdBy: userId,
    createdAt: { $gte: sevenDaysAgo }
  });

  return count < 40; // true = allowed
};
