import Ticket from "../../models/ticket.js";
import Application from "../../models/Application.js";
import JoinRequest from "../../models/JoinRequest.js";
import { collectUniqueUsers } from "../../utils/uniqueUsers.js";
import { inngest } from "../client.js";
import { sendEmail } from "../../utils/sendEmail.js";

export const expireOldTickets = inngest.createFunction(
    {
        id: "expire-old-tickets",
        concurrency: { limit: 1 },
        triggers: [{ cron: "0 0 * * *" }]
    },
    async ({ step }) => {
        const now = new Date();

        /**
         * 1️⃣ Find ALL tickets whose hackathon is expired (OPEN + CLOSED)
         */
        const expiredTickets = await step.run(
            "find-expired-tickets",
            async () => {
                return Ticket.find({
                    date: { $lt: now }
                }).select("_id status title createdBy members");
            }
        );

        if (!expiredTickets.length) {
            return { expired: 0 };
        }

        const allTicketIds = expiredTickets.map(t => t._id);
        const openTicketIds = expiredTickets
            .filter(t => t.status === "OPEN")
            .map(t => t._id);

        /**
         * 2️⃣ Send emails for OPEN tickets (before deletion)
         */
        if (openTicketIds.length) {
            await step.run("send-expired-ticket-mails", async () => {
                const tickets = await Ticket.find({
                    _id: { $in: openTicketIds }
                })
                    .populate("createdBy", "email name")
                    .populate("members", "email name");

                for (const ticket of tickets) {
                    const users = collectUniqueUsers(ticket);

                    await Promise.all(
                        users.map(user =>
                            sendEmail({
                                to: user.email,
                                subject: "Ticket Expired ⏰",
                                html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Ticket Expired</title>
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
        border-left: 4px solid #f39c12;
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
        <h1>Ticket Expired ⏰</h1>
      </div>

      <div class="content">
        <p>Hello ${user.name || "there"},</p>

        <p>
          We wanted to let you know that the following ticket has expired because
          the hackathon date has passed:
        </p>

        <div class="highlight-box">
          <p><strong>Ticket:</strong> ${ticket.title}</p>
        </div>

        <p>
          You can create a new ticket or join another team at any time on Hackoie.
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

                            })
                        )
                    );
                }
            });
        }

        /**
         * 3️⃣ Delete ONLY OPEN tickets
         */
        if (openTicketIds.length) {
            await step.run("delete-open-tickets", async () => {
                await Ticket.deleteMany({
                    _id: { $in: openTicketIds },
                    status: "OPEN"
                });
            });
        }

        /**
         * 4️⃣ Delete ALL JoinRequests (any status) for ALL expired tickets
         */
        await step.run("cleanup-all-join-requests", async () => {
            await JoinRequest.deleteMany({
                ticket: { $in: allTicketIds }
            });
        });

        /**
         * 5️⃣ Delete ALL Applications (any status) for ALL expired tickets
         */
        await step.run("cleanup-all-applications", async () => {
            await Application.deleteMany({
                ticket: { $in: allTicketIds }
            });
        });

        return {
            expiredTickets: expiredTickets.length,
            openTicketsDeleted: openTicketIds.length
        };
    }
);
