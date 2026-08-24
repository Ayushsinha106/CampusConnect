import { Router } from "express";
import { getVenues } from "../controllers/venueController.js";

const router = Router();

router.get(
    "/",
    getVenues
);

export default router;