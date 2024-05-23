import nodemailer from "nodemailer";

export default async function mailer(req, res) {
  const { name, work, email, source, services, price, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      //   user: process.env.SMTP_USER, se vogliamo inserire le credenziali su env
      //   pass: process.env.SMTP_PASSWORD,
      user: "luisaquaglia.tourguide@gmail.com",
      pass: "fvbuprlorshulfzk",
    },
  });

  try {
    await transporter.sendMail({
      from: `${email}`,
      to: ["thalliondev@gmail.com"],
      subject: `${name} di ${work} ti scrivo per... `,

      html: ` 
      <div style="font-size:16px; padding:4px; margin-bottom:20px;">Tipo di servizio : ${services}  </div>
      <div style="font-size:16px; padding:4px; margin-bottom:20px;">Vorrei restare attorno :  ${price} </div>


<div >
<div style="font-size:16px; margin-top: 20px">Ho sentito parlare di te tramite ${source}.</div>
<div style="font-size:16px; margin-top: 20px">Sono ${name} ,</div>
<div style="font-size:16px; padding:4px; margin-bottom:20px;">
${message}
</div>
<div>
Referenze del contatto: 
</div>

<ul>
<li>
${email}
</li></ul>

</div>
‍


    </div>
      `,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
  return res.status(200).json({ error: "" });
}
