import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  Index,
  Check
} from "typeorm";

import { User } from "./User.js";
import { Event } from "./Event.js";

@Entity("reviews")
@Unique(["eventId", "studentId"])
@Check(`"rating" >= 1 AND "rating" <= 5`)
export class Review {
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
    type: "int"
  })
  rating!: number;

  @Column({
    type: "text",
    nullable: true
  })
  comment!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}