import { Router } from "express";

import {
  getUsers,
  createUser,
  getMyProfile,
  updateMyProfile,
  getMyRegistrations,
  getOrganizerEvents
} from "../controllers/userController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get(
  "/me",
  authenticateToken,
  getMyProfile
);


router.patch(
  "/me",
  authenticateToken,
  updateMyProfile
);

router.get(
  "/me/registrations",
  authenticateToken,
  getMyRegistrations
);

router.get(
  "/me/organizer-events",
  authenticateToken,
  getOrganizerEvents
);

export default router;