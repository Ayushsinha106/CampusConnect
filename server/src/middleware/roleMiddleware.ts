import type {
  Response,
  NextFunction
} from "express";

import type {
  AuthenticatedRequest
} from "./authMiddleware.js";

import {
  UserRole
} from "../entities/User.js";

export function requireRole(
  ...allowedRoles: UserRole[]
) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required"
      });

      return;
    }

    if (
      !allowedRoles.includes(
        req.user.role as UserRole
      )
    ) {
      res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource"
      });

      return;
    }

    next();
  };
}