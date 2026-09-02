import { Router } from "express";
import { getVenues, createVenue, updateVenue } from "../controllers/venueController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { UserRole } from "../entities/User.js";

const router = Router();

router.get(
    "/",
    getVenues
);

router.post(
    "/",
    authenticateToken,
    requireRole(UserRole.ADMIN),
    createVenue
);

router.patch(
    "/:id",
    authenticateToken,
    requireRole(UserRole.ADMIN),
    updateVenue
);

export default router;