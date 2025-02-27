const express = require("express");
const router = express.Router();

const { getAllSupplier } = require("../controllers/supplierController");

router.route("/").get(getAllSupplier);

module.exports = router;
