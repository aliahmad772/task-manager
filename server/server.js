require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const app = require("./app");
const connectDB = require("./config/db");

async function startServer() {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log("Server on", port));
  } catch (err) {
    console.error("Mongo connection failed:", err.message);
    process.exitCode = 1;
  }
}

startServer();
