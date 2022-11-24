import nodemailer from "nodemailer";

export default async function mailer(req, res) {
  const { name, surname, email, phone, project_type, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "out.email.it",
    port: 465,
    secure: true,
    auth: {
      //   user: process.env.SMTP_USER, se vogliamo inserire le credenziali su env
      //   pass: process.env.SMTP_PASSWORD,
      user: "automotive_demo",
      pass: "Mentadent@16",
    },
  });

  try {
    await transporter.sendMail({
      from: "automotive_demo@email.it",
      to: ["eddironz@hotmail.com", "fcantale14@gmail.com"],
      subject: `UbiquityMessage da ${name} ${surname} `,
      html: `<p>Hai una richieda di informazioni da ${name} ${surname}</p><br>
        <p><strong>Email: </strong> ${email}</p><br>
        <p><strong>Tipo di progetto: </strong> ${project_type}</p><br>
        <p><strong>Messaggio: </strong> ${message}</p><br>
        <p><strong>Cellulare: </strong> ${phone}</p><br>        
      `,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
  return res.status(200).json({ error: "" });
}
