import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import AppDataSource from "../config/database.js";
import { User } from "../entities/User.js";


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