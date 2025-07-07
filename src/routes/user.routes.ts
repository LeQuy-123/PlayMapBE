import { Router } from "express";
import {
    registerAnonUser,
    updateLocation,
    getNearbyUsers,
    getUserClusters,
} from "~controllers/user.controller";

const userRouter = Router();
/**
 * @swagger
 * /users/anonymous:
 *   post:
 *     summary: Register an anonymous user with name, location, and optional main sport
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Player 1"
 *               latitude:
 *                 type: number
 *                 example: 10.762622
 *               longitude:
 *                 type: number
 *                 example: 106.660172
 *               main_sport_id:
 *                 type: string
 *                 format: uuid
 *                 example: "b3e2f3a4-d3d6-4e6d-911b-9b0384a7111e"
 *     responses:
 *       200:
 *         description: Anonymous user registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     is_anonymous:
 *                       type: boolean
 *                     token:
 *                       type: string
*                      refreshToken:
 *                       type: string
 *                     location:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                         lng:
 *                           type: number
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server or Supabase error
 */
userRouter.post("/anonymous", registerAnonUser);
/**
 * @swagger
 * /users/location:
 *   post:
 *     summary: Update a user's current location (anon or real)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, latitude, longitude]
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "aa82f60c-d25d-4b6e-bf7f-2642e03a2d87"
 *               latitude:
 *                 type: number
 *                 example: 10.763
 *               longitude:
 *                 type: number
 *                 example: 106.682
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
userRouter.post("/location", updateLocation);

/**
 * @swagger
 * /users/nearby:
 *   get:
 *     summary: Get a list of nearby users within a radius
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         example: 10.762622
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         example: 106.660172
 *       - in: query
 *         name: radius_km
 *         schema:
 *           type: number
 *         example: 5
 *       - in: query
 *         name: current_user_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "aa82f60c-d25d-4b6e-bf7f-2642e03a2d87"
 *     responses:
 *       200:
 *         description: List of nearby users
 *       400:
 *         description: Missing required query parameters
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/nearby", getNearbyUsers);

/**
 * @swagger
 * /users/clusters:
 *   get:
 *     summary: Get clustered user locations for map display
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         example: 10.762622
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         example: 106.660172
 *       - in: query
 *         name: radius_km
 *         schema:
 *           type: number
 *         example: 5
 *       - in: query
 *         name: zoom_level
 *         schema:
 *           type: number
 *         example: 12
 *       - in: query
 *         name: self_id
 *         required: true
 *         schema:
 *           type: string
 *         example: "aa82f60c-d25d-4b6e-bf7f-2642e03a2d87"
 *     responses:
 *       200:
 *         description: Clustered data returned
 *       400:
 *         description: Missing or invalid query params
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/clusters", getUserClusters);


export default userRouter;
