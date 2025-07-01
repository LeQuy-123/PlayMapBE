import { type Request, type Response } from "express";
import * as matchService from "~services/match.service";

export const getUserMatchesController = async (req: Request, res: Response) => {
    const user_id = req.params.id;
    if (!user_id ) {
        res.status(400).json({ error: "Missing user_id" });
        return;
    }
    const { matches, error } = await matchService.getUserMatchHistory(user_id);
    res.status(error ? 500 : 200).json(error ? { error } : { matches });
    return
};

export const setMatchResultController = async (req: Request, res: Response) => {
    const match_id = req.params.id;
    const { user_id, result } = req.body;
    if (!match_id) {
        res.status(400).json({ error: "Missing match_id" });
        return;
    }
    const { success, error } = await matchService.setMatchResult(
        match_id,
        user_id,
        result
    );
    res.status(success ? 200 : 500).json(
        success ? { success: true } : { error }
    );
    return
};
