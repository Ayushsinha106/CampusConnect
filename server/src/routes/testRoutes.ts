import { Router } from "express";

import {
  authenticateToken
} from "../middleware/authMiddleware.js";

import {
  requireRole
} from "../middleware/roleMiddleware.js";

const router = Router();


// Any authenticated user
router.get(
  "/profile",
  authenticateToken,
  (req, res) => {
    res.json({
      success: true,
      message:
        "You are authenticated",
      user: req.user
    });
  }
);


// Student only
router.get(
  "/student",
  authenticateToken,
  requireRole("STUDENT"),
  (req, res) => {
    res.json({
      success: true,
      message:
        "You are authorized as a STUDENT",
      user: req.user
    });
  }
);


// Organizer only
router.get(
  "/organizer",
  authenticateToken,
  requireRole("ORGANIZER"),
  (req, res) => {
    res.json({
      success: true,
      message:
        "You are authorized as an ORGANIZER",
      user: req.user
    });
  }
);


// Admin only
router.get(
  "/admin",
  authenticateToken,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message:
        "You are authorized as an ADMIN",
      user: req.user
    });
  }
);

export default router;