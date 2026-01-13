import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import JoinRequest from "../../models/JoinRequest.js";

export const autoRejectJoinRequests = inngest.createFunction(
  {
    id: "auto-reject-join-requests",
    concurrency: { limit: 5 }
  },
  {
    event: "ticket/team.updated"
  },
  async ({ event, step }) => {
    const { ticketId, hackathonKey, joinedUserId } = event.data;

    const ticket = await step.run("fetch-ticket", async () =>
      Ticket.findById(ticketId).select("teamSize members")
    );

    if (!ticket) return;

    /**
     * 1️⃣ TEAM FULL → cancel all pending requests for this ticket
     */
    if (ticket.members.length >= ticket.teamSize) {
      await step.run("cancel-requests-team-full", async () => {
        await JoinRequest.updateMany(
          {
            ticket: ticketId,
            status: "PENDING"
          },
          {
            $set: {
              status: "CANCELLED"
            }
          }
        );
      });
    }

    /**
     * 2️⃣ USER JOINED → cancel their other pending requests
     * (same hackathon, different tickets)
     */
    await step.run("cancel-user-other-requests", async () => {
      await JoinRequest.updateMany(
        {
          hackathonKey,
          requestedTo: joinedUserId,
          status: "PENDING"
        },
        {
          $set: {
            status: "CANCELLED"
          }
        }
      );
    });
  }
);
