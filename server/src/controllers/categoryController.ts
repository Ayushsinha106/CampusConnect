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


export async function createCategory(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Category name is required",
            });
            return;
        }

        const categoryRepository = AppDataSource.getRepository(Category);

        const existingCategory = await categoryRepository.findOne({
            where: {
                name: name.trim(),
            },
        });

        if (existingCategory) {
            res.status(409).json({
                success: false,
                message: "A category with this name already exists",
            });
            return;
        }

        const category = categoryRepository.create({
            name: name.trim(),
            description: description?.trim() || null,
        });

        const savedCategory = await categoryRepository.save(category);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: savedCategory,
        });
    } catch (error) {
        console.error("Create category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create category",
        });
    }
}

export async function updateCategory(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const categoryId = Number(req.params.id);
        const { name, description } = req.body;

        if (Number.isNaN(categoryId)) {
            res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
            return;
        }

        if (!name || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Category name is required",
            });
            return;
        }

        const categoryRepository = AppDataSource.getRepository(Category);

        const category = await categoryRepository.findOne({
            where: {
                id: categoryId,
            },
        });

        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found",
            });
            return;
        }

        const existingCategory = await categoryRepository.findOne({
            where: {
                name: name.trim(),
            },
        });

        if (existingCategory && existingCategory.id !== categoryId) {
            res.status(409).json({
                success: false,
                message: "A category with this name already exists",
            });
            return;
        }

        category.name = name.trim();
        category.description = description?.trim() || null;

        const updatedCategory = await categoryRepository.save(category);

        res.json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        console.error("Update category error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update category",
        });
    }
}