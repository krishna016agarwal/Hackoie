import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { inngest } from "../client.js";
import { sendEmail } from "../../utils/sendEmail.js.js";
export const sendApplicationAcceptedMail = inngest.createFunction(
  { id: "send-application-accepted-mail" },
  { event: "application.accepted" },
  async ({ event }) => {
    const { userId, ticketId } = event.data;

    const user = await User.findById(userId);
    const ticket = await Ticket.findById(ticketId);

    if (!user || !ticket) return;

    await sendEmail({
      to: user.email,
      subject: "You're Accepted 🎉",
      html: `
        <p>You have been accepted into the team:</p>
        <b>${ticket.title}</b>
      `
    });
  }
);
