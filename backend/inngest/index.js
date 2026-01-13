import { sendApplicationRequestMail } from "./functions/sendApplicationRequestMail.js";
import { sendApplicationAcceptedMail } from "./functions/sendApplicationAcceptedMail.js";
import { sendMemberKickedMail } from "./functions/sendMemberKickedMail.js.js"
import { expireOldTickets } from "./functions/expireOldTickets.js";
import { autoRejectJoinRequests } from "./functions/autoRejectJoinRequests.js";
export const functions = [
  expireOldTickets,
  sendApplicationRequestMail,
  sendApplicationAcceptedMail,
  sendMemberKickedMail,
  autoRejectJoinRequests,
];