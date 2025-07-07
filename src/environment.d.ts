declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPABASE_URL: string;
            SUPABASE_KEY: string;
            PORT?: string;

            ANON_JWT_SECRET: string;
            ANON_REFRESH_SECRET: string;
            JWT_EXPIRES_IN: string;
            JWT_REFRESH_EXPIRES_IN: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};

