const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const Supplier = mongoose.model("Supplier", SupplierSchema);
module.exports = Supplier;
