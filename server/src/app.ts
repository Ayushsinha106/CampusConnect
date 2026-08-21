import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import organizerRequestRoutes from "./routes/organizerRequestRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

app.use(express.json());


app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "CampusConnect API is running"
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/organizer-requests",organizerRequestRoutes);


export default app;