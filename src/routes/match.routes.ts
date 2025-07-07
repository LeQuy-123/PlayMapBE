import { Router } from "express";
import {
    getUserMatchesController,
    setMatchResultController,
} from "~controllers/match.controller";
import { requireAnonAuth } from "~middlewares/auth.middleware";

const matchRoutes = Router();


/**
 * @swagger
 * /users/match-history:
 *   get:
 *     summary: Get the match history of the current user (real or anonymous)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of match results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       match_id:
 *                         type: string
 *                       result:
 *                         type: string
 *                       matches:
 *                         type: object
 *                         properties:
 *                           sport_id:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

matchRoutes.get("/match-history", requireAnonAuth, getUserMatchesController);

/**
 * @swagger
 * /matches/{id}/result:
 *   post:
 *     summary: Set the result of a match (only allowed for participants)
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Match ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-e5f6-7890-1234-56789abcdef0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - result
 *             properties:
 *               result:
 *                 type: string
 *                 enum: [win, loss, draw]
 *                 example: win
 *     responses:
 *       200:
 *         description: Match result updated successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: User is not a participant of this match
 *       401:
 *         description: Unauthorized (no token)
 *       500:
 *         description: Supabase or server error
 */

matchRoutes.post("/:id/result", requireAnonAuth, setMatchResultController);

export default matchRoutes;
