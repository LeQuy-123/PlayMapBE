import { type Request, type Response, type NextFunction } from "express";
import { verifyAnonAccessToken } from "~utils/jwt";

export function requireAnonAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const payload = verifyAnonAccessToken(token);
        if ((payload as any).type !== "anon")
            throw new Error("Invalid token type");
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
        return
    }
}
