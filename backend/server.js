// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Safaricom credentials
const consumerKey = "Qd7aZUxfdzBG5tedv8HVOGdKdhIa8HLYIp95EAON7G2nAP61";
const consumerSecret = "AUsKKHXCOwjGCX1IDdCc5q2GezGzo5quaVUAhBp0VUq6U8vfOhTFWc4WBcOADFgC";
const shortCode = "174379"; 
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

// FIXED: Use a local callback URL for development
const callbackURL = "https://your-ngrok-url.ngrok.io/callback";

// Function to generate the access token
const generateAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating access token", error.response?.data || error.message);
    throw new Error("Could not generate access token.");
  }
};

// Endpoint to initiate STK Push request
app.post("/stkpush", async (req, res) => {
  const { amount, phoneNumber, accountReference, transactionDesc } = req.body;

  // Input validation
  if (!amount || !phoneNumber) {
    return res.status(400).json({ error: "Amount and phone number are required" });
  }

  // Validate phone number format
  if (!phoneNumber.startsWith('254') || phoneNumber.length !== 12) {
    return res.status(400).json({ error: "Invalid phone number format. Use 2547XXXXXXXX" });
  }

  try {
    const accessToken = await generateAccessToken();
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "").slice(0, 14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const stkPushRequest = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackURL,
      AccountReference: accountReference || "TicketBooking",
      TransactionDesc: transactionDesc || "Ticket Payment"
    };

    console.log("Sending STK Push request:", stkPushRequest);

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushRequest,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("STK Push response:", response.data);
    res.status(200).json(response.data);

  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to initiate payment",
      details: error.response?.data || error.message 
    });
  }
});

// Add callback endpoint to receive payment results
app.post("/callback", (req, res) => {
  console.log("Payment callback received:", req.body);
  // Handle the payment result here
  res.status(200).send("Callback received");
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "M-Pesa STK Push API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});