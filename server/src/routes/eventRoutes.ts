import { Router } from "express";

import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from "../controllers/eventController.js";


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
  createEvent
);

router.get(
  "/",
  getEvents
);

router.get(
  "/:id",
  getEventById
);

router.post(
  "/",
  authenticateToken,
  requireRole(
    UserRole.ORGANIZER,
    UserRole.ADMIN
  ),
  createEvent
);

router.patch(
  "/:id",
  authenticateToken,
  requireRole(
    UserRole.ORGANIZER,
    UserRole.ADMIN
  ),
  updateEvent
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole(
    UserRole.ORGANIZER,
    UserRole.ADMIN
  ),
  deleteEvent
);

export default router;