const express = require("express");
const {
  loginEmailAndPassword,
  signAsGoogle,
} = require("../controllers/signinController");

const ApiRateLimit = require("../utils/apiRateLimit");

const router = express.Router();
const apiRateLimit = new ApiRateLimit();

router.post("/email", apiRateLimit.loginAttempts, loginEmailAndPassword);
router.post("/google", signAsGoogle);

module.exports = router;
