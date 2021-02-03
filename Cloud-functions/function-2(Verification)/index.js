const functions = require("firebase-functions");
var express = require("express");
var cors = require("cors");
var request = require("request");
const crypto = require("crypto");
const key = "--your_key--";
const key_secret = "--your_key_secret--";

var app = express();

app.use(cors({ origin: true }));

app.post("/", (req, res) => {
   const allowedOrigins = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "https://-------YourFirebaseApp-----.firebaseapp.com/"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  const order = req.body;
  const text = order.razorpay_order_id + "|" + order.razorpay_payment_id;
  var signature = crypto
    .createHmac("sha256", key_secret)
    .update(text)
    .digest("hex");

  if (signature === order.razorpay_signature) {
    console.log("PAYMENT SUCCESSFULL");

    res.send("PAYMENT SUCCESSFULL");
  } else {
    res.send(signature);
    res.end();
  }
});

exports.paymentApi = functions.https.onRequest(app);
