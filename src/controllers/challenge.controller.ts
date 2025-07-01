import { type Request, type Response } from "express";
import * as challengeService from "~services/challenge.service";

export const createChallengeController = async (
    req: Request,
    res: Response
) => {
    const { from_user_id, to_user_id, sport_id } = req.body;

    if (!from_user_id || !to_user_id || !sport_id) {
        res.status(400).json({ error: "Missing required fields" });
        return
    }

    const { challenge, error } = await challengeService.createChallenge(
        from_user_id,
        to_user_id,
        sport_id
    );
    res.status(error ? 500 : 200).json(error ? { error } : { challenge });
    return
};

export const respondToChallengeController = async (
    req: Request,
    res: Response
) => {
    const challenge_id = req.params.id;
    const { response } = req.body;

    if (!["accepted", "rejected"].includes(response)) {
        res.status(400).json({ error: "Invalid response value" });
        return
    }
    if (!challenge_id) {
        res.status(400).json({ error: "Missing challenge_id fields" });
        return;
    }
    const { challenge, error } = await challengeService.respondToChallenge(
        challenge_id,
        response as "accepted" | "rejected"
    );
    res.status(error ? 500 : 200).json(error ? { error } : { challenge });
    return
};
