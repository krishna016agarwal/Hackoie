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
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Team Acceptance</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        border-bottom: 1px solid #eaeaea;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }
      .header h1 {
        margin: 0;
        color: #333333;
      }
      .content p {
        color: #555555;
        font-size: 14px;
        line-height: 1.6;
      }
      .highlight-box {
        margin: 20px 0;
        padding: 15px;
        background-color: #f9fafb;
        border-left: 4px solid #2f80ed;
        border-radius: 4px;
      }
      .highlight-box p {
        margin: 6px 0;
        font-size: 14px;
        color: #333333;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999999;
        text-align: center;
        border-top: 1px solid #eaeaea;
        padding-top: 15px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Team Acceptance 🎉</h1>
      </div>

      <div class="content">
        <p>Hello,</p>

        <p>
          We’re excited to let you know that you’ve been
          <strong>successfully accepted</strong> into a team on Hackoie.
        </p>

        <div class="highlight-box">
          <p><strong>Team Name:</strong> ${ticket.title}</p>
          <p><strong>Hackathon:</strong> ${ticket.hackathonName}</p>
        </div>

        <p>
          You’re now officially part of the team. We recommend connecting with
          your teammates and starting collaboration as soon as possible.
        </p>

        <p>
          Wishing you the very best for your hackathon journey!
        </p>

        <p>
          Best regards,<br />
          <strong>Hackoie Team</strong>
        </p>
      </div>

      <div class="footer">
        <p>
          © ${new Date().getFullYear()} Hackoie. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>
`

    });
  }
);
