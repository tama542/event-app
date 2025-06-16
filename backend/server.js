// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Allow cross-origin requests from your front-end

// Safaricom credentials (replace these placeholders)
const consumerKey = "Qd7aZUxfdzBG5tedv8HVOGdKdhIa8HLYIp95EAON7G2nAP61";
const consumerSecret = "AUsKKHXCOwjGCX1IDdCc5q2GezGzo5quaVUAhBp0VUq6U8vfOhTFWc4WBcOADFgC";
const shortCode = "174379"; 
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const callbackURL = "https://mydomain.com/path";
// Function to generate the access token from Safaricom Daraja
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
    console.error("Error generating access token", error.response.data);
    throw new Error("Could not generate access token.");
  }
};

// Endpoint to initiate STK Push request
app.post("/stkpush", async (req, res) => {
  const { amount, phoneNumber, accountReference, transactionDesc } = req.body;

  // Additional validations could be added here (e.g., checking valid phone number)
  try {
    // Generate access token
    const accessToken = await generateAccessToken();

    // Prepare timestamp and password as required by Daraja
    const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, "").slice(0, 14); // Format: yyyymmddhhmmss
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    // Build the STK push request payload
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

    // Call the Daraja API endpoint for STK push
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

    // Send the response from Safaricom back to the front-end
    res.status(200).json(response.data);
  } catch (error) {
    console.error("STK Push Error:", error.response ? error.response.data : error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
