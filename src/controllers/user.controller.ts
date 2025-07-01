import { randomUUIDv7 } from "bun";
import { type Request, type Response } from "express";
import { supabase } from "src/supabase";
import * as userService from "~services/user.service";

// POST /users/anonymous

export const registerAnonUser = async (req: Request, res: Response) => {
    const { name, latitude, longitude, main_sport_id } = req.body;

    if (!name || latitude == null || longitude == null) {
        res.status(400).json({
            error: "Missing required fields: name, latitude, longitude",
        });
        return
    }

    const result = await userService.createAnonymousUser(
        name,
        latitude,
        longitude,
        main_sport_id
    );

    if (result.error) {
        res.status(500).json({ error: result.error });
        return
    }
    res.status(200).json({
        user: {
            id: result.user?.id,
            name,
            is_anonymous: true,
            location: {
                lat: latitude,
                lng: longitude,
            },
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
    const { lat, lng, radius_km, current_user_id } = req.query;

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

export const getUserClusters = async (req: Request, res: Response) => {
    const { lat, lng, radius_km = 5, zoom_level = 12, self_id } = req.query;

    // Validation
    if (
        lat == null ||
        lng == null ||
        self_id == null ||
        isNaN(Number(lat)) ||
        isNaN(Number(lng)) ||
        isNaN(Number(radius_km)) ||
        isNaN(Number(zoom_level))
    ) {
        res.status(400).json({
            error: "Missing or invalid query params: lat, lng, zoom_level, self_id",
        });
        return;
    }

    const { data, error } = await supabase.rpc("get_user_clusters", {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        radius_km: parseFloat(radius_km as string),
        zoom_level: parseInt(zoom_level as string),
        _self_id: self_id as string,
    });

    if (error) {
        res.status(500).json({ error });
        return;
    }
    res.status(200).json({ clusters: data });
    return;
};
