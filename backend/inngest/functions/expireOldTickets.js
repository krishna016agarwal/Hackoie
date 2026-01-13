import Ticket from "../../models/ticket.js";
import Application from "../../models/Application.js";
import { collectUniqueUsers } from "../../utils/uniqueUsers.js";
import { inngest } from "../client.js";
import { sendEmail } from "../../utils/sendEmail.js.js";
import JoinRequest from "../../models/JoinRequest.js";

export const expireOldTickets = inngest.createFunction(
    {
        id: "expire-old-tickets",
        concurrency: {
            limit: 1
        }
    },
    {
        cron: "0 0 * * *" // every day at midnight
    },
    async ({ step }) => {

        const now = new Date();

        /**
         * 1️⃣ Find tickets to expire
         */
        const ticketsToExpire = await step.run(
            "find-expired-tickets",
            async () => {
                return Ticket.find({
                    status: "OPEN",
                    date: { $lt: now },
                    $expr: { $lt: [{ $size: "$members" }, "$teamSize"] }
                }).select("_id");
            }
        );

        if (!ticketsToExpire.length) return { expired: 0 };

        const ticketIds = ticketsToExpire.map(t => t._id);

        /**
         * 2️⃣ Mark tickets as EXPIRED
         */
        await step.run("expire-tickets", async () => {
            await Ticket.updateMany(
                {
                    _id: { $in: ticketIds },
                    status: "OPEN"          // 🔐 guard condition
                },
                {
                    $set: {
                        status: "EXPIRED",
                        expiredAt: now
                    }
                }
            );

        });
        /**
         * 3️⃣ Cancel pending join requests
         */
        await step.run("cleanup-pending-join-requests", async () => {
            await JoinRequest.updateMany(
                {
                    ticket: { $in: ticketIds },
                    status: "PENDING"
                },
                {
                    $set: {
                        status: "CANCELLED"
                    }
                }
            );
        });

        /**
         * 3️⃣ Delete pending applications
         */
        await step.run("cleanup-pending-applications", async () => {
            await Application.deleteMany({
                ticket: { $in: ticketIds },
                status: "PENDING"
            });
        });


        /**
      * 4️⃣ Send emails to admin + members
      */
        await step.run("send-ticket-expired-mails", async () => {
            const tickets = await Ticket.find({
                _id: { $in: ticketIds }
            })
                .populate("createdBy", "email name")
                .populate("members", "email name ");

            for (const ticket of tickets) {

                const users = collectUniqueUsers(ticket);

                await Promise.all(
                    users.map(user =>
                        sendMail({
                            to: user.email,
                            subject: "Ticket Expired ⏰",
                            html: `
                <p>Hello ${user.name || "there"},</p>
                <p>The ticket <b>${ticket.title}</b> has expired because the hackathon date has passed and the team was not completed.</p>
                <p>You can create or join another ticket anytime.</p>
              `
                        })
                    )
                );
            }
        });

        return {
            expired: ticketIds.length
        };
    }
);
