import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import AppDataSource from "../config/database.js";
import { User } from "../entities/User.js";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";


export async function getUsers(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const userRepository =
      AppDataSource.getRepository(User);

    const users = await userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
}


export async function createUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });

      return;
    }

    // Validate role
    const allowedRoles = [
      "STUDENT",
      "ORGANIZER",
      "ADMIN"
    ];

    const userRole =
      role || "STUDENT";

    if (!allowedRoles.includes(userRole)) {
      res.status(400).json({
        success: false,
        message: "Invalid user role"
      });

      return;
    }

    const userRepository =
      AppDataSource.getRepository(User);

    // Check duplicate email
    const existingUser =
      await userRepository.findOne({
        where: { email }
      });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          "A user with this email already exists"
      });

      return;
    }

    // Hash password
    const passwordHash =
      await bcrypt.hash(password, 10);

    // Create user
    const user =
      userRepository.create({
        name,
        email,
        passwordHash,
        role: userRole
      });

    const savedUser =
      await userRepository.save(user);

    // Never return passwordHash
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
}

export async function getMyProfile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userRepository =
      AppDataSource.getRepository(User);

    const user =
      await userRepository.findOne({
        where: {
          id: req.user!.userId
        }
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });

      return;
    }

    res.json({
      success: true,

      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch profile"
    });
  }
}

export async function updateMyProfile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const {
      name
    } = req.body;

    if (
      name !== undefined &&
      (
        typeof name !== "string" ||
        !name.trim()
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Name must be a non-empty string"
      });

      return;
    }

    const userRepository =
      AppDataSource.getRepository(User);

    const user =
      await userRepository.findOne({
        where: {
          id: req.user!.userId
        }
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });

      return;
    }

    if (name !== undefined) {
      user.name =
        name.trim();
    }

    const updatedUser =
      await userRepository.save(user);

    res.json({
      success: true,
      message:
        "Profile updated successfully",

      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        updatedAt:
          updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to update profile"
    });
  }
}