const axios = require("axios");
const salesService = require("../services/salesService");
const ErrorResponse = require("./ErrorResponse");

const validateMayaPayment = async (sales) => {
  const mayaAPI = `https://pg-sandbox.paymaya.com/payments/v1/payments/${sales.checkoutId}`;

  const response = await axios.get(mayaAPI, {
    headers: {
      Authorization: `Basic ${process.env.MAYA_SECRET_BASE64_KEY}`,
      "Content-Type": `application/json`,
    },
  });

  if (response.data.status !== "PAYMENT_SUCCESS") {
    return { status: "failed", data: response.data };
  }

  const updatedSales = await salesService.updateSales(sales._id, {
    receivedAmount: response.data.amount,
    paymentStatus: "paid",
  });

  return { status: "success", data: updatedSales };
};

module.exports = {
  validateMayaPayment,
};
