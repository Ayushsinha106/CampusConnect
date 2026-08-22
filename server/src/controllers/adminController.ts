import type { Response } from "express";

import AppDataSource from "../config/database.js";

import {
  User,
  UserRole
} from "../entities/User.js";

import {
  Event
} from "../entities/Event.js";

import {
  Registration,
  RegistrationStatus
} from "../entities/Registration.js";

import type {
  AuthenticatedRequest
} from "../middleware/authMiddleware.js";


export async function getAdminStatistics(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userRepository =
      AppDataSource.getRepository(User);

    const eventRepository =
      AppDataSource.getRepository(Event);

    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    // -------------------------
    // User statistics
    // -------------------------

    const totalUsers =
      await userRepository.count();

    const totalStudents =
      await userRepository.count({
        where: {
          role: UserRole.STUDENT
        }
      });

    const totalOrganizers =
      await userRepository.count({
        where: {
          role: UserRole.ORGANIZER
        }
      });

    const totalAdmins =
      await userRepository.count({
        where: {
          role: UserRole.ADMIN
        }
      });


    // -------------------------
    // Event statistics
    // -------------------------

    const totalEvents =
      await eventRepository.count();

    const now = new Date();

    const upcomingEvents =
      await eventRepository
        .createQueryBuilder("event")
        .where(
          "event.startDateTime > :now",
          { now }
        )
        .getCount();

    const completedEvents =
      await eventRepository
        .createQueryBuilder("event")
        .where(
          "event.endDateTime < :now",
          { now }
        )
        .getCount();


    // -------------------------
    // Registration statistics
    // -------------------------

    const totalRegistrations =
      await registrationRepository.count();

    const confirmedRegistrations =
      await registrationRepository.count({
        where: {
          status:
            RegistrationStatus.CONFIRMED
        }
      });

    const cancelledRegistrations =
      await registrationRepository.count({
        where: {
          status:
            RegistrationStatus.CANCELLED
        }
      });

    const attendedRegistrations =
      await registrationRepository.count({
        where: {
          status:
            RegistrationStatus.CONFIRMED,

          attended: true
        }
      });


    res.json({
      success: true,

      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          organizers: totalOrganizers,
          admins: totalAdmins
        },

        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          completed: completedEvents
        },

        registrations: {
          total: totalRegistrations,
          confirmed:
            confirmedRegistrations,
          cancelled:
            cancelledRegistrations,
          attended:
            attendedRegistrations
        }
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin statistics"
    });
  }
}

export async function getAdminUsers(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userRepository =
      AppDataSource.getRepository(User);

    const users =
      await userRepository.find({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        },
        order: {
          createdAt: "DESC"
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
      message:
        "Failed to fetch users"
    });
  }
}

export async function getAdminEvents(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const eventRepository =
      AppDataSource.getRepository(Event);

    const events =
      await eventRepository.find({
        relations: {
          organizer: true,
          category: true,
          venue: true
        },

        order: {
          createdAt: "DESC"
        }
      });

    const data =
      events.map((event) => ({
        id: event.id,

        title:
          event.title,

        startDateTime:
          event.startDateTime,

        endDateTime:
          event.endDateTime,

        capacity:
          event.capacity,

        isPublic:
          event.isPublic,

        organizer: {
          id:
            event.organizer.id,

          name:
            event.organizer.name
        },

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
            event.venue.name
        }
      }));

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch admin events"
    });
  }
}