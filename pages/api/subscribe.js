/* eslint-disable import/no-anonymous-default-export */
export default async (req, res) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Email non valida" });
  }

  try {
    const { MAILCHIMP_AUDIENCE_ID, MAILCHIMP_API_KEY, MAILCHIMP_API_SERVER } =
      process.env;

    const response = await fetch(
      `https://${MAILCHIMP_API_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || "Errore durante l'iscrizione",
      });
    }

    return res.status(201).json({ message: "Iscritto con successo" });
  } catch (error) {
    return res.status(500).json({
      error: "Errore server",
    });
  }
};
