import express from "express";
import { register, login, logout, validate } from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/validate", auth, validate);
export default router;
