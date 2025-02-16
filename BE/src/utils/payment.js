const axios = require("axios");
const salesService = require("../services/salesService");

const validateMayaPayment = async (sales) => {
  const mayaAPI = `https://pg-sandbox.paymaya.com/payments/v1/payments/${sales.checkoutId}`;

  const response = await axios.get(mayaAPI, {
    headers: {
      Authorization: `Basic ${process.env.MAYA_SECRET_BASE64_KEY}`,
      "Content-Type": `application/json`,
    },
  });

  if (response.data.status !== "PAYMENT_SUCCESS")
    return next(new ErrorResponse(400, "Payment failed"));

  console.log(response.data);

  await salesService.updateSales(sales._id, {
    receivedAmount: response.data.amount,
    paymentStatus: "paid",
  });
};

module.exports = {
  validateMayaPayment,
};
