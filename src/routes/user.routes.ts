import { Router } from "express";
import {
    registerAnonUser,
    updateLocation,
    getNearbyUsers,
} from "~controllers/user.controller";

const userRouter = Router();

// POST /users/anonymous — create anonymous user with name & location
userRouter.post("/anonymous", registerAnonUser);

// POST /users/location — update user location by ID
userRouter.post("/location", updateLocation);

// GET /users/nearby?lat=...&lng=...&radius_km=...
userRouter.get("/nearby", getNearbyUsers);

export default userRouter;
