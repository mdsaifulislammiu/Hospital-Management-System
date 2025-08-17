const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const transactionRoutes = require("./routes/transactions");
const departmentRoutes = require("./routes/departments");
const expenseRoutes = require("./routes/expenses");
const dashboardRoutes = require("./routes/dashboard");

const { initializeDatabase } = require("./database/init");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set NODE_ENV to production for consistent behavior
process.env.NODE_ENV = 'production';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize database
initializeDatabase();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Hospital Finance API is running" });
});

// Catch-all route to serve the React app for any other requests
// This is important for client-side routing (e.g., React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;


