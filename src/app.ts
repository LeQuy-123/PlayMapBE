import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "~routes/user.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "~config/swagger";
import sportRoutes from "~routes/sport.routes";
import challengeRoutes from "~routes/challenge.routes";
import matchRoutes from "~routes/match.routes";
import authRoute from "~routes/auth.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/users", userRoutes);
app.use("/auth", authRoute);
app.use("/sports", sportRoutes);
app.use("/challenges", challengeRoutes);
app.use("/matches", matchRoutes);
export default app;
