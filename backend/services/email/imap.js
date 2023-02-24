require("dotenv").config();
const notifier = require("mail-notifier");
// const Imap = require("imap");

const imap = {
  user: process.env.IMAPMAIL,
  password: process.env.IMAPPASSWORD,
  host: "imap.gmail.com",
  port: 993, // imap port
  tls: true, // use secure connection
  tlsOptions: { rejectUnauthorized: false },
};

// notifier(imap)
//   .on("mail", (mail) => console.log(mail))
//   .start();

const n = notifier(imap);
n.on("end", () => n.start()) // session closed
  .on("mail", (mail) => console.log(mail.from[0].address, mail.subject))
  .start();
