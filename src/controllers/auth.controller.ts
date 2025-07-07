import { type Request, type Response } from "express";
import { verifyAnonRefreshToken, generateAnonAccessToken } from "~utils/jwt";

export const refreshAnonToken = (req: Request, res: Response) => {
    const token = req.cookies.anon_refresh_token;

    if (!token) {
        res.status(401).json({ error: "NO_REFRESH_TOKEN" });
        return
    }

    try {
        const payload = verifyAnonRefreshToken(token) as any;

        if (payload.type !== "anon") throw new Error("Invalid type");

        const newAccessToken = generateAnonAccessToken(payload.id);
        res.status(200).json({ token: newAccessToken });
        return
    } catch {
        res.status(401).json({ error: "REFRESH_TOKEN_EXPIRED" });
        return
    }
};
