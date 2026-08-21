import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";

import { User } from "./User.js";

export enum OrganizerRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

@Entity("organizer_requests")
export class OrganizerRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => User,
    { nullable: false }
  )
  @JoinColumn({
    name: "studentId"
  })
  student!: User;

  @Column({
    type: "int"
  })
  studentId!: number;

  @Column({
    type: "text"
  })
  reason!: string;

  @Column({
    type: "text",
    nullable: true
  })
  eventProposal!: string | null;

  @Column({
    type: "enum",
    enum: OrganizerRequestStatus,
    default: OrganizerRequestStatus.PENDING
  })
  status!: OrganizerRequestStatus;

  @CreateDateColumn()
  requestedAt!: Date;

  @Column({
    type: "timestamp",
    nullable: true
  })
  reviewedAt!: Date | null;

  @ManyToOne(
    () => User,
    { nullable: true }
  )
  @JoinColumn({
    name: "reviewedBy"
  })
  reviewer!: User | null;

  @Column({
    type: "int",
    nullable: true
  })
  reviewedBy!: number | null;
}