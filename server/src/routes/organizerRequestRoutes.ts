import { Router } from "express";

import {
  createOrganizerRequest,
  getPendingOrganizerRequests,
  approveOrganizerRequest,
  rejectOrganizerRequest,
  revokeOrganizer
} from "../controllers/organizerRequestController.js";

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


// Student
router.post(
  "/",
  authenticateToken,
  requireRole(UserRole.STUDENT),
  createOrganizerRequest
);


// Admin
router.get(
  "/pending",
  authenticateToken,
  requireRole(UserRole.ADMIN),
  getPendingOrganizerRequests
);


router.patch(
  "/:id/approve",
  authenticateToken,
  requireRole(UserRole.ADMIN),
  approveOrganizerRequest
);


router.patch(
  "/:id/reject",
  authenticateToken,
  requireRole(UserRole.ADMIN),
  rejectOrganizerRequest
);

router.patch(
  "/users/:userId/revoke",
  authenticateToken,
  requireRole(UserRole.ADMIN),
  revokeOrganizer
);


export default router;