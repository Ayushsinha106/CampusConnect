import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from "typeorm";

import {
  User
} from "./User.js";

import {
  Category
} from "./Category.js";

import {
  Venue
} from "./Venue.js";


@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({
    type: "varchar",
    length: 200
  })
  title!: string;

  @Column({
    type: "text"
  })
  description!: string;

  @Index()
  @Column({
    type: "timestamp"
  })
  startDateTime!: Date;

  @Column({
    type: "timestamp"
  })
  endDateTime!: Date;

  @Column({
    type: "int"
  })
  capacity!: number;

  @Column({
    type: "varchar",
    length: 500,
    nullable: true
  })
  imageUrl!: string | null;

  @Index()
  @Column({
    type: "boolean",
    default: false
  })
  isPublic!: boolean;


  // -------------------------
  // Organizer
  // -------------------------

  @ManyToOne(
    () => User,
    { nullable: false }
  )
  @JoinColumn({
    name: "organizerId"
  })
  organizer!: User;

  @Column({
    type: "int"
  })
  organizerId!: number;


  // -------------------------
  // Category
  // -------------------------

  @ManyToOne(
    () => Category,
    (category) => category.events,
    { nullable: false }
  )
  @JoinColumn({
    name: "categoryId"
  })
  category!: Category;

  @Index()
  @Column({
    type: "int"
  })
  categoryId!: number;


  // -------------------------
  // Venue
  // -------------------------

  @ManyToOne(
    () => Venue,
    (venue) => venue.events,
    { nullable: false }
  )
  @JoinColumn({
    name: "venueId"
  })
  venue!: Venue;

  @Column({
    type: "int"
  })
  venueId!: number;


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}