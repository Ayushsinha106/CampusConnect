import "reflect-metadata";
import "dotenv/config";

import AppDataSource from "../config/database.js";

import {
  Category
} from "../entities/Category.js";

import {
  Venue
} from "../entities/Venue.js";


async function seedEventData(): Promise<void> {
  try {
    await AppDataSource.initialize();

    const categoryRepository =
      AppDataSource.getRepository(Category);

    const venueRepository =
      AppDataSource.getRepository(Venue);



    // Categories


    const categories = [
      {
        name: "Workshop",
        description:
          "Hands-on learning and practical sessions"
      },

      {
        name: "Hackathon",
        description:
          "Competitive programming and project events"
      },

      {
        name: "Seminar",
        description:
          "Talks, lectures and knowledge-sharing sessions"
      },

      {
        name: "Cultural",
        description:
          "Cultural and artistic events"
      },

      {
        name: "Sports",
        description:
          "Sports and physical activities"
      }
    ];


    for (const categoryData of categories) {
      const existing =
        await categoryRepository.findOne({
          where: {
            name: categoryData.name
          }
        });

      if (!existing) {
        await categoryRepository.save(
          categoryRepository.create(
            categoryData
          )
        );
      }
    }



    // Venues


    const venues = [
      {
        name: "Main Auditorium",
        location: "Academic Block",
        capacity: 500
      },

      {
        name: "Seminar Hall 1",
        location: "Academic Block",
        capacity: 150
      },

      {
        name: "Seminar Hall 2",
        location: "Academic Block",
        capacity: 100
      },

      {
        name: "Open Air Theatre",
        location: "Central Campus",
        capacity: 300
      }
    ];


    for (const venueData of venues) {
      const existing =
        await venueRepository.findOne({
          where: {
            name: venueData.name
          }
        });

      if (!existing) {
        await venueRepository.save(
          venueRepository.create(
            venueData
          )
        );
      }
    }


    console.log(
      "Event seed data created successfully."
    );

    await AppDataSource.destroy();

  } catch (error) {
    console.error(
      "Failed to seed event data:",
      error
    );

    process.exit(1);
  }
}


seedEventData();