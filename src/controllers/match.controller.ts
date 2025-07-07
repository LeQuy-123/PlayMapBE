import { type Request, type Response } from "express";
import * as matchService from "~services/match.service";

export const getUserMatchesController = async (req: Request, res: Response) => {
    const user = (req as any).user; // comes from JWT middleware
    if (!user?.id) {
        res.status(401).json({ error: "Unauthorized" });
        return
    }
    const { matches, error } = await matchService.getUserMatchHistory(user.id);
    if (error) {
        res.status(500).json({ error });
        return
    }
    res.status(200).json({ matches });
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
