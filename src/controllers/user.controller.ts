import { type Request, type Response } from "express";
import * as userService from "~services/user.service";

// POST /users/anonymous
export const registerAnonUser = async (req: Request, res: Response) => {
  const { name, latitude, longitude } = req.body;

  if (!name || latitude == null || longitude == null) {
    return res.status(400).json({
      error: "Missing required fields: name, latitude, longitude",
    });
  }

  const result = await userService.createAnonymousUser(
    name,
    latitude,
    longitude
  );

  res.status(result.error ? 500 : 200).json(result);
};

// POST /users/location
export const updateLocation = async (req: Request, res: Response) => {
  const { user_id, latitude, longitude } = req.body;

  if (!user_id || latitude == null || longitude == null) {
    return res.status(400).json({
      error: "Missing required fields: user_id, latitude, longitude",
    });
  }

  const result = await userService.updateUserLocation(
    user_id,
    latitude,
    longitude
  );

  res.status(result.error ? 500 : 200).json(result);
};

// GET /users/nearby?lat=...&lng=...&radius_km=...
export const getNearbyUsers = async (req: Request, res: Response) => {
  const { lat, lng, radius_km } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      error: "Missing required query params: lat, lng",
    });
  }

  const result = await userService.fetchNearbyUsers(
    parseFloat(lat as string),
    parseFloat(lng as string),
    parseFloat(radius_km as string) || 5
  );

  res.status(result.error ? 500 : 200).json(result);
};
