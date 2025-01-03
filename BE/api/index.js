require("dotenv").config();

const app = require("./server");
const connectDB = require("./config/database");

const logServerDetails = (port, host) => {
  const blue = "\x1b[34m";
  const green = "\x1b[32m";
  const cyan = "\x1b[36m";
  const reset = "\x1b[0m";

  console.log(`${blue}\n=============================================${reset}`);
  console.log(`${green} 💾 Database connected: ${host}${reset}`);
  console.log(
    `${green} 🚀 Server running on ${process.env.NODE_ENV.toUpperCase()} mode${reset}`
  );
  console.log(`${cyan} 🌐 Listening on port ${port}${reset}`);
  console.log(`${blue}=============================================${reset}`);
};

connectDB()
  .then((conn) => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logServerDetails(PORT, conn.connection.host);
    });
  })
  .catch((err) => console.error(err));
