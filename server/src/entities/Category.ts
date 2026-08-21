import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";

import { Event } from "./Event.js";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "varchar",
    length: 100,
    unique: true
  })
  name!: string;

  @Column({
    type: "text",
    nullable: true
  })
  description!: string | null;

  @OneToMany(
    () => Event,
    (event) => event.category
  )
  events!: Event[];
}