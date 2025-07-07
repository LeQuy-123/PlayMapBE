import { Router } from "express";
import {
    createChallengeController,
    respondToChallengeController,
} from "~controllers/challenge.controller";
import { requireAnonAuth } from "~middlewares/auth.middleware";

const challengeRoutes = Router();

/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Create a new challenge from the current user to another user
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to_user_id, sport_id]
 *             properties:
 *               to_user_id:
 *                 type: string
 *                 format: uuid
 *                 example: "e82c4371-bd91-4a8b-b3a1-df021f4d14cb"
 *               sport_id:
 *                 type: string
 *                 format: uuid
 *                 example: "a4c20393-09fb-45fc-822e-99f0196d7c7f"
 *     responses:
 *       200:
 *         description: Challenge created
 *       400:
 *         description: Invalid or missing data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Supabase or server error
 */
challengeRoutes.post("/", requireAnonAuth, createChallengeController);

/**
 * @swagger
 * /challenges/{id}/respond:
 *   post:
 *     summary: Respond to a challenge (accept or reject)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Challenge ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [response]
 *             properties:
 *               response:
 *                 type: string
 *                 enum: [accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Challenge updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not your challenge
 *       500:
 *         description: Supabase or server error
 */
challengeRoutes.post(
    "/:id/respond",
    requireAnonAuth,
    respondToChallengeController
);

export default challengeRoutes;
