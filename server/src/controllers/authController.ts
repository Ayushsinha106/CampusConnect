import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import AppDataSource from "../config/database.js";
import { User, UserRole } from "../entities/User.js";

const userRepository =
  AppDataSource.getRepository(User);


export async function register(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    // -------------------------
    // Validation
    // -------------------------

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });

      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long"
      });

      return;
    }

    // -------------------------
    // Check existing user
    // -------------------------

    const existingUser =
      await userRepository.findOne({
        where: { email }
      });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          "An account with this email already exists"
      });

      return;
    }

    // -------------------------
    // Hash password
    // -------------------------

    const passwordHash =
      await bcrypt.hash(password, 10);

    // -------------------------
    // Create user
    // -------------------------

    const user =
      userRepository.create({
        name,
        email,
        passwordHash,
        role: UserRole.STUDENT
      });

    const savedUser =
      await userRepository.save(user);

    // -------------------------
    // Response
    // -------------------------

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
}


export async function login(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      email,
      password
    } = req.body;

    // -------------------------
    // Validation
    // -------------------------

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });

      return;
    }

    // -------------------------
    // Find user
    // -------------------------

    const user =
      await userRepository.findOne({
        where: { email }
      });

    if (!user) {
      res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });

      return;
    }

    // -------------------------
    // Compare password
    // -------------------------

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });

      return;
    }

    // -------------------------
    // JWT
    // -------------------------

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        "JWT_SECRET is not configured"
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      {
        expiresIn: "1d"
      }
    );

    // -------------------------
    // Response
    // -------------------------

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
}