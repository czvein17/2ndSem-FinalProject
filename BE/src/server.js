const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const app = express();

const router = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");

// app.use(
//   cors({
//     // origin: "http://localhost:5173",
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Serve static files from the React app (after running 'npm run build' in the React app)
app.use(express.static(path.join(__dirname, "client/build")));

// Serve React's index.html for all non-API routes (to let React Router handle it)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use("/example", (req, res, next) => {
  res.send("Hello from the server hi");
});

app.use("/api/v1", router);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../FE/dist", "index.html"));
// });

app.use(errorHandler);

module.exports = app;
