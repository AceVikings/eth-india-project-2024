const express = require("express");

const router = express.Router();

// Define your routes here
router.post("/sendEmail", async (req, res) => {
  const { email } = req.body;
  try {
    const response = await fetch(
      "https://sandbox-api.okto.tech/api/v1/authenticate/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.OKTO_KEY,
          "User-Agent": "PostmanRuntime/7.37.3",
          Referer: "https://www.xyz.com",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    console.log("Token", data.data.token);
    return res.json({
      otpToken: data.data.token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/verifyOtp", async (req, res) => {
  const { email, otp, otpToken } = req.body;
  try {
    const response = await fetch(
      "https://sandbox-api.okto.tech/api/v1/authenticate/email/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.OKTO_KEY,

          "User-Agent": "PostmanRuntime/7.37.3",
          Referer: "https://www.xyz.com",
        },
        body: JSON.stringify({ email, otp, token: otpToken }),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      return res.json({
        idToken: data.data.auth_token,
        refersh_token: data.data.refresh_token,
        message: "OTP Verified",
      });
    }
    return res.status(400).json({ message: "Invalid OTP" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/logout", async (req, res) => {
  const auth_token = req.headers.authorization;
  console.log("HERE");
  if (!auth_token) {
    return res.status(400).json({ message: "No token provided" });
  }
  const response = await fetch("https://sandbox-api.okto.tech/api/v1/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.OKTO_KEY,
      Authorization: auth_token,
    },
  });
  if (response.status === 200) {
    return res.json({ message: "Logged out" });
  }
  return res.status(400).json({ message: "Invalid token" });
});

router.post("/register", (req, res) => {
  // Handle registration
  res.send("Register route");
});

module.exports = router;
