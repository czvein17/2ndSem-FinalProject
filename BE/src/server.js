const express = require("express");
const cors = require("cors");
const path = require("path");
const OpenAI = require("openai");

const app = express();

const errorHandler = require("./middlewares/errorHandler");

const signinRoutes = require("./routes/signinRoutes");
const signupRoutes = require("./routes/signupRoutes");
const userRoutes = require("./routes/userRoutes");

const chatBotRoutes = require("./routes/chatBotRoutes");

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  next();
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use("/example", (req, res, next) => {
  res.send("Hello from the server hi");
});

app.use("/api/v1/signin", signinRoutes);
app.use("/api/v1/signup", signupRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chat", chatBotRoutes);

app.use(errorHandler);

module.exports = { app, openai };
