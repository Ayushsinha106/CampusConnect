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
import { PendingEvent } from "../entities/PendingEvent.js";
import { Review } from "../entities/Review.js";
import { Companion } from "../entities/Companion.js";


export async function getAdminStatistics(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userRepository =
      AppDataSource.getRepository(User);

    const eventRepository =
      AppDataSource.getRepository(Event);

    const pendingEventRepository =
      AppDataSource.getRepository(PendingEvent);

    const registrationRepository =
      AppDataSource.getRepository(Registration);

    const reviewRepository =
      AppDataSource.getRepository(Review);

    const companionRepository =
      AppDataSource.getRepository(Companion);

    const now = new Date();

    // USER STATISTICS

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


    // EVENT STATISTICS

    const totalEvents =
      await eventRepository.count();

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

    const ongoingEvents =
      await eventRepository
        .createQueryBuilder("event")
        .where(
          "event.startDateTime <= :now",
          { now }
        )
        .andWhere(
          "event.endDateTime >= :now",
          { now }
        )
        .getCount();

    const publicEvents =
      await eventRepository.count({
        where: {
          isPublic: true
        }
      });

    const privateEvents =
      await eventRepository.count({
        where: {
          isPublic: false
        }
      });

    // Total capacity of all events
    const capacityResult =
      await eventRepository
        .createQueryBuilder("event")
        .select(
          "COALESCE(SUM(event.capacity), 0)",
          "totalCapacity"
        )
        .getRawOne();

    const totalEventCapacity =
      Number(capacityResult?.totalCapacity || 0);


    // PENDING EVENT STATISTICS

    const pendingEvents =
      await pendingEventRepository.count();


    // REGISTRATION STATISTICS

    const totalRegistrations =
      await registrationRepository.count();

    const confirmedRegistrations =
      await registrationRepository.count({
        where: {
          status: RegistrationStatus.CONFIRMED
        }
      });

    const cancelledRegistrations =
      await registrationRepository.count({
        where: {
          status: RegistrationStatus.CANCELLED
        }
      });

    const attendedRegistrations =
      await registrationRepository.count({
        where: {
          status: RegistrationStatus.CONFIRMED,
          attended: true
        }
      });

    // Attendance percentage
    const attendanceRate =
      confirmedRegistrations === 0
        ? 0
        : Number(
          (
            (attendedRegistrations /
              confirmedRegistrations) *
            100
          ).toFixed(2)
        );


    // COMPANION STATISTICS

    const totalCompanions =
      await companionRepository.count();

    // Confirmed registrations + companions
    // represent occupied seats
    const totalOccupiedSeats =
      confirmedRegistrations +
      totalCompanions;

    const availableSeats = Math.max(
      totalEventCapacity -
      totalOccupiedSeats,
      0
    );


    // REVIEW STATISTICS

    const totalReviews =
      await reviewRepository.count();

    const reviewAverageResult =
      await reviewRepository
        .createQueryBuilder("review")
        .select(
          "COALESCE(AVG(review.rating), 0)",
          "averageRating"
        )
        .getRawOne();

    const averageRating = Number(
      Number(
        reviewAverageResult?.averageRating || 0
      ).toFixed(2)
    );

    // Rating distribution
    const fiveStarReviews =
      await reviewRepository.count({
        where: {
          rating: 5
        }
      });

    const fourStarReviews =
      await reviewRepository.count({
        where: {
          rating: 4
        }
      });

    const threeStarReviews =
      await reviewRepository.count({
        where: {
          rating: 3
        }
      });

    const twoStarReviews =
      await reviewRepository.count({
        where: {
          rating: 2
        }
      });

    const oneStarReviews =
      await reviewRepository.count({
        where: {
          rating: 1
        }
      });


    // RESPONSE

    res.json({
      success: true,

      data: {

        // -------------------------
        // Users
        // -------------------------

        users: {
          total: totalUsers,
          students: totalStudents,
          organizers: totalOrganizers,
          admins: totalAdmins
        },


        // -------------------------
        // Events
        // -------------------------

        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          ongoing: ongoingEvents,
          completed: completedEvents,

          public: publicEvents,
          private: privateEvents,

          totalCapacity: totalEventCapacity
        },


        // -------------------------
        // Pending Events
        // -------------------------

        pendingEvents: {
          total: pendingEvents
        },


        // -------------------------
        // Registrations
        // -------------------------

        registrations: {
          total: totalRegistrations,

          confirmed:
            confirmedRegistrations,

          cancelled:
            cancelledRegistrations,

          attended:
            attendedRegistrations,

          attendanceRate
        },


        // -------------------------
        // Companions
        // -------------------------

        companions: {
          total: totalCompanions,

          occupiedSeats:
            totalOccupiedSeats,

          availableSeats
        },


        // -------------------------
        // Reviews
        // -------------------------

        reviews: {
          total: totalReviews,

          averageRating,

          distribution: {
            fiveStars:
              fiveStarReviews,

            fourStars:
              fourStarReviews,

            threeStars:
              threeStarReviews,

            twoStars:
              twoStarReviews,

            oneStar:
              oneStarReviews
          }
        }

      }
    });

  } catch (error) {

    console.error(
      "Get admin statistics error:",
      error
    );

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

export async function updateUserRole(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const { role } = req.body;

    if (
      role !== UserRole.STUDENT &&
      role !== UserRole.ORGANIZER
    ) {
      res.status(400).json({
        success: false,
        message:
          "Role must be STUDENT or ORGANIZER",
      });
      return;
    }

    const userRepository =
      AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Admins cannot be changed using this endpoint
    if (user.role === UserRole.ADMIN) {
      res.status(400).json({
        success: false,
        message:
          "Admin role cannot be changed",
      });
      return;
    }

    user.role = role;

    const updatedUser =
      await userRepository.save(user);

    res.json({
      success: true,
      message:
        role === UserRole.ORGANIZER
          ? "User promoted to organizer successfully"
          : "User changed to student successfully",
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to update user role",
    });
  }
}