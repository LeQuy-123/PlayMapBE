import { type Request, type Response } from "express";
import * as sportService from "~services/sport.service";

export const getSports = async (_req: Request, res: Response) => {
    const { sports, error } = await sportService.getAllSports();
    res.status(error ? 500 : 200).json(error ? { error } : { sports });
};

export const addSportToUser = async (req: Request, res: Response) => {
    const { user_id, sport_id } = req.body;

    if (!user_id || !sport_id) {
        res.status(400).json({ error: "Missing user_id or sport_id" });
        return
    }

    const { success, error } = await sportService.addSportToUser(
        user_id,
        sport_id
    );
    res.status(success ? 200 : 500).json(
        success ? { success: true } : { error }
    );
};
