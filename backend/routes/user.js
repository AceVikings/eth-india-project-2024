const express = require("express");

const router = express.Router();

// Define your routes here

router.get("/wallets", async (req, res) => {
  const auth_token = req.headers.authorization;
  if (!auth_token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
