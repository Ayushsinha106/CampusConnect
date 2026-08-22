import type {
  Response
} from "express";

import AppDataSource from "../config/database.js";

import {
  Event
} from "../entities/Event.js";

import {
  Review
} from "../entities/Review.js";

import {
  Registration,
  RegistrationStatus
} from "../entities/Registration.js";

import type {
  AuthenticatedRequest
} from "../middleware/authMiddleware.js";


export async function createReview(
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

    const {
      rating,
      comment
    } = req.body;

    const numericRating =
      Number(rating);

    // -------------------------
    // Validate rating
    // -------------------------

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      res.status(400).json({
        success: false,
        message:
          "Rating must be an integer between 1 and 5"
      });

      return;
    }

    // -------------------------
    // Repositories
    // -------------------------

    const eventRepository =
      AppDataSource.getRepository(Event);

    const registrationRepository =
      AppDataSource.getRepository(
        Registration
      );

    const reviewRepository =
      AppDataSource.getRepository(Review);

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
    // Event must be finished
    // -------------------------

    if (
      event.endDateTime > new Date()
    ) {
      res.status(400).json({
        success: false,
        message:
          "You can review an event only after it has ended"
      });

      return;
    }

    // -------------------------
    // Check registration
    // -------------------------

    const registration =
      await registrationRepository.findOne({
        where: {
          eventId,
          studentId:
            req.user!.userId
        }
      });

    if (!registration) {
      res.status(403).json({
        success: false,
        message:
          "You must be registered for this event to review it"
      });

      return;
    }

    // -------------------------
    // Check registration status
    // -------------------------

    if (
      registration.status !==
      RegistrationStatus.CONFIRMED
    ) {
      res.status(403).json({
        success: false,
        message:
          "Cancelled registrations cannot submit reviews"
      });

      return;
    }

    // -------------------------
    // Check attendance
    // -------------------------

    if (!registration.attended) {
      res.status(403).json({
        success: false,
        message:
          "You must attend the event before submitting a review"
      });

      return;
    }

    // -------------------------
    // Check existing review
    // -------------------------

    const existingReview =
      await reviewRepository.findOne({
        where: {
          eventId,
          studentId:
            req.user!.userId
        }
      });

    if (existingReview) {
      res.status(409).json({
        success: false,
        message:
          "You have already reviewed this event"
      });

      return;
    }

    // -------------------------
    // Create review
    // -------------------------

    const review =
      reviewRepository.create({
        event,
        eventId,

        studentId:
          req.user!.userId,

        rating:
          numericRating,

        comment:
          typeof comment === "string" &&
          comment.trim()
            ? comment.trim()
            : null
      });

    const savedReview =
      await reviewRepository.save(
        review
      );

    res.status(201).json({
      success: true,
      message:
        "Review submitted successfully",

      data: {
        id: savedReview.id,

        eventId:
          savedReview.eventId,

        rating:
          savedReview.rating,

        comment:
          savedReview.comment,

        createdAt:
          savedReview.createdAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to create review"
    });
  }
}

export async function getEventReviews(
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

    const reviewRepository =
      AppDataSource.getRepository(Review);

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

    const reviews =
      await reviewRepository.find({
        where: {
          eventId
        },
        relations: {
          student: true
        },
        order: {
          createdAt: "DESC"
        }
      });

    const data =
      reviews.map(
        (review) => ({
          id: review.id,

          rating:
            review.rating,

          comment:
            review.comment,

          createdAt:
            review.createdAt,

          student: {
            id:
              review.student.id,

            name:
              review.student.name
          }
        })
      );

    const totalReviews =
      reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / totalReviews;

    res.json({
      success: true,

      data,

      summary: {
        totalReviews,

        averageRating:
          Number(
            averageRating.toFixed(2)
          )
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch reviews"
    });
  }
}