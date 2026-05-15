import User from "../../models/user.js"
import Ticket from "../../models/ticket.js";
import { inngest } from "../client.js";
import { sendEmail } from "../../utils/sendEmail.js";
export const sendMemberKickedMail = inngest.createFunction(
    { id: "send-member-kicked-mail",
      triggers:[{event:"member.kicked"}],
     },
    
    async ({ event }) => {
        const { userId, ticketId } = event.data;

        const user = await User.findById(userId);
        const ticket = await Ticket.findById(ticketId);

        await sendEmail({
            to: user.email,
            subject: "Removed from Team",
            html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Team Update</title>
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
        border-left: 4px solid #e74c3c;
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
        <h1>Team Update</h1>
      </div>

      <div class="content">
        <p>Hello,</p>

        <p>
          This is to inform you that you have been removed from the following team:
        </p>

        <div class="highlight-box">
          <p><strong>Team Name:</strong> ${ticket.title}</p>
          <p><strong>Hackathon:</strong> ${ticket.hackathonName}</p>
        </div>

        <p>
          If you believe this was done in error, you may contact the team administrator
          for clarification.
        </p>

        <p>
          You are welcome to explore and join other teams on the platform.
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
