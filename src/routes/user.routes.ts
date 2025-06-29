import { Router } from "express";
import {
  registerAnonUser,
  updateLocation,
  getNearbyUsers,
} from "~controllers/user.controller";

const router = Router();

router.post("/anonymous", registerAnonUser);
router.post("/location", updateLocation);
router.get("/nearby", getNearbyUsers);

export default router;
