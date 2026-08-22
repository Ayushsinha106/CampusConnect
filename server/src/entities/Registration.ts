import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Index
} from "typeorm";

import { User } from "./User.js";
import { Event } from "./Event.js";

export enum RegistrationStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED"
}

@Entity("registrations")
@Unique(["eventId", "studentId"])
export class Registration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({
    type: "int"
  })
  eventId!: number;

  @ManyToOne(
    () => Event,
    { nullable: false }
  )
  @JoinColumn({
    name: "eventId"
  })
  event!: Event;

  @Index()
  @Column({
    type: "int"
  })
  studentId!: number;

  @ManyToOne(
    () => User,
    { nullable: false }
  )
  @JoinColumn({
    name: "studentId"
  })
  student!: User;

  @Column({
    type: "enum",
    enum: RegistrationStatus,
    default: RegistrationStatus.CONFIRMED
  })
  status!: RegistrationStatus;

  @Column({
    type: "boolean",
    default: false
  })
  attended!: boolean;

  @CreateDateColumn()
  registeredAt!: Date;
}