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