// routes/users.ts
import { Router } from "express";
import { supabase } from "src/supabase";

const usersRouter = Router();

usersRouter.get("/", async (_, res) => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }
    res.json(data);
});

export default usersRouter;
