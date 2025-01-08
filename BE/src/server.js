const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const app = express();

const router = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.header("Access-Control-Allow-Credentials", "true");

  next();
});

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/example", (req, res, next) => {
  res.send("Hello from the server hi");
});

app.use("/api/v1", router);
app.use(errorHandler);

module.exports = app;
