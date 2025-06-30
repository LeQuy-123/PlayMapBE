import { randomUUIDv7 } from "bun";
import { type Request, type Response } from "express";
import { supabase } from "src/supabase";
import * as userService from "~services/user.service";

// POST /users/anonymous

export const registerAnonUser = async (req: Request, res: Response) => {
    const { name, latitude, longitude } = req.body;

    if (!name || latitude == null || longitude == null) {
        res.status(400).json({
            error: "Missing required fields: name, latitude, longitude",
        });
        return
    }

    const id = randomUUIDv7();

    const { error } = await supabase.rpc("upsert_user", {
        _id: id,
        _phone: "",
        _email: "",
        _name: name,
        _lat: latitude,
        _lng: longitude,
        _is_anonymous: true,
    });

    if (error) {
        res.status(500).json({ error });
        return
    }
    res.status(200).json({
        user: {
            id,
            name,
            location: {
                lat: latitude,
                lng: longitude,
            },
            is_anonymous: true,
        },
    });
    return
};
// POST /users/location
export const updateLocation = async (req: Request, res: Response) => {
    const { user_id, latitude, longitude } = req.body;

    if (!user_id || latitude == null || longitude == null) {
        res.status(400).json({
            error: "Missing required fields: user_id, latitude, longitude",
        });
        return;
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
    const { lat, lng, radius_km,  current_user_id } = req.query;

    if (!lat || !lng) {
        res.status(400).json({
            error: "Missing required query params: lat, lng",
        });
        return;
    }
    if (!current_user_id) {
        res.status(400).json({
            error: "Missing required query params: current_user_id",
        });
        return;
    }
    const result = await userService.fetchNearbyUsers(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseFloat(radius_km as string) || 5,
        String(current_user_id)
    );

    res.status(result.error ? 500 : 200).json(result);
};
