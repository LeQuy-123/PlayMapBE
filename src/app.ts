import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "~routes/user.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "~config/swagger";
import sportRoutes from "~routes/sport.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/users", userRoutes);
app.use("/sports", sportRoutes);

export default app;
