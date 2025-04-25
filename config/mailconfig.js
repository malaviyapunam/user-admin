const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, 
  auth: {
    user: "malaviyapunam3@gmail.com",
    pass: "qerfgbudbobcozyc",
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: 'malaviyapunam3@gmail.com', 
    to: "kvala8087@gmail.com", 
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);