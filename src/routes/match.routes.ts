import { Router } from "express";
import {
    getUserMatchesController,
    setMatchResultController,
} from "~controllers/match.controller";

const matchRoutes = Router();


/**
 * @swagger
 * /matches/user/{id}:
 *   get:
 *     summary: Get match history of a user
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matches with results
 *       500:
 *         description: Supabase error
 */
matchRoutes.get("/user/:id", getUserMatchesController);


/**
 * @swagger
 * /matches/{id}/result:
 *   post:
 *     summary: Set result of a match for a user
 *     tags: [Matches]
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
 *             required: [user_id, result]
 *             properties:
 *               user_id:
 *                 type: string
 *               result:
 *                 type: string
 *                 enum: [win, loss, draw]
 *     responses:
 *       200:
 *         description: Match result updated
 *       500:
 *         description: Supabase error
 */
matchRoutes.post("/:id/result", setMatchResultController);

export default matchRoutes;
