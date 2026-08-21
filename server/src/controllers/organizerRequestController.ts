import type {
  Request,
  Response
} from "express";

import AppDataSource from "../config/database.js";

import {
  User,
  UserRole
} from "../entities/User.js";

import {
  OrganizerRequest,
  OrganizerRequestStatus
} from "../entities/OrganizerRequest.js";

import type {
  AuthenticatedRequest
} from "../middleware/authMiddleware.js";


export async function createOrganizerRequest(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { reason, eventProposal } =
      req.body;

    if (!reason) {
      res.status(400).json({
        success: false,
        message: "Reason is required"
      });

      return;
    }

    const userRepository =
      AppDataSource.getRepository(User);

    const requestRepository =
      AppDataSource.getRepository(
        OrganizerRequest
      );

    const user =
      await userRepository.findOne({
        where: {
          id: req.user!.userId
        }
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });

      return;
    }

    if (user.role !== UserRole.STUDENT) {
      res.status(403).json({
        success: false,
        message:
          "Only students can request organizer access"
      });

      return;
    }

    const existingRequest =
      await requestRepository.findOne({
        where: {
          studentId: user.id,
          status:
            OrganizerRequestStatus.PENDING
        }
      });

    if (existingRequest) {
      res.status(409).json({
        success: false,
        message:
          "You already have a pending organizer request"
      });

      return;
    }

    const request =
      requestRepository.create({
        student: user,
        studentId: user.id,
        reason,
        eventProposal:
          eventProposal || null,
        status:
          OrganizerRequestStatus.PENDING
      });

    const savedRequest =
      await requestRepository.save(request);

    res.status(201).json({
      success: true,
      message:
        "Organizer request submitted",
      data: {
        id: savedRequest.id,
        reason: savedRequest.reason,
        eventProposal:
          savedRequest.eventProposal,
        status: savedRequest.status,
        requestedAt:
          savedRequest.requestedAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to submit organizer request"
    });
  }
}


export async function getPendingOrganizerRequests(
  _req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const requestRepository =
      AppDataSource.getRepository(
        OrganizerRequest
      );

    const requests =
      await requestRepository.find({
        where: {
          status:
            OrganizerRequestStatus.PENDING
        },

        relations: {
          student: true
        },

        order: {
          requestedAt: "ASC"
        }
      });

    const data = requests.map((request) => ({
      id: request.id,

      student: {
        id: request.student.id,
        name: request.student.name,
        email: request.student.email
      },

      reason: request.reason,

      eventProposal:
        request.eventProposal,

      status: request.status,

      requestedAt:
        request.requestedAt
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
        "Failed to fetch organizer requests"
    });
  }
}


export async function approveOrganizerRequest(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const requestId =
      Number(req.params.id);

    if (Number.isNaN(requestId)) {
      res.status(400).json({
        success: false,
        message: "Invalid request ID"
      });

      return;
    }

    const requestRepository =
      AppDataSource.getRepository(
        OrganizerRequest
      );

    const userRepository =
      AppDataSource.getRepository(User);

    const request =
      await requestRepository.findOne({
        where: {
          id: requestId
        },

        relations: {
          student: true
        }
      });

    if (!request) {
      res.status(404).json({
        success: false,
        message:
          "Organizer request not found"
      });

      return;
    }

    if (
      request.status !==
      OrganizerRequestStatus.PENDING
    ) {
      res.status(400).json({
        success: false,
        message:
          "This request has already been reviewed"
      });

      return;
    }

    const student = request.student;

    if (
      student.role !== UserRole.STUDENT
    ) {
      res.status(400).json({
        success: false,
        message:
          "This user is no longer a student"
      });

      return;
    }

    // Promote student
    student.role = UserRole.ORGANIZER;

    await userRepository.save(student);

    // Update request
    request.status =
      OrganizerRequestStatus.APPROVED;

    request.reviewedAt = new Date();

    request.reviewedBy =
      req.user!.userId;

    await requestRepository.save(request);

    res.json({
      success: true,
      message:
        "Organizer request approved",
      data: {
        requestId: request.id,

        user: {
          id: student.id,
          name: student.name,
          email: student.email,
          role: student.role
        },

        status: request.status,

        reviewedAt:
          request.reviewedAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to approve organizer request"
    });
  }
}


export async function rejectOrganizerRequest(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const requestId =
      Number(req.params.id);

    if (Number.isNaN(requestId)) {
      res.status(400).json({
        success: false,
        message: "Invalid request ID"
      });

      return;
    }

    const requestRepository =
      AppDataSource.getRepository(
        OrganizerRequest
      );

    const request =
      await requestRepository.findOne({
        where: {
          id: requestId
        }
      });

    if (!request) {
      res.status(404).json({
        success: false,
        message:
          "Organizer request not found"
      });

      return;
    }

    if (
      request.status !==
      OrganizerRequestStatus.PENDING
    ) {
      res.status(400).json({
        success: false,
        message:
          "This request has already been reviewed"
      });

      return;
    }

    request.status =
      OrganizerRequestStatus.REJECTED;

    request.reviewedAt = new Date();

    request.reviewedBy =
      req.user!.userId;

    await requestRepository.save(request);

    res.json({
      success: true,
      message:
        "Organizer request rejected",

      data: {
        requestId: request.id,
        status: request.status,
        reviewedAt:
          request.reviewedAt
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to reject organizer request"
    });
  }
}

export async function revokeOrganizer(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId =
      Number(req.params.userId);

    if (Number.isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });

      return;
    }

    const userRepository =
      AppDataSource.getRepository(User);

    const user =
      await userRepository.findOne({
        where: {
          id: userId
        }
      });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });

      return;
    }

    if (user.role !== UserRole.ORGANIZER) {
      res.status(400).json({
        success: false,
        message:
          "This user is not currently an organizer"
      });

      return;
    }

    user.role = UserRole.STUDENT;

    await userRepository.save(user);

    res.json({
      success: true,
      message:
        "Organizer privileges revoked",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to revoke organizer privileges"
    });
  }
}