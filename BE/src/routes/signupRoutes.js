const express = require("express");

const {
  signUpUsingEmailAndPassword,
} = require("../controllers/signupController");
const router = express.Router();

router.post("/", signUpUsingEmailAndPassword);

module.exports = router;
