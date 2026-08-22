import { Router } from "express";

import {
  getAdminStatistics,
  getAdminUsers,
  getAdminEvents
} from "../controllers/adminController.js";

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


// Everything in this router is Admin-only.

router.get(
  "/statistics",
  authenticateToken,
  requireRole(UserRole.ADMIN),
  getAdminStatistics
);


router.get(
  "/users",
  authenticateToken,
  requireRole(UserRole.ADMIN),
  getAdminUsers
);


router.get(
  "/events",
  authenticateToken,
  requireRole(UserRole.ADMIN),
  getAdminEvents
);


export default router;