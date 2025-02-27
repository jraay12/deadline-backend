const express = require("express");
const cors = require("cors"); // Import CORS
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");


app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.use("/auth/v1", userRoutes);
app.use("/api/v1", taskRoutes);

app.listen(PORT, HOST, () => {
  console.log("Server is running on port 3000");
});