import jwt from "jsonwebtoken";

const {
    ANON_JWT_SECRET,
    ANON_REFRESH_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
} = process.env;

function getEnv(key: string, fallback: string): string {
    return process.env[key] || fallback;
}

export function generateAnonAccessToken(userId: string) {
    //@ts-ignore
    return jwt.sign(
        { id: userId, type: "anon" },
        getEnv("ANON_JWT_SECRET", "123"),
        { expiresIn: JWT_EXPIRES_IN || "1d" }
    );
}

export function generateAnonRefreshToken(userId: string) {
    //@ts-ignore
    return jwt.sign(
        { id: userId, type: "anon" },
        getEnv("ANON_REFRESH_SECRET", "456"),
        { expiresIn: JWT_REFRESH_EXPIRES_IN || "30d" }
    );
}

export function verifyAnonAccessToken(token: string) {
    return jwt.verify(token, ANON_JWT_SECRET!);
}

export function verifyAnonRefreshToken(token: string) {
    return jwt.verify(token, ANON_REFRESH_SECRET!);
}
