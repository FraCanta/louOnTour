import nodemailer from "nodemailer";

export default async function mailer(req, res) {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.ionos.it",
    port: 465,
    secure: true,
    auth: {
      user: "info@louontour.it",
      pass: "LouSwipe.webmail_79?",
    },
  });

  try {
    await transporter.sendMail({
      from: "info@louontour.it",
      to: ["fcantale14@gmail.com", "luisaquaglia.tourguide@gmail.com"],
      subject: `You've got a LouMessage da ${name}  `,
      html: `<p>Hai una richiesta di informazioni da ${name} </p><br>
        <p><strong>Email: </strong> ${email}</p><br>
        <p><strong>Messaggio: </strong> ${message}</p><br>
      `,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
  return res.status(200).json({ error: "" });
}
