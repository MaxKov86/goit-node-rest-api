import nodemailer from "nodemailer";
import "dotenv/config";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendMail = (message) => transport.sendMail(message);

// const message = {
//   to: "max.kov86@ukr.net",
//   from: "maxkov19861411@gmail.com",
//   subject: "Something",
//   html: "<p>Helllo Maks!) How are you?</p>",
//   text: "Helllo Maks!) How are you?",
// };
// transport.sendMail(message).then(console.log).catch(console.log);
