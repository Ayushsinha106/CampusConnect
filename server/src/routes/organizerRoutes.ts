import { Router } from "express";

import {
    getOrganizerDashboard,
    getOrganizerEvents
} from "../controllers/organizerController.js";

import {
    authenticateToken,
} from "../middleware/authMiddleware.js";

import {
    requireRole
} from "../middleware/roleMiddleware.js";

import {
    UserRole
} from "../entities/User.js";

const router = Router();

router.get(
    "/events",
    authenticateToken,
    requireRole(UserRole.ORGANIZER),
    getOrganizerEvents
);

router.get(
    "/dashboard",
    authenticateToken,
    requireRole(UserRole.ORGANIZER),
    getOrganizerDashboard
);

export default router;