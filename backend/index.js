const express = require("express");
const axios = require("axios");

const GEMINI_API_KEY = "AIzaSyCsuZn39V72kEmGx6494MHe5HFCG7gp-do";
// const GEMINI_API_URL = "https://api.gemini.com/v1/doubts";

const app = express();
const port = 3000;

// app.use(bodyParser.json());
app.use(express.json());

// const transporter = nodemailer.createTransport({
//   service: "gmail", // or other email service
//   auth: {
//     user: "your-email@gmail.com",
//     pass: "your-email-password",
//   },
// });

app.post("/api/doubts", async (req, res) => {
  const { doubt } = req.body;

  console.log("doubt", doubt);

  try {
    const response = await axios.post(
      "https://api.gemini.com/v1/doubts",
      {
        question: doubt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
      }
    );

    // Assuming the response data contains the text in response.data.text
    const sentences = response.data.text.split(". ");
    const summary =
      sentences.slice(0, 3).join(". ") + (sentences.length > 2 ? "." : "");
    console.log("*******", summary);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }

  //   try {
  //     const { doubt } = req.body;

  //     console.log("doubt", doubt);

  //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //     const prompt = "Write a story about a magic backpack.";

  //     const result = await model.generateContent(prompt);
  //     const response = result.response;
  //     const text = response.text();
  //     console.log(text);
  //     // Make a request to Gemini API
  //     // const response = await axios.post(
  //     //   GEMINI_API_URL,
  //     //   {
  //     //     doubt,
  //     //   },
  //     //   {
  //     //     headers: {
  //     //       Authorization: `Bearer ${GEMINI_API_KEY}`,
  //     //       "Content-Type": "application/json",
  //     //     },
  //     //   }
  //     // );

  //     // Send response back to client
  //     res.json(response.data);
  //     console.log("response.data", response.data);
  //   } catch (error) {
  //     console.error("Error making request to Gemini API:", error);
  //     res.status(500).json({ error: "Failed to fetch response from Gemini API" });
  //   }
});

// app.post("/send-email", (req, res) => {
//   const { to, subject, body } = req.body;

//   const mailOptions = {
//     from: "pinki22@navgurukul.org",
//     to,
//     subject,
//     text: body,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     res.status(200).json({ result: "Success" });
//   });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
