/* eslint-disable import/no-anonymous-default-export */
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // es: "us21"
});

export default async (req, res) => {
  const { email, gdpr } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Email non valida" });
  }

  if (!gdpr) {
    return res.status(400).json({ error: "Consenso richiesto" });
  }

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: "subscribed",
        marketing_permissions: [
          {
            marketing_permission_id: "341504",
            enabled: true,
          },
        ],
      },
    );

    return res.status(201).json({ message: "Iscritto con successo" });
  } catch (error) {
    const errorResponse = error.response?.body;

    if (errorResponse?.title === "Member Exists") {
      return res.status(200).json({
        message: "Sei già iscritto 😉",
      });
    }

    return res.status(500).json({
      error: errorResponse?.detail || "Errore durante l'iscrizione",
    });
  }
};
