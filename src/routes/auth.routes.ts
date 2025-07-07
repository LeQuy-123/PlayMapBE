import { Router } from "express";
import { refreshAnonToken } from "~controllers/auth.controller";

const authRoute = Router();

/**
 * @swagger
 * /auth/anon/refresh:
 *   post:
 *     summary: Refresh an expired anonymous access token using the refresh token in HTTP-only cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Missing or expired refresh token
 */
authRoute.post("/anon/refresh", refreshAnonToken);

export default authRoute;
