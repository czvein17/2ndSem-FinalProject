const express = require("express");
const {
  loginEmailAndPassword,
  signAsGoogle,
} = require("../controllers/signinController");

const router = express.Router();

router.post("/email", loginEmailAndPassword);
router.post("/google", signAsGoogle);

module.exports = router;
