import { Router } from "express";

import {
  createReview,
  getEventReviews
} from "../controllers/reviewController.js";

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


// Public
router.get(
  "/events/:eventId",
  getEventReviews
);


// Student
router.post(
  "/events/:eventId",
  authenticateToken,
  requireRole(UserRole.STUDENT),
  createReview
);


export default router;