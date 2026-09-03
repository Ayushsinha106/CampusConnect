import type { Response } from "express";

import AppDataSource from "../config/database.js";

import { PendingEvent } from "../entities/PendingEvent.js";
import { Event } from "../entities/Event.js";
import {
    Category
} from "../entities/Category.js";

import {
    Venue
} from "../entities/Venue.js";

import { User, UserRole } from "../entities/User.js";

import type {
    AuthenticatedRequest
} from "../middleware/authMiddleware.js";

import {
    Registration,
    RegistrationStatus
} from "../entities/Registration.js";

import {
    Companion
} from "../entities/Companion.js";



export async function createPendingEvent(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const {
            title,
            description,
            startDateTime,
            endDateTime,
            capacity,
            imageUrl,
            isPublic,
            categoryId,
            venueId
        } = req.body;


        // Basic validation


        if (
            !title ||
            !description ||
            !startDateTime ||
            !endDateTime ||
            capacity === undefined ||
            !categoryId ||
            !venueId
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Title, description, dates, capacity, category and venue are required"
            });

            return;
        }

        const capacityNumber =
            Number(capacity);

        if (
            !Number.isInteger(capacityNumber) ||
            capacityNumber <= 0
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Capacity must be a positive integer"
            });

            return;
        }

        const start =
            new Date(startDateTime);

        const end =
            new Date(endDateTime);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Invalid event date or time"
            });

            return;
        }

        if (end <= start) {
            res.status(400).json({
                success: false,
                message:
                    "End time must be after start time"
            });

            return;
        }


        // Repositories


        const eventRepository =
            AppDataSource.getRepository(PendingEvent);

        const categoryRepository =
            AppDataSource.getRepository(Category);

        const venueRepository =
            AppDataSource.getRepository(Venue);

        const userRepository =
            AppDataSource.getRepository(User);


        // Find organizer


        const organizer =
            await userRepository.findOne({
                where: {
                    id: req.user!.userId
                }
            });

        if (!organizer) {
            res.status(404).json({
                success: false,
                message: "Organizer not found"
            });

            return;
        }


        // Find category


        const category =
            await categoryRepository.findOne({
                where: {
                    id: Number(categoryId)
                }
            });

        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });

            return;
        }


        // Find venue


        const venue =
            await venueRepository.findOne({
                where: {
                    id: Number(venueId)
                }
            });

        if (!venue) {
            res.status(404).json({
                success: false,
                message: "Venue not found"
            });

            return;
        }


        // Check venue capacity


        if (
            venue.capacity !== null &&
            capacityNumber > venue.capacity
        ) {
            res.status(400).json({
                success: false,
                message:
                    "Event capacity cannot exceed venue capacity"
            });

            return;
        }


        // Create Event


        const event =
            eventRepository.create({
                title: title.trim(),
                description: description.trim(),

                startDateTime: start,
                endDateTime: end,

                capacity: capacityNumber,

                imageUrl:
                    imageUrl || null,

                isPublic:
                    Boolean(isPublic),

                organizer,
                organizerId: organizer.id,

                category,
                categoryId: category.id,

                venue,
                venueId: venue.id
            });

        const savedEvent =
            await eventRepository.save(event);


        // Response


        res.status(201).json({
            success: true,
            message: "Event created successfully",

            data: {
                id: savedEvent.id,
                title: savedEvent.title,
                description:
                    savedEvent.description,

                startDateTime:
                    savedEvent.startDateTime,

                endDateTime:
                    savedEvent.endDateTime,

                capacity:
                    savedEvent.capacity,

                imageUrl:
                    savedEvent.imageUrl,

                isPublic:
                    savedEvent.isPublic,

                organizerId:
                    savedEvent.organizerId,

                categoryId:
                    savedEvent.categoryId,

                venueId:
                    savedEvent.venueId,

                createdAt:
                    savedEvent.createdAt
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to create event"
        });
    }
}

export async function getPendingEvents(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const pendingEventRepository =
            AppDataSource.getRepository(PendingEvent);

        const pendingEvents = await pendingEventRepository.find({
            relations: {
                organizer: true,
                category: true,
                venue: true,
            },
            order: {
                createdAt: "ASC",
            },
        });

        res.json({
            success: true,
            data: pendingEvents,
        });
    } catch (error) {
        console.error("Get pending events error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch pending events",
        });
    }
}



export async function getPendingEventById(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const eventId = Number(req.params.id);

        if (!Number.isInteger(eventId) || eventId <= 0) {
            res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });

            return;
        }

        const eventRepository =
            AppDataSource.getRepository(PendingEvent);

        const event =
            await eventRepository.findOne({
                where: {
                    id: eventId
                },
                relations: {
                    category: true,
                    venue: true,
                    organizer: true
                }
            });

        if (!event) {
            res.status(404).json({
                success: false,
                message: "Event not found"
            });

            return;
        }

        const registrationRepository =
            AppDataSource.getRepository(Registration);

        const companionRepository =
            AppDataSource.getRepository(Companion);

        const registrations =
            await registrationRepository.find({
                where: {
                    eventId: event.id,
                    status: RegistrationStatus.CONFIRMED
                }
            });

        const registeredCount =
            registrations.length;

        // Get registration IDs
        const registrationIds =
            registrations.map(
                (registration) =>
                    registration.id
            );

        // Count companions
        let companionCount = 0;

        if (registrationIds.length > 0) {
            companionCount =
                await companionRepository
                    .createQueryBuilder("companion")
                    .where(
                        "companion.registrationId IN (:...ids)",
                        {
                            ids: registrationIds
                        }
                    )
                    .getCount();
        }
        const occupiedSeats =
            registeredCount +
            companionCount;

        const availableSeats =
            Math.max(
                event.capacity -
                occupiedSeats,
                0
            );

        res.json({
            success: true,
            data: {
                id: event.id,

                title: event.title,

                description:
                    event.description,

                startDateTime:
                    event.startDateTime,

                endDateTime:
                    event.endDateTime,

                capacity:
                    event.capacity,

                imageUrl:
                    event.imageUrl,

                isPublic:
                    event.isPublic,
                availableSeats: availableSeats,

                category: {
                    id: event.category.id,
                    name: event.category.name,
                    description:
                        event.category.description
                },

                venue: {
                    id: event.venue.id,
                    name: event.venue.name,
                    location:
                        event.venue.location,
                    capacity:
                        event.venue.capacity
                },

                organizer: {
                    id: event.organizer.id,
                    name: event.organizer.name
                },

                createdAt:
                    event.createdAt,

                updatedAt:
                    event.updatedAt
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch event"
        });
    }
}


// APPROVE PENDING EVENT


export async function approvePendingEvent(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const pendingEventId = Number(req.params.id);

        if (Number.isNaN(pendingEventId)) {
            res.status(400).json({
                success: false,
                message: "Invalid pending event ID",
            });
            return;
        }

        const pendingEventRepository =
            queryRunner.manager.getRepository(PendingEvent);

        const eventRepository =
            queryRunner.manager.getRepository(Event);

        const pendingEvent = await pendingEventRepository.findOne({
            where: {
                id: pendingEventId,
            },
        });

        if (!pendingEvent) {
            await queryRunner.rollbackTransaction();

            res.status(404).json({
                success: false,
                message: "Pending event not found",
            });
            return;
        }

        // Make sure referenced records still exist

        const userRepository =
            queryRunner.manager.getRepository(User);

        const categoryRepository =
            queryRunner.manager.getRepository(Category);

        const venueRepository =
            queryRunner.manager.getRepository(Venue);

        const organizer = await userRepository.findOne({
            where: {
                id: pendingEvent.organizerId,
            },
        });

        if (!organizer) {
            await queryRunner.rollbackTransaction();

            res.status(400).json({
                success: false,
                message: "Event organizer no longer exists",
            });
            return;
        }

        const category = await categoryRepository.findOne({
            where: {
                id: pendingEvent.categoryId,
            },
        });

        if (!category) {
            await queryRunner.rollbackTransaction();

            res.status(400).json({
                success: false,
                message: "Event category no longer exists",
            });
            return;
        }

        const venue = await venueRepository.findOne({
            where: {
                id: pendingEvent.venueId,
            },
        });

        if (!venue) {
            await queryRunner.rollbackTransaction();

            res.status(400).json({
                success: false,
                message: "Event venue no longer exists",
            });
            return;
        }

        // Check venue capacity again

        if (
            venue.capacity !== null &&
            pendingEvent.capacity > venue.capacity
        ) {
            await queryRunner.rollbackTransaction();

            res.status(400).json({
                success: false,
                message:
                    "Event capacity exceeds the venue capacity",
            });
            return;
        }

        // Create actual Event

        const event = eventRepository.create({
            title: pendingEvent.title,
            description: pendingEvent.description,
            startDateTime: pendingEvent.startDateTime,
            endDateTime: pendingEvent.endDateTime,
            capacity: pendingEvent.capacity,
            imageUrl: pendingEvent.imageUrl,
            isPublic: pendingEvent.isPublic,

            organizerId: pendingEvent.organizerId,
            categoryId: pendingEvent.categoryId,
            venueId: pendingEvent.venueId,
        });

        const savedEvent = await eventRepository.save(event);

        // Remove PendingEvent

        await pendingEventRepository.remove(pendingEvent);

        await queryRunner.commitTransaction();

        res.json({
            success: true,
            message: "Event approved successfully",
            data: savedEvent,
        });
    } catch (error) {
        await queryRunner.rollbackTransaction();

        console.error("Approve pending event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to approve event",
        });
    } finally {
        await queryRunner.release();
    }
}



// REJECT PENDING EVENT


export async function rejectPendingEvent(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const pendingEventId = Number(req.params.id);

        if (Number.isNaN(pendingEventId)) {
            res.status(400).json({
                success: false,
                message: "Invalid pending event ID",
            });
            return;
        }

        const pendingEventRepository =
            AppDataSource.getRepository(PendingEvent);

        const pendingEvent = await pendingEventRepository.findOne({
            where: {
                id: pendingEventId,
            },
        });

        if (!pendingEvent) {
            res.status(404).json({
                success: false,
                message: "Pending event not found",
            });
            return;
        }

        await pendingEventRepository.remove(pendingEvent);

        res.json({
            success: true,
            message: "Event rejected successfully",
        });
    } catch (error) {
        console.error("Reject pending event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reject event",
        });
    }
}