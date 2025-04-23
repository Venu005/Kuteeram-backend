import express from "express";
import { auth } from "../middleware/auth";
import { createBooking, getBookings } from "../controllers/bookingController";

const router = express.Router();

router.post("/", auth, createBooking);
router.get("/", auth, getBookings);

export default router;
