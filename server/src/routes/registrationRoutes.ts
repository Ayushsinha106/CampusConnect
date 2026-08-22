import { Router } from "express";

import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  addCompanions,
  getRegistrationCompanions,
  getEventRegistrations,
  markAttendance
} from "../controllers/registrationController.js";

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


// Register for an event
router.post(
  "/events/:eventId",
  authenticateToken,
  requireRole(UserRole.STUDENT),
  registerForEvent
);


// My registrations
router.get(
  "/my",
  authenticateToken,
  requireRole(UserRole.STUDENT),
  getMyRegistrations
);


// Cancel registration
router.patch(
  "/:registrationId/cancel",
  authenticateToken,
  requireRole(UserRole.STUDENT),
  cancelRegistration
);

// Add Companions
router.post(
  "/:registrationId/companions",
  authenticateToken,
  requireRole(UserRole.STUDENT),
  addCompanions
);

router.get(
  "/:registrationId/companions",
  authenticateToken,
  requireRole(UserRole.STUDENT),
  getRegistrationCompanions
);

router.get(
  "/events/:eventId",
  authenticateToken,
  requireRole(
    UserRole.ORGANIZER,
    UserRole.ADMIN
  ),
  getEventRegistrations
);

router.patch(
  "/:registrationId/attendance",
  authenticateToken,
  requireRole(
    UserRole.ORGANIZER,
    UserRole.ADMIN
  ),
  markAttendance
);

export default router;