import { Router } from "express";

import { createPendingEvent, getPendingEvents, getPendingEventById, approvePendingEvent, rejectPendingEvent } from "../controllers/pendingEventController.js";


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



router.patch(
    "/:id/approve",
    authenticateToken,
    requireRole(UserRole.ADMIN),
    approvePendingEvent
);

router.patch(
    "/:id/reject",
    authenticateToken,
    requireRole(UserRole.ADMIN),
    rejectPendingEvent
);

export default router;