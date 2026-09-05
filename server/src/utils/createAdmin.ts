import "reflect-metadata";
import "dotenv/config";

import bcrypt from "bcrypt";

import AppDataSource from "../config/database.js";

import {
  User,
  UserRole
} from "../entities/User.js";


async function createAdmin(): Promise<void> {
  try {
    await AppDataSource.initialize();

    const userRepository =
      AppDataSource.getRepository(User);

    const email =
      "admin@gmail.com";

    const existing =
      await userRepository.findOne({
        where: { email }
      });

    if (existing) {
      console.log(
        "Admin already exists."
      );

      await AppDataSource.destroy();

      return;
    }

    const passwordHash =
      await bcrypt.hash(
        "admin123",
        10
      );

    const admin =
      userRepository.create({
        name: "CampusConnect Admin",
        email,
        passwordHash,
        role: UserRole.ADMIN
      });

    await userRepository.save(admin);

    console.log(
      "Admin account created successfully."
    );

    await AppDataSource.destroy();

  } catch (error) {
    console.error(
      "Failed to create admin:",
      error
    );

    process.exit(1);
  }
}

createAdmin();