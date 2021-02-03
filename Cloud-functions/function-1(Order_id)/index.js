const functions = require("firebase-functions");
var express = require("express");
var cors = require("cors");
var request = require("request");
const crypto = require("crypto");
const key = "--your-rpay-key-generated-from-razorpay--";
const key_secret = "--your-rpay-key_secret-generated-from-razorpay--";

var app = express();

app.use(cors({ origin: true }));

app.post("/", (req, res) => {
  const amount = req.body.amount;

  //Allow Api Calls from local server
  const allowedOrigins = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "https://-------YourFirebaseApp-----.firebaseapp.com/",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  var options = {
    method: "POST",
    url: "https://api.razorpay.com/v1/orders",
    headers: {
      //There should be space after Basic else you get a BAD REQUEST error
      Authorization:
        "Basic " + new Buffer(key + ":" + key_secret).toString("base64")
    },
    form: {
      amount: amount,
      currency: "INR",
      receipt:
        "rec12",
      payment_capture: 1
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    res.send(body);
  });
});

exports.paymentApi = functions.https.onRequest(app);
