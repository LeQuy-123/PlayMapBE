import { Router } from "express";
import {
    createChallengeController,
    respondToChallengeController,
} from "~controllers/challenge.controller";

const challengeRoutes = Router();


/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Create a new challenge between users
 *     tags: [Challenges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [from_user_id, to_user_id, sport_id]
 *             properties:
 *               from_user_id:
 *                 type: string
 *               to_user_id:
 *                 type: string
 *               sport_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Challenge created
 *       400:
 *         description: Invalid or missing data
 *       500:
 *         description: Supabase error
 */
challengeRoutes.post("/", createChallengeController);


/**
 * @swagger
 * /challenges/{id}/respond:
 *   post:
 *     summary: Respond to a challenge (accept or reject)
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Challenge updated
 *       500:
 *         description: Server or Supabase error
 */
challengeRoutes.post("/:id/respond", respondToChallengeController);

export default challengeRoutes;
