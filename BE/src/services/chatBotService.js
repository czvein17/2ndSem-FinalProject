const { openai } = require("../config/openai");

const chatCompletion = async (message) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: message,
      },
    ],
  });
  return response;
};

module.exports = {
  chatCompletion,
};
