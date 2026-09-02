import { Router } from "express";

import { createPendingEvent, getPendingEvents, getPendingEventById, deletePendingEvent } from "../controllers/pendingEventController.js";


import {
    authenticateToken
} from "../middleware/authMiddleware.js";

import {
    requireRole
} from "../middleware/roleMiddleware.js";

import {
    UserRole
} from "../entities/User.js";


const router = Router();


router.post(
    "/",
    authenticateToken,
    requireRole(
        UserRole.ORGANIZER,
        UserRole.ADMIN
    ),
    createPendingEvent
);

router.get(
    "/",
    getPendingEvents
);

router.get(
    "/:id",
    getPendingEventById
);

router.post(
    "/",
    authenticateToken,
    requireRole(
        UserRole.ORGANIZER,
        UserRole.ADMIN
    ),
    createPendingEvent
);



router.delete(
    "/:id",
    authenticateToken,
    requireRole(
        UserRole.ORGANIZER,
        UserRole.ADMIN
    ),
    deletePendingEvent
);

export default router;