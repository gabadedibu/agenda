const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many login attempts. Please try again later.",
});

app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/agendas", require("./routes/agendaRoutes"));

app.get("/", (req, res) => {
  res.send("Agenda Management System API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});