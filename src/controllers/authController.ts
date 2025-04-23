import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Modified
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    const userResponse = { _id: user._id, name: user.name, email: user.email };
    res.status(201).json({ user: userResponse });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    if (email === process.env.ADMIN_EMAIL) {
      user.role = "admin";
      const admin = await User.findOne({ email });
      if (!admin || !(await admin.comparePassword(password))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET!);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Modified
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });
      const userResponse = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      };
      res.json({ user: userResponse });
    } else {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Modified
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      };
      res.json({ user: userResponse });
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid credentials" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Match cookie settings
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
};

export const validate = async (req: Request, res: Response) => {
  try {
    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
