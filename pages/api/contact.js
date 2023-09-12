import nodemailer from "nodemailer";

export default async function mailer(req, res) {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "luisaquaglia.tourguide@gmail.com",
      pass: "fhkwglfgukyhewug",
    },
  });

  try {
    await transporter.sendMail({
      from: "luisaquaglia.tourguide@gmail.com",
      to: ["luisaquaglia.tourguide@gmail.com"],
      subject: `You've got a LouMessage da ${name}  `,
      // html: `<p>Hai una richiesta di informazioni da ${name} </p><br>
      //   <p><strong>Email: </strong> ${email}</p><br>
      //   <p><strong>Messaggio: </strong> ${message}</p><br>
      //
      // `,
      html: ` <div></div><div style="background: linear-gradient(
    90deg,
    hsla(204, 68%, 41%, 1) 0%,
    hsla(205, 100%, 67%, 1) 100%
  ); height: 10px; width:100%">
    </div>
   <div><h4 style="font-size: 22px; text-decoration: underline; font-family: 'Noto Sans', sans-serif;">Hai una richiesta di informazioni da ${name} </h4></div>
<div >
<h4 style="font-size: 20px; font-family: 'Noto Sans', sans-serif;">Sono ${name} ,
</h4>
<p style="font-size: 16px; font-family: 'Noto Sans', sans-serif;">${message}</p>
<p style="font-size: 16px; font-family: 'Noto Sans', sans-serif;">Referenze del contatto: </p>

<p>${email}</p>


</div><div style="background: linear-gradient(
    90deg,
    hsla(204, 68%, 41%, 1) 0%,
    hsla(205, 100%, 67%, 1) 100%
  ); height: 10px; width:100%">
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
