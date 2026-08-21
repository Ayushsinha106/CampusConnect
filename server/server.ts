import "reflect-metadata";
import "dotenv/config";

import app from "./src/app.js";
import AppDataSource from "./src/config/database.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer(): Promise<void> {
  try {
    await AppDataSource.initialize();

    console.log(
      "Database connection established successfully."
    );

    app.listen(PORT, () => {
      console.log(
        `CampusConnect server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Unable to connect to the database:"
    );

    console.error(error);
    process.exit(1);
  }
}

startServer();