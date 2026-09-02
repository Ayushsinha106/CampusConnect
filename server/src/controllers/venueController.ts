import type { Request, Response } from "express";
import AppDataSource from "../config/database.js";
import { Venue } from "../entities/Venue.js";

export async function getVenues(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const venueRepository =
            AppDataSource.getRepository(Venue);

        const venues =
            await venueRepository.find({
                order: {
                    name: "ASC"
                }
            });

        res.json({
            success: true,
            data: venues.map((venue) => ({
                id: venue.id,
                name: venue.name,
                location: venue.location,
                capacity: venue.capacity
            }))
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch venues"
        });
    }
}

export async function createVenue(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { name, location, capacity } = req.body;

        // Validate name
        if (!name || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Venue name is required"
            });
            return;
        }

        if (name.trim().length > 150) {
            res.status(400).json({
                success: false,
                message: "Venue name cannot exceed 150 characters"
            });
            return;
        }

        // Validate location
        if (!location || !location.trim()) {
            res.status(400).json({
                success: false,
                message: "Venue location is required"
            });
            return;
        }

        if (location.trim().length > 200) {
            res.status(400).json({
                success: false,
                message: "Venue location cannot exceed 200 characters"
            });
            return;
        }

        // Validate capacity
        if (
            capacity !== null &&
            capacity !== undefined &&
            (Number.isNaN(Number(capacity)) || Number(capacity) <= 0)
        ) {
            res.status(400).json({
                success: false,
                message: "Capacity must be a positive number"
            });
            return;
        }

        const venueRepository = AppDataSource.getRepository(Venue);

        const venue = venueRepository.create({
            name: name.trim(),
            location: location.trim(),
            capacity:
                capacity === null || capacity === undefined || capacity === ""
                    ? null
                    : Number(capacity)
        });

        const savedVenue = await venueRepository.save(venue);

        res.status(201).json({
            success: true,
            message: "Venue created successfully",
            data: savedVenue
        });
    } catch (error) {
        console.error("Create venue error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create venue"
        });
    }
}

export async function updateVenue(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const venueId = Number(req.params.id);

        const { name, location, capacity } = req.body;

        if (Number.isNaN(venueId)) {
            res.status(400).json({
                success: false,
                message: "Invalid venue ID"
            });
            return;
        }

        // Validate name
        if (!name || !name.trim()) {
            res.status(400).json({
                success: false,
                message: "Venue name is required"
            });
            return;
        }

        if (name.trim().length > 150) {
            res.status(400).json({
                success: false,
                message: "Venue name cannot exceed 150 characters"
            });
            return;
        }

        // Validate location
        if (!location || !location.trim()) {
            res.status(400).json({
                success: false,
                message: "Venue location is required"
            });
            return;
        }

        if (location.trim().length > 200) {
            res.status(400).json({
                success: false,
                message: "Venue location cannot exceed 200 characters"
            });
            return;
        }

        // Validate capacity
        if (
            capacity !== null &&
            capacity !== undefined &&
            capacity !== "" &&
            (Number.isNaN(Number(capacity)) || Number(capacity) <= 0)
        ) {
            res.status(400).json({
                success: false,
                message: "Capacity must be a positive number"
            });
            return;
        }

        const venueRepository = AppDataSource.getRepository(Venue);

        const venue = await venueRepository.findOne({
            where: {
                id: venueId
            }
        });

        if (!venue) {
            res.status(404).json({
                success: false,
                message: "Venue not found"
            });
            return;
        }

        venue.name = name.trim();
        venue.location = location.trim();

        venue.capacity =
            capacity === null || capacity === undefined || capacity === ""
                ? null
                : Number(capacity);

        const updatedVenue = await venueRepository.save(venue);

        res.json({
            success: true,
            message: "Venue updated successfully",
            data: updatedVenue
        });
    } catch (error) {
        console.error("Update venue error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update venue"
        });
    }
}