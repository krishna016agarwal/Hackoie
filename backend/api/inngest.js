// import { serve } from "inngest/express";  //for local express server 
import { serve } from "inngest/vercel";  //for vercel deployment
import { inngest } from "../inngest/client.js";
import { functions } from "../inngest/index.js";

export default serve({
  client: inngest,
  functions,
});
