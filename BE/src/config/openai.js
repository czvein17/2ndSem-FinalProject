const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!process.env.OPENAI_API_KEY) {
  console.log("The OPENAI_API_KEY environment variable is missing or empty.");

  throw new Error(
    "The OPENAI_API_KEY environment variable is missing or empty."
  );
}

module.exports = { openai };
