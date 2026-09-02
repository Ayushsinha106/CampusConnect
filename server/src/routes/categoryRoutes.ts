import { Router } from "express";
import { getCategories, createCategory, updateCategory } from "../controllers/categoryController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { UserRole } from "../entities/User.js";

const router = Router();

router.get(
    "/",
    getCategories
);

router.post(
    "/",
    authenticateToken,
    requireRole(UserRole.ADMIN),
    createCategory
);

router.patch(
    "/:id",
    authenticateToken,
    requireRole(UserRole.ADMIN),
    updateCategory
);

export default router;