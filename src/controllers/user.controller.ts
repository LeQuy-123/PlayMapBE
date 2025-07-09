import { randomUUIDv7 } from "bun";
import { type Request, type Response } from "express";
import { supabase } from "src/supabase";
import * as userService from "~services/user.service";
import { generateAnonAccessToken, generateAnonRefreshToken } from "~utils/jwt";

// POST /users/anonymous

export const registerAnonUser = async (req: Request, res: Response) => {
    const { name, latitude, longitude, main_sport_id } = req.body;

    if (!name || latitude == null || longitude == null) {
        res.status(400).json({
            error: "Missing required fields: name, latitude, longitude",
        });
        return;
    }

    const result = await userService.createAnonymousUser(
        name,
        latitude,
        longitude,
        main_sport_id
    );

    if (result.error) {
        res.status(500).json({ error: result.error });
        return;
    }

    const user = result.user;
    if (!user?.id) {
        res.status(500).json({ error: "Invalid user returned" });
        return;
    }

    const accessToken = generateAnonAccessToken(user.id);
    const refreshToken = generateAnonRefreshToken(user.id);

    res.cookie("anon_refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(200).json({
        user: {
            id: user.id,
            name,
            token: accessToken,
            refreshToken,
            is_anonymous: true,
            location: {
                lat: latitude,
                lng: longitude,
            },
            ...(user.main_sport && {
                mainSport: {
                    id: user.main_sport.id,
                    name: user.main_sport.name,
                },
            }),
        },
    });
    return;
};
// POST /users/location
export const updateLocation = async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;
    const userId = req.user?.id;

    if (!userId || latitude == null || longitude == null) {
        res.status(400).json({
            error: "Missing required fields: latitude, longitude",
        });
        return;
    }

    const result = await userService.updateUserLocation(
        userId,
        latitude,
        longitude
    );

    res.status(result.error ? 500 : 200).json(result);
};
// GET /users/nearby?lat=...&lng=...&radius_km=...
export const getNearbyUsers = async (req: Request, res: Response) => {
    const { lat, lng, radius_km = "5" } = req.query;
    const userId = req.user?.id;

    if (!lat || !lng) {
        res.status(400).json({
            error: "Missing required query params: lat, lng",
        });
        return;
    }

    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const result = await userService.fetchNearbyUsers(
        parseFloat(lat as string),
        parseFloat(lng as string),
        parseFloat(radius_km as string),
        String(userId)
    );

    res.status(result.error ? 500 : 200).json(result);
};
// GET /users/clusters?lat=...&lng=...&radius_km=...&zoom_level=...
export const getUserClusters = async (req: Request, res: Response) => {
    const { lat, lng, radius_km = "5", zoom_level = "12" } = req.query;
    const userId = req.user?.id;

    if (
        !lat ||
        !lng ||
        !userId ||
        isNaN(Number(lat)) ||
        isNaN(Number(lng)) ||
        isNaN(Number(radius_km)) ||
        isNaN(Number(zoom_level))
    ) {
        res.status(400).json({
            error: "Missing or invalid query params: lat, lng, radius_km, zoom_level",
        });
        return
    }

    const { data, error } = await supabase.rpc("get_user_clusters", {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        radius_km: parseFloat(radius_km as string),
        zoom_level: parseInt(zoom_level as string),
        _self_id: userId,
    });

    if (error) {
        res.status(500).json({ error });
        return
    }
    res.status(200).json({ clusters: data });
    return
};
export const updateLastActive = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { error } = await userService.updateLastActive(userId);

        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        res.status(200).json({ message: "Last active updated" });
        return;
    } catch (err: any) {
        res.status(500).json({ error: err.message });
        return;
    }
};
