import type {
  Response
} from "express";

import AppDataSource from "../config/database.js";

import {
  Event
} from "../entities/Event.js";

import {
  Registration,
  RegistrationStatus
} from "../entities/Registration.js";

import {
  User,
  UserRole
} from "../entities/User.js";

import type {
  AuthenticatedRequest
} from "../middleware/authMiddleware.js";

import { Companion } from "../entities/Companion.js";

export async function registerForEvent(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const eventId =
      Number(req.params.eventId);

    if (
      !Number.isInteger(eventId) ||
      eventId <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID"
      });

      return;
    }

    const eventRepository =
      AppDataSource.getRepository(Event);

    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    const userRepository =
      AppDataSource.getRepository(User);


    // -------------------------
    // Find event
    // -------------------------

    const event =
      await eventRepository.findOne({
        where: {
          id: eventId
        }
      });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found"
      });

      return;
    }


    // -------------------------
    // Check event date
    // -------------------------

    if (
      event.startDateTime <= new Date()
    ) {
      res.status(400).json({
        success: false,
        message:
          "Registration is closed for this event"
      });

      return;
    }


    // -------------------------
    // Find student
    // -------------------------

    const student =
      await userRepository.findOne({
        where: {
          id: req.user!.userId
        }
      });

    if (!student) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });

      return;
    }


    // -------------------------
    // Make sure user is Student
    // -------------------------

    if (
      student.role !== UserRole.STUDENT
    ) {
      res.status(403).json({
        success: false,
        message:
          "Only students can register for events"
      });

      return;
    }


    // -------------------------
    // Check existing registration
    // -------------------------

    const existingRegistration =
      await registrationRepository.findOne({
        where: {
          eventId,
          studentId: student.id
        }
      });

    if (existingRegistration) {

      if (
        existingRegistration.status ===
        RegistrationStatus.CONFIRMED
      ) {
        res.status(409).json({
          success: false,
          message:
            "You are already registered for this event"
        });

        return;
      }

      // Allow cancelled registration
      // to be reactivated.

      existingRegistration.status =
        RegistrationStatus.CONFIRMED;

      existingRegistration.attended =
        false;

      const restored =
        await registrationRepository.save(
          existingRegistration
        );

      res.status(200).json({
        success: true,
        message:
          "Registration restored successfully",

        data: {
          id: restored.id,
          eventId: restored.eventId,
          studentId: restored.studentId,
          status: restored.status,
          registeredAt:
            restored.registeredAt
        }
      });

      return;
    }


    // -------------------------
    // Check current capacity
    // -------------------------

    const confirmedCount =
      await registrationRepository.count({
        where: {
          eventId,
          status:
            RegistrationStatus.CONFIRMED
        }
      });

    if (
      confirmedCount >= event.capacity
    ) {
      res.status(409).json({
        success: false,
        message:
          "This event is currently full"
      });

      return;
    }


    // -------------------------
    // Create registration
    // -------------------------

    const registration =
      registrationRepository.create({
        event,
        eventId,

        student,
        studentId: student.id,

        status:
          RegistrationStatus.CONFIRMED,

        attended: false
      });

    const savedRegistration =
      await registrationRepository.save(
        registration
      );


    res.status(201).json({
      success: true,
      message:
        "Successfully registered for event",

      data: {
        id: savedRegistration.id,
        eventId:
          savedRegistration.eventId,
        studentId:
          savedRegistration.studentId,
        status:
          savedRegistration.status,
        registeredAt:
          savedRegistration.registeredAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to register for event"
    });
  }
}

export async function cancelRegistration(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const registrationId =
      Number(req.params.registrationId);

    if (
      !Number.isInteger(registrationId) ||
      registrationId <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid registration ID"
      });

      return;
    }

    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    const registration =
      await registrationRepository.findOne({
        where: {
          id: registrationId
        }
      });

    if (!registration) {
      res.status(404).json({
        success: false,
        message:
          "Registration not found"
      });

      return;
    }


    // A student can only cancel
    // their own registration.

    if (
      registration.studentId !==
      req.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message:
          "You can only cancel your own registration"
      });

      return;
    }


    if (
      registration.status ===
      RegistrationStatus.CANCELLED
    ) {
      res.status(400).json({
        success: false,
        message:
          "Registration is already cancelled"
      });

      return;
    }


    registration.status =
      RegistrationStatus.CANCELLED;

    await registrationRepository.save(
      registration
    );


    res.json({
      success: true,
      message:
        "Registration cancelled successfully",

      data: {
        id: registration.id,
        status:
          registration.status
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to cancel registration"
    });
  }
}

export async function getMyRegistrations(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    const registrations =
      await registrationRepository.find({
        where: {
          studentId:
            req.user!.userId
        },
        relations: {
          event: true
        },
        order: {
          registeredAt: "DESC"
        }
      });

    const data =
      registrations.map(
        (registration) => ({
          id: registration.id,

          status:
            registration.status,

          attended:
            registration.attended,

          registeredAt:
            registration.registeredAt,

          event: {
            id: registration.event.id,
            title:
              registration.event.title,
            startDateTime:
              registration.event
                .startDateTime,
            endDateTime:
              registration.event
                .endDateTime,
            imageUrl:
              registration.event
                .imageUrl
          }
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
        "Failed to fetch registrations"
    });
  }
}

export async function addCompanions(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const registrationId =
      Number(req.params.registrationId);

    if (
      !Number.isInteger(registrationId) ||
      registrationId <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid registration ID"
      });

      return;
    }

    const { names } = req.body;

    // -------------------------
    // Validate names
    // -------------------------

    if (!Array.isArray(names)) {
      res.status(400).json({
        success: false,
        message:
          "Names must be provided as an array"
      });

      return;
    }

    if (names.length === 0) {
      res.status(400).json({
        success: false,
        message:
          "At least one companion is required"
      });

      return;
    }

    const cleanedNames =
      names
        .filter(
          (name): name is string =>
            typeof name === "string"
        )
        .map(
          (name) => name.trim()
        )
        .filter(
          (name) => name.length > 0
        );

    if (
      cleanedNames.length !==
      names.length
    ) {
      res.status(400).json({
        success: false,
        message:
          "All companion names must be valid"
      });

      return;
    }

    // Prevent absurd input
    if (cleanedNames.length > 10) {
      res.status(400).json({
        success: false,
        message:
          "A maximum of 10 companions can be added"
      });

      return;
    }

    // -------------------------
    // Repositories
    // -------------------------

    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    const companionRepository =
      AppDataSource.getRepository(
        Companion
      );

    const registration =
      await registrationRepository.findOne({
        where: {
          id: registrationId
        },
        relations: {
          event: true
        }
      });

    if (!registration) {
      res.status(404).json({
        success: false,
        message:
          "Registration not found"
      });

      return;
    }

    // -------------------------
    // Ownership
    // -------------------------

    if (
      registration.studentId !==
      req.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message:
          "You can only manage your own registration"
      });

      return;
    }

    // -------------------------
    // Registration status
    // -------------------------

    if (
      registration.status !==
      RegistrationStatus.CONFIRMED
    ) {
      res.status(400).json({
        success: false,
        message:
          "Only confirmed registrations can have companions"
      });

      return;
    }

    // -------------------------
    // Public event check
    // -------------------------

    if (!registration.event.isPublic) {
      res.status(400).json({
        success: false,
        message:
          "Companions are only allowed for public events"
      });

      return;
    }

    // -------------------------
    // Current companions
    // -------------------------

    const currentCompanions =
      await companionRepository.count({
        where: {
          registrationId
        }
      });

    // -------------------------
    // Capacity check
    // -------------------------

    const registrationRepository2 =
      AppDataSource.getRepository(
        Registration
      );

    const confirmedRegistrations =
  await registrationRepository2.find({
    where: {
      eventId:
        registration.eventId,

      status:
        RegistrationStatus.CONFIRMED
    }
  });

const confirmedRegistrationIds =
  confirmedRegistrations.map(
    (registration) =>
      registration.id
  );

let existingCompanionCount = 0;

if (
  confirmedRegistrationIds.length > 0
) {
  existingCompanionCount =
    await companionRepository
      .createQueryBuilder("companion")
      .where(
        "companion.registrationId IN (:...ids)",
        {
          ids:
            confirmedRegistrationIds
        }
      )
      .getCount();
}

      const currentTotal =
        confirmedRegistrations.length +
        existingCompanionCount;

      const requestedTotal =
        currentTotal +
        cleanedNames.length;

    if (
      requestedTotal >
      registration.event.capacity
    ) {
      const available =
        Math.max(
          registration.event.capacity -
          currentTotal,
          0
        );

      res.status(409).json({
        success: false,
        message:
          "Not enough capacity for these companions",

        data: {
          availableCompanionSlots:
            available
        }
      });

      return;
    }

    // Create companions

    const companions =
      cleanedNames.map(
        (name) =>
          companionRepository.create({
            registration,
            registrationId,
            name
          })
      );

    const savedCompanions =
      await companionRepository.save(
        companions
      );

    res.status(201).json({
      success: true,
      message:
        "Companions added successfully",

      data: savedCompanions.map(
        (companion) => ({
          id: companion.id,
          name: companion.name,
          registrationId:
            companion.registrationId
        })
      )
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to add companions"
    });
  }
}

export async function getRegistrationCompanions(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const registrationId =
      Number(req.params.registrationId);

    if (
      !Number.isInteger(registrationId) ||
      registrationId <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid registration ID"
      });

      return;
    }

    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    const companionRepository =
      AppDataSource.getRepository(
        Companion
      );

    const registration =
      await registrationRepository.findOne({
        where: {
          id: registrationId
        }
      });

    if (!registration) {
      res.status(404).json({
        success: false,
        message:
          "Registration not found"
      });

      return;
    }

    if (
      registration.studentId !==
      req.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message:
          "You can only view companions for your own registration"
      });

      return;
    }

    const companions =
      await companionRepository.find({
        where: {
          registrationId
        },
        order: {
          id: "ASC"
        }
      });

    res.json({
      success: true,

      data: companions.map(
        (companion) => ({
          id: companion.id,
          name: companion.name
        })
      )
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch companions"
    });
  }
}

export async function getEventRegistrations(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const eventId = Number(req.params.eventId);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID"
      });

      return;
    }

    const eventRepository =
      AppDataSource.getRepository(Event);

    const registrationRepository =
      AppDataSource.getRepository(Registration);

    // -------------------------
    // Find event
    // -------------------------

    const event = await eventRepository.findOne({
      where: {
        id: eventId
      }
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found"
      });

      return;
    }

    // -------------------------
    // Ownership check
    // -------------------------

    const isAdmin =
      req.user!.role === UserRole.ADMIN;

    const isOwner =
      event.organizerId === req.user!.userId;

    if (!isAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        message:
          "You can only view registrations for your own events"
      });

      return;
    }

    // -------------------------
    // Fetch registrations
    // -------------------------

    const registrations =
      await registrationRepository.find({
        where: {
          eventId
        },
        relations: {
          student: true
        },
        order: {
          registeredAt: "ASC"
        }
      });

    // -------------------------
    // Fetch companions
    // -------------------------

    const registrationIds =
      registrations.map(
        (registration) =>
          registration.id
      );

    let companions: Companion[] = [];

    if (registrationIds.length > 0) {
      const companionRepository =
        AppDataSource.getRepository(
          Companion
        );

      companions =
        await companionRepository
          .createQueryBuilder("companion")
          .where(
            "companion.registrationId IN (:...ids)",
            {
              ids: registrationIds
            }
          )
          .orderBy(
            "companion.id",
            "ASC"
          )
          .getMany();
    }

    // -------------------------
    // Build response
    // -------------------------

    const data =
      registrations.map(
        (registration) => {
          const registrationCompanions =
            companions.filter(
              (companion) =>
                companion.registrationId ===
                registration.id
            );

          return {
            id: registration.id,

            status:
              registration.status,

            attended:
              registration.attended,

            registeredAt:
              registration.registeredAt,

            student: {
              id:
                registration.student.id,

              name:
                registration.student.name,

              email:
                registration.student.email
            },

            companions:
              registrationCompanions.map(
                (companion) => ({
                  id: companion.id,
                  name: companion.name
                })
              )
          };
        }
      );

    // -------------------------
    // Statistics
    // -------------------------

    const confirmed =
      registrations.filter(
        (registration) =>
          registration.status ===
          RegistrationStatus.CONFIRMED
      );

    const attended =
      confirmed.filter(
        (registration) =>
          registration.attended
      );

    const companionCount =
      companions.filter(
        (companion) =>
          confirmed.some(
            (registration) =>
              registration.id ===
              companion.registrationId
          )
      ).length;

    res.json({
      success: true,

      data,

      summary: {
        totalRegistrations:
          registrations.length,

        confirmedRegistrations:
          confirmed.length,

        attendedStudents:
          attended.length,

        totalCompanions:
          companionCount,

        totalOccupiedSeats:
          confirmed.length +
          companionCount,

        availableSeats:
          Math.max(
            event.capacity -
            confirmed.length -
            companionCount,
            0
          ),

        capacity:
          event.capacity
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch event registrations"
    });
  }
}

export async function markAttendance(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const registrationId =
      Number(req.params.registrationId);

    if (
      !Number.isInteger(registrationId) ||
      registrationId <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid registration ID"
      });

      return;
    }

    const { attended } = req.body;

    if (typeof attended !== "boolean") {
      res.status(400).json({
        success: false,
        message:
          "Attended must be true or false"
      });

      return;
    }

    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    const registration =
      await registrationRepository.findOne({
        where: {
          id: registrationId
        },
        relations: {
          event: true
        }
      });

    if (!registration) {
      res.status(404).json({
        success: false,
        message:
          "Registration not found"
      });

      return;
    }

    // -------------------------
    // Only event owner/Admin
    // -------------------------

    const isAdmin =
      req.user!.role === UserRole.ADMIN;

    const isOwner =
      registration.event.organizerId ===
      req.user!.userId;

    if (!isAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        message:
          "You can only manage attendance for your own events"
      });

      return;
    }

    // -------------------------
    // Cancelled registration
    // -------------------------

    if (
      registration.status !==
      RegistrationStatus.CONFIRMED
    ) {
      res.status(400).json({
        success: false,
        message:
          "Cancelled registrations cannot be marked as attended"
      });

      return;
    }

    // Event timing

    const now = new Date();

    if (
      attended &&
      now < registration.event.startDateTime
    ) {
      res.status(400).json({
        success: false,
        message:
          "Attendance cannot be marked before the event starts"
      });

      return;
    }

    registration.attended =
      attended;

    const updated =
      await registrationRepository.save(
        registration
      );

    res.json({
      success: true,

      message: attended
        ? "Attendance marked successfully"
        : "Attendance removed successfully",

      data: {
        registrationId:
          updated.id,

        attended:
          updated.attended
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to update attendance"
    });
  }
}