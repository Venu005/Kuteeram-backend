import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoute";
import serviceRoutes from "./routes/serviceRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import User from "./models/User";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://kuteeram-frontend.vercel.app"
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

// Create admin user if not exists
const createAdmin = async () => {
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    const admin = new User({
      name: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
    await admin.save();
    console.log("Admin user created");
  }
};

connectDB().then(() => {
  createAdmin();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
