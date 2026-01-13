import { Resend } from "resend"
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY)


export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Website <website@resend.dev>",
      to,
      subject,
      html
    })
    if (error) {
      return console.error({error})
    } else {
      console.log(data)
    }
  } catch (error) {
    console.log(error)
  }

}
// export const sendEmail = async ({ to, subject, html }) => {
//   console.log("📧 Sending Email");
//   console.log("To:", to);
//   console.log("Subject:", subject);
//   console.log("Body:", html);

// }
