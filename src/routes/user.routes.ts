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
 *     summary: Update user location by user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - latitude
 *               - longitude
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Location updated
 *       400:
 *         description: Missing required fields
 */
userRouter.post("/location", updateLocation);

/**
 * @swagger
 * /users/nearby:
 *   get:
 *     summary: Get users near a given location, excluding the current user
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the current location
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the current location
 *       - in: query
 *         name: radius_km
 *         schema:
 *           type: number
 *           default: 5
 *         required: false
 *         description: Search radius in kilometers
 *       - in: query
 *         name: current_user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The UUID of the current user to exclude from results
 *     responses:
 *       200:
 *         description: List of nearby users (excluding self)
 *       400:
 *         description: Missing required query parameters
 */
userRouter.get("/nearby", getNearbyUsers);


/**
 * @swagger
 * /users/clusters:
 *   get:
 *     summary: Get clusters of nearby users based on map zoom level
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude of the current location
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude of the current location
 *       - in: query
 *         name: radius_km
 *         schema:
 *           type: number
 *           default: 5
 *         required: false
 *         description: Radius in kilometers to search for users
 *       - in: query
 *         name: zoom_level
 *         schema:
 *           type: integer
 *           default: 12
 *         required: false
 *         description: Current map zoom level for clustering
 *       - in: query
 *         name: self_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The UUID of the current user (to exclude from clusters)
 *     responses:
 *       200:
 *         description: List of clustered nearby users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clusters:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cluster_lat:
 *                         type: number
 *                       cluster_lng:
 *                         type: number
 *                       user_count:
 *                         type: integer
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Server error or Supabase RPC failure
 */
userRouter.get("/clusters", getUserClusters);


export default userRouter;
