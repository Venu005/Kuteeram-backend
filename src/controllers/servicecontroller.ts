import { Request, Response } from "express";
import Service from "../models/Service";

export const createService = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const service = new Service({ ...req.body, createdBy: req.user._id });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const services = await Service.find().populate("createdBy", "name email");
    res.json(services);
  } catch (error) {
    res.status(500).json(error);
  }
};
