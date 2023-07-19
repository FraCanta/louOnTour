import axios from "axios";

export default async (req, res) => {
  const { email } = req.body;

  if (!email || !email.length) {
    return res.status(400).json({ error: "Email is required" });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const API_SERVER = process.env.MAILCHIMP_API_SERVER;
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

  const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

  const data = {
    email_address: email,
    status: "subscribed",
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `api_key ${API_KEY}`,
    },
  };

  try {
    const response = await axios.post(url, data, options);
    if (response.status >= 400) {
      return res.status(400).json({
        error: `There was an error subscribing to the newsletter. Shoot me an email at ogbonnakell@gmail and I'll add you to the list.`,
      });
    }
    return res.status(201).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// mailchimp add member to list: https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/
//steps:
// get mailchimp api key, audience id,
// install axios and setup  post request using async
// pass the data need ( data, options and url), make sure not to make any mistakes in the url and data
// infact with any parameter being passed cause it could lead to an error message
// move to componnents/subscribe
