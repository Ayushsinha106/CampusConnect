import type {
  Request,
  Response,
  NextFunction
} from "express";

import jwt from "jsonwebtoken";

import AppDataSource from "../config/database.js";
import {
  User,
  UserRole
} from "../entities/User.js";


export interface AuthenticatedUser {
  userId: number;
  role: UserRole;
}


export interface AuthenticatedRequest
  extends Request {
  user?: AuthenticatedUser;
}


export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message:
        "Authentication token required"
    });

    return;
  }

  const parts =
    authHeader.split(" ");

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {
    res.status(401).json({
      success: false,
      message:
        "Invalid authorization header format"
    });

    return;
  }

  const token = parts[1];

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      success: false,
      message:
        "JWT secret is not configured"
    });

    return;
  }

  try {
    const decoded =
      jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "number"
    ) {
      res.status(401).json({
        success: false,
        message:
          "Invalid authentication token"
      });

      return;
    }

    // Get the CURRENT user from PostgreSQL
    const userRepository =
      AppDataSource.getRepository(User);

    const user =
      await userRepository.findOne({
        where: {
          id: decoded.userId
        }
      });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User no longer exists"
      });

      return;
    }

    // Use the role currently stored in DB
    req.user = {
      userId: user.id,
      role: user.role
    };

    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message:
        "Invalid or expired token"
    });
  }
}