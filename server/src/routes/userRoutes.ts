import { Router } from "express";

import {
  getUsers,
  createUser,
  getMyProfile,
  updateMyProfile,
  getMyRegistrations,
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

export default router;