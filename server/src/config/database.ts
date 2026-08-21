import "dotenv/config";

import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import { OrganizerRequest } from "../entities/OrganizerRequest.js";
import {
  Category
} from "../entities/Category.js";
import {
  Venue
} from "../entities/Venue.js";
import {
  Event
} from "../entities/Event.js";


const AppDataSource = new DataSource({
  type: "postgres",

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: true,

  logging: false,

  entities: [User, OrganizerRequest, Category, Venue, Event]
});

export default AppDataSource;

