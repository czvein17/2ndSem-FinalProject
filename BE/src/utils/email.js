const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const malOptions = {
    from: "CUP OF CHI <czveinlei17@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log(malOptions);

  await transporter.sendMail(malOptions);
};

const emailSupplier = async (order) => {
  console.log(order);

  const message = `Dear ${order.supplier.name},

I hope this email finds you well.

We wanted to inform you that our stock for **${order.name}** in our **CUP OF CHI** system is running low. As of now, we have **${order.stock} ${order.unit}** remaining.

To ensure a smooth supply chain and avoid disruptions, we kindly request you to confirm the availability of this item and provide an estimated delivery timeline.

Please let us know at your earliest convenience if you require any further details.

Looking forward to your prompt response.

Best regards,  
CUP OF CHI System  
`;

  await sendEmail({
    email: `${order.supplier.email}`,
    subject: `CUP OF CHI: Low Stock Alert for ${order.name}`,
    message: message,
  });
};

const sendOTPtoMail = async (email, otp) => {
  const message = `Your OTP is ${otp}`;

  await sendEmail({
    email: email,
    subject: "Password Reset OTP",
    message: message,
  });
};

module.exports = { emailSupplier, sendOTPtoMail };
