import { serve } from "inngest/express";
import { inngest } from "../inngest/client.js";
import { functions } from "../inngest/index.js";

export default serve({
  client: inngest,
  functions,
});
