import { supabase } from "src/supabase";


export const getUserMatchHistory = async (user_id: string) => {
    if (!user_id) {
        return { matches: null, error: "Missing user_id" };
    }

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
        .eq("user_id", user_id)
        .order("matches.created_at", { ascending: false });

    return { matches: data, error };
};

export const setMatchResult = async (
    match_id: string,
    user_id: string,
    result: "win" | "loss" | "draw"
) => {
    if (!match_id || !user_id || !result) {
        return { success: false, error: "Missing input fields" };
    }

    // 1. Check participant exists
    const { data: participant, error: fetchError } = await supabase
        .from("match_participants")
        .select("id")
        .eq("match_id", match_id)
        .eq("user_id", user_id)
        .maybeSingle();

    if (fetchError) {
        return { success: false, error: fetchError.message };
    }

    if (!participant) {
        return {
            success: false,
            error: "User is not a participant of this match",
        };
    }

    // 2. Update result
    const { error: updateError } = await supabase
        .from("match_participants")
        .update({ result })
        .eq("match_id", match_id)
        .eq("user_id", user_id);

    return {
        success: !updateError,
        error: updateError ? updateError.message : null,
    };
};
