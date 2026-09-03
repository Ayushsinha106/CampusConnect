import type { Response } from "express";

import AppDataSource from "../config/database.js";

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



export async function createEvent(
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
      AppDataSource.getRepository(Event);

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

export async function getEvents(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    // Query parameters

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const categoryId =
      req.query.categoryId
        ? Number(req.query.categoryId)
        : undefined;

    const startDate =
      typeof req.query.startDate === "string"
        ? req.query.startDate
        : undefined;

    const endDate =
      typeof req.query.endDate === "string"
        ? req.query.endDate
        : undefined;

    const availableOnly =
      req.query.available === "true";

    const page =
      Math.max(
        Number(req.query.page) || 1,
        1
      );

    const limit =
      Math.min(
        Math.max(
          Number(req.query.limit) || 10,
          1
        ),
        50
      );

    const sortBy =
      typeof req.query.sortBy === "string"
        ? req.query.sortBy
        : "startDateTime";

    const sortOrder =
      req.query.sortOrder === "desc"
        ? "DESC"
        : "ASC";


    // Validate category

    if (
      categoryId !== undefined &&
      (!Number.isInteger(categoryId) ||
        categoryId <= 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID"
      });

      return;
    }


    // Validate sorting

    const allowedSortFields = [
      "title",
      "startDateTime",
      "createdAt",
      "capacity"
    ];

    const safeSortBy =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : "startDateTime";


    // Build query

    const eventRepository =
      AppDataSource.getRepository(Event);

    const query =
      eventRepository
        .createQueryBuilder("event")
        .leftJoinAndSelect(
          "event.category",
          "category"
        )
        .leftJoinAndSelect(
          "event.venue",
          "venue"
        )
        .leftJoinAndSelect(
          "event.organizer",
          "organizer"
        );


    // Keyword search

    if (search) {
      query.andWhere(
        `(
          event.title ILIKE :search
          OR event.description ILIKE :search
          OR category.name ILIKE :search
        )`,
        {
          search: `%${search}%`
        }
      );
    }


    // Category filter

    if (categoryId !== undefined) {
      query.andWhere(
        "event.categoryId = :categoryId",
        {
          categoryId
        }
      );
    }


    // Date filters

    if (startDate) {
      const start =
        new Date(startDate);

      if (Number.isNaN(start.getTime())) {
        res.status(400).json({
          success: false,
          message:
            "Invalid start date"
        });

        return;
      }

      query.andWhere(
        "event.startDateTime >= :startDate",
        {
          startDate: start
        }
      );
    }


    if (endDate) {
      const end =
        new Date(endDate);

      if (Number.isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message:
            "Invalid end date"
        });

        return;
      }

      query.andWhere(
        "event.startDateTime <= :endDate",
        {
          endDate: end
        }
      );
    }


    // Public visibility

    const isPublic =
      req.query.isPublic !== undefined
        ? req.query.isPublic === "true"
        : undefined;

    if (isPublic !== undefined) {
      query.andWhere(
        "event.isPublic = :isPublic",
        {
          isPublic
        }
      );
    }

    // Sorting

    query.orderBy(
      `event.${safeSortBy}`,
      sortOrder
    );


    // Pagination

    const skip =
      (page - 1) * limit;

    query.skip(skip);
    query.take(limit);


    // Fetch events

    const [
      events,
      total
    ] = await query.getManyAndCount();


    // Availability

    const registrationRepository =
      AppDataSource.getRepository(Registration);

    const companionRepository =
      AppDataSource.getRepository(Companion);


    let result = await Promise.all(
      events.map(async (event) => {

        // Get confirmed registrations
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

          // New fields
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
          },

          organizer: {
            id:
              event.organizer.id,

            name:
              event.organizer.name
          }
        };
      })
    );


    // Temporary availability calculation.
    // Registration counts will replace this
    // once we create the Registration entity.

    if (availableOnly) {
      result = result.filter(
        (event) => event.capacity > 0
      );
    }


    res.json({
      success: true,

      data: result,

      pagination: {
        page,
        limit,
        total,
        totalPages:
          Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch events"
    });
  }
}

export async function getEventById(
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
      AppDataSource.getRepository(Event);

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

export async function updateEvent(
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
      AppDataSource.getRepository(Event);

    const categoryRepository =
      AppDataSource.getRepository(Category);

    const venueRepository =
      AppDataSource.getRepository(Venue);

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

    // Ownership check

    const isAdmin =
      req.user!.role === UserRole.ADMIN;

    const isOwner =
      event.organizerId ===
      req.user!.userId;

    if (!isAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        message:
          "You can only modify your own events"
      });

      return;
    }

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

    // Update provided fields

    if (title !== undefined) {
      if (
        typeof title !== "string" ||
        !title.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "Title cannot be empty"
        });

        return;
      }

      event.title = title.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "Description cannot be empty"
        });

        return;
      }

      event.description =
        description.trim();
    }

    if (startDateTime !== undefined) {
      const start =
        new Date(startDateTime);

      if (Number.isNaN(start.getTime())) {
        res.status(400).json({
          success: false,
          message:
            "Invalid start date"
        });

        return;
      }

      event.startDateTime = start;
    }

    if (endDateTime !== undefined) {
      const end =
        new Date(endDateTime);

      if (Number.isNaN(end.getTime())) {
        res.status(400).json({
          success: false,
          message:
            "Invalid end date"
        });

        return;
      }

      event.endDateTime = end;
    }

    if (
      event.endDateTime <=
      event.startDateTime
    ) {
      res.status(400).json({
        success: false,
        message:
          "End time must be after start time"
      });

      return;
    }

    if (capacity !== undefined) {
      const newCapacity =
        Number(capacity);

      if (
        !Number.isInteger(newCapacity) ||
        newCapacity <= 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "Capacity must be a positive integer"
        });

        return;
      }

      event.capacity = newCapacity;
    }

    if (imageUrl !== undefined) {
      event.imageUrl =
        imageUrl || null;
    }

    if (isPublic !== undefined) {
      event.isPublic =
        Boolean(isPublic);
    }

    // Update category

    if (categoryId !== undefined) {
      const category =
        await categoryRepository.findOne({
          where: {
            id: Number(categoryId)
          }
        });

      if (!category) {
        res.status(404).json({
          success: false,
          message:
            "Category not found"
        });

        return;
      }

      event.category = category;
      event.categoryId = category.id;
    }

    // Update venue

    if (venueId !== undefined) {
      const venue =
        await venueRepository.findOne({
          where: {
            id: Number(venueId)
          }
        });

      if (!venue) {
        res.status(404).json({
          success: false,
          message:
            "Venue not found"
        });

        return;
      }

      if (
        venue.capacity !== null &&
        event.capacity > venue.capacity
      ) {
        res.status(400).json({
          success: false,
          message:
            "Event capacity cannot exceed venue capacity"
        });

        return;
      }

      event.venue = venue;
      event.venueId = venue.id;
    }

    // Final venue capacity check

    if (
      event.venueId
    ) {
      const venue =
        await venueRepository.findOne({
          where: {
            id: event.venueId
          }
        });

      if (
        venue &&
        venue.capacity !== null &&
        event.capacity > venue.capacity
      ) {
        res.status(400).json({
          success: false,
          message:
            "Event capacity cannot exceed venue capacity"
        });

        return;
      }
    }

    const updatedEvent =
      await eventRepository.save(event);

    res.json({
      success: true,
      message:
        "Event updated successfully",

      data: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        description:
          updatedEvent.description,

        startDateTime:
          updatedEvent.startDateTime,

        endDateTime:
          updatedEvent.endDateTime,

        capacity:
          updatedEvent.capacity,

        imageUrl:
          updatedEvent.imageUrl,

        isPublic:
          updatedEvent.isPublic,

        categoryId:
          updatedEvent.categoryId,

        venueId:
          updatedEvent.venueId,

        organizerId:
          updatedEvent.organizerId,

        updatedAt:
          updatedEvent.updatedAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to update event"
    });
  }
}

export async function deleteEvent(
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
      AppDataSource.getRepository(Event);

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

    // Ownership check

    const isAdmin =
      req.user!.role === UserRole.ADMIN;

    const isOwner =
      event.organizerId ===
      req.user!.userId;

    if (!isAdmin && !isOwner) {
      res.status(403).json({
        success: false,
        message:
          "You can only delete your own events"
      });

      return;
    }

    await eventRepository.remove(event);

    res.json({
      success: true,
      message:
        "Event deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to delete event"
    });
  }
}