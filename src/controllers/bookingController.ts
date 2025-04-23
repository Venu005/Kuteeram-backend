import { Request, Response } from "express";
import Booking from "../models/Booking";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const booking = new Booking({
      user: req.user._id,
      service: req.body.serviceId,
      status: "pending",
    });

    await booking.save();

    // Populate the service details immediately after saving
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "service",
        select: "title description price",
      })
      .populate({
        path: "user",
        select: "name email",
      });

    // Simulate status change after 5 seconds
    setTimeout(async () => {
      const updatedBooking = await Booking.findByIdAndUpdate(
        booking._id,
        { status: "completed" },
        { new: true }
      )
        .populate({
          path: "service",
          select: "title description price",
        })
        .populate({
          path: "user",
          select: "name email",
        });
    }, 10000);

    res.status(201).send(populatedBooking);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service")
      .populate("user", "name email");
    res.send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
};
