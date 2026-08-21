import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";

import { Event } from "./Event.js";

@Entity("venues")
export class Venue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 150
  })
  name!: string;

  @Column({
    type: "varchar",
    length: 200
  })
  location!: string;

  @Column({
    type: "int",
    nullable: true
  })
  capacity!: number | null;

  @OneToMany(
    () => Event,
    (event) => event.venue
  )
  events!: Event[];
}