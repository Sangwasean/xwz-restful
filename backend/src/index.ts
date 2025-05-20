// index.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
import errorMiddleware from "./middlewares/error.middleware";
import { startScheduledJobs } from "./utils/scheduler";
import router from "./routers";
import SwaggerDocumentation from "./swagger/swagger.json"
import swaggerUi from "swagger-ui-express"

import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Middlewares
app.use(cors(
  {
    origin: ['http://localhost:5173'], // Add your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", router);

//Swagger

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerDocumentation))



// Error handling
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorMiddleware(err, req, res, next);
  }
);

// Database connection and server start
const PORT = process.env.PORT || 7654;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");

    // Start scheduled jobs
    startScheduledJobs();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error", error);
    process.exit(1);
  }
};
startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
