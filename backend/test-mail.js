const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "shuklapranjali29@gmail.com",
    pass: "ubsk cjnr xuxp pjcw",
  },
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: "shuklapranjali29@gmail.com",
      to: "shuklapranjali29@gmail.com",
      subject: "Test Email",
      text: "Hello from Node.js!",
    });

    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.error(err);
  }
}

test();