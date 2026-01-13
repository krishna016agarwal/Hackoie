import User from "../../models/user.js"
import Ticket from "../../models/ticket.js";
import { inngest } from "../client.js";
import { sendEmail } from "../../utils/sendEmail.js.js";
export const sendMemberKickedMail = inngest.createFunction(
    { id: "send-member-kicked-mail" },
    { event: "member.kicked" },
    async ({ event }) => {
        const { userId, ticketId } = event.data;

        const user = await User.findById(userId);
        const ticket = await Ticket.findById(ticketId);

        await sendEmail({
            to: user.email,
            subject: "Removed from Team",
            html: `
        <p>You were removed from the team:</p>
        <b>${ticket.title}</b><p> for ${ticket.hackathonName}</p>
      `
        });
    }
);
