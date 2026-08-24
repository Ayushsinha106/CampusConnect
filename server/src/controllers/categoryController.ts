import type { Request, Response } from "express";
import AppDataSource from "../config/database.js";
import { Category } from "../entities/Category.js";

export async function getCategories(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const categoryRepository =
            AppDataSource.getRepository(Category);

        const categories =
            await categoryRepository.find({
                order: {
                    name: "ASC"
                }
            });

        res.json({
            success: true,
            data: categories.map((category) => ({
                id: category.id,
                name: category.name,
                description: category.description,
                events: category.events
            }))
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
}