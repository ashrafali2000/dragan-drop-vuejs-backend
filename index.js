const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); // Increase limit to handle large image data
app.use(cors());

// Route to handle email sending
app.post("/api/send-email", async (req, res) => {
  const { from, to, image } = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use your email provider
    auth: {
      user: process.env.GMAIL, // Your email
      pass: process.env.APP_PASSWORD, // Your email password or app-specific password
    },
  });

  // Email options
  const mailOptions = {
    from: from,
    to: to,
    subject: "Image Sharing",
    text: "Please find the attached image.",
    attachments: [
      {
        filename: "image.png",
        content: image.split("base64,")[1], // Extract base64 content
        encoding: "base64",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).send("Error sending email");
  }
});
app.get("/", (req, res) => {
  res.status(200).json("Welcome, your app is working well");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
