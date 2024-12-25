require("dotenv/config");

const app = require("./server");
const connectDB = require("./config/database");

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(
        `Server running on ${process.env.NODE_ENV.toLocaleUpperCase()} port ${PORT}`
      );
    });
  })
  .catch((err) => console.error(err));
