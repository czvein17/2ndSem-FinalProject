const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const app = express();

const router = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");
const { Console } = require("console");

// app.use(
//   cors({
//     // origin: "http://localhost:5173",
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );

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

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../FE/dist", "index.html"));
// });

app.use(errorHandler);

module.exports = app;
