import { inngest } from "../client.js";
import User from "../../models/user.js";
import Ticket from "../../models/ticket.js";
import { sendEmail } from "../../utils/sendEmail.js.js";

export const sendApplicationRequestMail = inngest.createFunction(
  { id: "send-application-request-mail" },
  { event: "application.created" },
  async ({ event }) => {
    const { adminId, applicantId, ticketId } = event.data;

    const admin = await User.findById(adminId);
    const applicant = await User.findById(applicantId);
    const ticket = await Ticket.findById(ticketId);

    await sendEmail({
      to: admin.email,
      subject: "New Team Join Request",
      html: `
        <p>${applicant.name} requested to join your ticket:</p>
        <b>${ticket.title}</b>
      `
    });
  }
);
