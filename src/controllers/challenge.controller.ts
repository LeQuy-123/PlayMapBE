import { type Request, type Response } from "express";
import * as challengeService from "~services/challenge.service";
export const createChallengeController = async (
    req: Request,
    res: Response
) => {
    const { to_user_id, sport_id } = req.body;
    const from_user_id = (req as any).user?.id;

    if (!from_user_id || !to_user_id || !sport_id) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }

    if (from_user_id === to_user_id) {
        res.status(400).json({ error: "Cannot challenge yourself" });
        return;
    }

    const result = await challengeService.createChallenge(
        from_user_id,
        to_user_id,
        sport_id
    );
    if (result.error) {
        res.status(500).json({ error: result.error });
        return;
    }
    res.status(200).json({ challenge: result.challenge });
    return
};

export const respondToChallengeController = async (
    req: Request,
    res: Response
) => {
    const challenge_id = req.params.id;
    const { response } = req.body;
    const user_id = (req as any).user?.id;

    if (!challenge_id || !response || !user_id) {
        res.status(400).json({ error: "Missing required fields" });
        return
    }

    const result = await challengeService.respondToChallenge(
        challenge_id,
        user_id,
        response
    );

    if (result.error === "Not your challenge") {
        res.status(403).json({ error: result.error });
        return
    }

    if (result.error) {
        res.status(500).json({ error: result.error });
        return
    }
    res.status(200).json({ message: "Challenge updated" });
    return
};
