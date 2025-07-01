import { Router } from "express";
import {
    getSports,
    addSportToUser,
    addMainSportToUser,
} from "~controllers/sport.controller";

const sportRoutes = Router();

/**
 * @swagger
 * /sports:
 *   get:
 *     summary: Get all available sports
 *     tags: [Sports]
 *     responses:
 *       200:
 *         description: List of all sports
 *       500:
 *         description: Server error
 */
sportRoutes.get("/", getSports); // GET /sports


/**
 * @swagger
 * /sports/user:
 *   post:
 *     summary: Add a sport to a user (not as main sport)
 *     tags: [Sports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - sport_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9e38c91a-1223-42fd-8513-b8b2f0e53f5e"
 *               sport_id:
 *                 type: string
 *                 format: uuid
 *                 example: "b3e2f3a4-d3d6-4e6d-911b-9b0384a7111e"
 *     responses:
 *       200:
 *         description: Sport added to user
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Supabase or server error
 */
sportRoutes.post("/user", addSportToUser); // POST /sports/user

/**
 * @swagger
 * /sports/user/main:
 *   post:
 *     summary: Set the main sport for a user and return all sports
 *     tags: [Sports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - sport_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               sport_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Main sport updated and full list returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 sports:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sport_id:
 *                         type: string
 *                       is_main:
 *                         type: boolean
 *                       sports:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *       400:
 *         description: Missing user_id or sport_id
 *       500:
 *         description: Supabase error
 */
sportRoutes.post("/user/main", addMainSportToUser);
export default sportRoutes;
