// types/express/index.d.ts
import { Request } from "express";

declare global {
    namespace Express {
        interface UserPayload {
            id: string;
            type: "anon" | "user";
            iat?: number;
            exp?: number;
        }

        interface Request {
            user?: UserPayload;
        }
    }
}
