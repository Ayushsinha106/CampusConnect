import { Router } from "express";

import {
  getUsers,
  createUser,
  getMyProfile,
  updateMyProfile
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

export default router;