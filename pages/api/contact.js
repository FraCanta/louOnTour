import nodemailer from "nodemailer";

export default async function mailer(req, res) {
  const { name, surname, email, phone, project_type, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.it",
    port: 465,
    secure: true,
    auth: {
      //   user: process.env.SMTP_USER, se vogliamo inserire le credenziali su env
      //   pass: process.env.SMTP_PASSWORD,
      user: "rachele164",
      pass: "umpalumpa",
    },
  });

  try {
    await transporter.sendMail({
      from: "rachele164@yahoo.it",
      to: ["eddironz@hotmail.com", "fcantale14@gmail.com"],
      subject: `You've got a LouMessage da ${name} ${surname} `,
      html: `<p>Hai una richiesta di informazioni da ${name} ${surname}</p><br>
        <p><strong>Email: </strong> ${email}</p><br>
        <p><strong>Messaggio: </strong> ${message}</p><br>
      `,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
  return res.status(200).json({ error: "" });
}
