import type { Request, Response } from "express";
import AppDataSource from "../config/database.js";
import { Event } from "../entities/Event.js";
import {
    Registration,
    RegistrationStatus
} from "../entities/Registration.js";
import { Companion } from "../entities/Companion.js";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        role: string;
    };
}

export async function getOrganizerEvents(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const organizerId =
            req.user!.userId;

        const eventRepository =
            AppDataSource.getRepository(Event);

        const registrationRepository =
            AppDataSource.getRepository(
                Registration
            );

        const companionRepository =
            AppDataSource.getRepository(
                Companion
            );

        const events =
            await eventRepository.find({
                where: {
                    organizerId
                },

                relations: {
                    category: true,
                    venue: true
                },

                order: {
                    startDateTime: "ASC"
                }
            });

        const data = await Promise.all(
            events.map(async (event) => {

                const registrations =
                    await registrationRepository.find({
                        where: {
                            eventId: event.id,
                            status:
                                RegistrationStatus.CONFIRMED
                        }
                    });

                const registeredCount =
                    registrations.length;

                const registrationIds =
                    registrations.map(
                        (registration) =>
                            registration.id
                    );

                let companionCount = 0;

                if (registrationIds.length > 0) {
                    companionCount =
                        await companionRepository
                            .createQueryBuilder(
                                "companion"
                            )
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

                return {
                    id: event.id,

                    title:
                        event.title,

                    description:
                        event.description,

                    startDateTime:
                        event.startDateTime,

                    endDateTime:
                        event.endDateTime,

                    capacity:
                        event.capacity,

                    registeredCount,

                    companionCount,

                    occupiedSeats,

                    availableSeats,

                    imageUrl:
                        event.imageUrl,

                    isPublic:
                        event.isPublic,

                    category: {
                        id:
                            event.category.id,

                        name:
                            event.category.name
                    },

                    venue: {
                        id:
                            event.venue.id,

                        name:
                            event.venue.name,

                        location:
                            event.venue.location
                    }
                };
            })
        );

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch organizer events"
        });
    }
}

export async function getOrganizerDashboard(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> {
    try {
        const organizerId =
            req.user!.userId;

        const eventRepository =
            AppDataSource.getRepository(Event);

        const registrationRepository =
            AppDataSource.getRepository(
                Registration
            );

        // Get all events belonging to this organizer
        const events =
            await eventRepository.find({
                where: {
                    organizerId
                }
            });

        const totalEvents =
            events.length;

        // Current time
        const now = new Date();

        // Upcoming events
        const upcomingEvents =
            events.filter(
                (event) =>
                    new Date(event.startDateTime) > now
            ).length;


        // Get confirmed registrations
        const eventIds =
            events.map(
                (event) => event.id
            );

        let totalRegistrations = 0;
        let attendedRegistrations = 0;

        if (eventIds.length > 0) {

            const registrations =
                await registrationRepository
                    .find({
                        where: eventIds.map(
                            (eventId) => ({
                                eventId,
                                status:
                                    RegistrationStatus.CONFIRMED
                            })
                        )
                    });

            totalRegistrations =
                registrations.length;

            attendedRegistrations =
                registrations.filter(
                    (registration) =>
                        registration.attended
                ).length;
        }


        // Calculate attendance percentage
        const averageAttendance =
            totalRegistrations > 0
                ? Math.round(
                    (attendedRegistrations /
                        totalRegistrations) *
                    100
                )
                : 0;


        res.json({
            success: true,

            data: {
                organizer: {
                    id: organizerId,
                    name: "Organizer"
                },

                statistics: {
                    totalEvents,

                    upcomingEvents,

                    totalRegistrations,

                    averageAttendance
                }
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch organizer dashboard"
        });
    }
}