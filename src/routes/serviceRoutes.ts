import express from "express";
import { auth, admin } from "../middleware/auth";
import { createService, getServices } from "../controllers/servicecontroller";

const router = express.Router();

// Add explicit type annotation for the router
const servicesRouter: express.Router = router;

servicesRouter.post("/", auth, admin, createService);
servicesRouter.get("/", getServices);

export default servicesRouter;
