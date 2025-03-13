const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const Order = require("./models/Order");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const router = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true,
};

app.use(cors(corsOptions));

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

// WebSocket setup
io.on("connection", async (socket) => {
  console.log("New client connected");

  // Send initial pending orders count
  try {
    const count = await Order.countDocuments({ status: "pending" });
    socket.emit("pendingOrdersCount", count);
  } catch (err) {
    console.error("Error fetching pending orders count:", err);
  }

  // Listen for order updates
  const orderChangeStream = Order.watch();
  orderChangeStream.on("change", async (change) => {
    if (
      change.operationType === "update" ||
      change.operationType === "insert" ||
      change.operationType === "delete"
    ) {
      const pendingOrdersCount = await Order.countDocuments({
        status: "pending",
      });
      io.emit("pendingOrdersCount", pendingOrdersCount);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

module.exports = http;
