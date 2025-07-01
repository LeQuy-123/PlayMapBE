import { supabase } from "src/supabase";

export const getUserMatchHistory = async (user_id: string) => {
    const { data, error } = await supabase
        .from("match_participants")
        .select(
            `
        match_id,
        result,
        matches (
            sport_id,
            created_at
        )
        `
        )
        .eq("user_id", user_id);

    return { matches: data, error };
};

export const setMatchResult = async (
    match_id: string,
    user_id: string,
    result: "win" | "loss" | "draw"
) => {
    const { error } = await supabase
        .from("match_participants")
        .update({ result })
        .eq("match_id", match_id)
        .eq("user_id", user_id);

    return { success: !error, error };
};
