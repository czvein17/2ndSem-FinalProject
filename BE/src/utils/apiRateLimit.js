const rateLimiter = require("express-rate-limit");

class ApiRateLimit {
  loginAttempts = rateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: (req, res) => {
      console.log(req.rateLimit);
      const resetTime = new Date(req.rateLimit.resetTime).toLocaleTimeString();

      res.status(429).json({
        status: "fail",
        message: `Too many login attempts, please try again in an minute! `,
      });
    },
  });
}

module.exports = ApiRateLimit;
