import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index
} from "typeorm";

import {
  Registration
} from "./Registration.js";

@Entity("companions")
export class Companion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({
    type: "int"
  })
  registrationId!: number;

  @ManyToOne(
    () => Registration,
    { nullable: false }
  )
  @JoinColumn({
    name: "registrationId"
  })
  registration!: Registration;

  @Column({
    type: "varchar",
    length: 150
  })
  name!: string;
}