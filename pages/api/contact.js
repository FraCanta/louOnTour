import nodemailer from "nodemailer";

export default async function mailer(req, res) {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "fcantale14@gmail.com",
      pass: "wtpyvhzvqsecycqt",
      // user: "fcantale14@gmail.com",
      // pass: "sarimale84",
    },
  });

  try {
    await transporter.sendMail({
      from: "fcantale14@gmail.com",
      to: [
        "eddironz@hotmail.com",
        "fcantale14@gmail.com",
        "quaglialuisa@gmail.com",
      ],
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
