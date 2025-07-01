import { randomUUID } from "crypto";
import { supabase } from "src/supabase";

export const createChallenge = async (
    from_user_id: string,
    to_user_id: string,
    sport_id: string
) => {
    // Ensure both users share that sport
    const { count } = await supabase
        .from("user_sports")
        .select("*", { count: "exact", head: true })
        .in("user_id", [from_user_id, to_user_id])
        .eq("sport_id", sport_id);

    if (count !== 2) {
        return {
            error: "Both users must have the same sport",
            challenge: null,
        };
    }

    const { data, error } = await supabase
        .from("challenges")
        .insert({
            id: randomUUID(),
            from_user_id,
            to_user_id,
            sport_id,
            status: "pending",
        })
        .select()
        .single();

    return { challenge: data, error };
};

export const respondToChallenge = async (
    challenge_id: string,
    response: "accepted" | "rejected"
) => {
    const { data: updated, error } = await supabase
        .from("challenges")
        .update({
            status: response,
            responded_at: new Date().toISOString(),
        })
        .eq("id", challenge_id)
        .select("*")
        .single();

    if (response === "accepted" && !error) {
        const match_id = randomUUID();
        await supabase.from("matches").insert({
            id: match_id,
            sport_id: updated.sport_id,
        });

        await supabase.from("match_participants").insert([
            { match_id, user_id: updated.from_user_id },
            { match_id, user_id: updated.to_user_id },
        ]);
    }

    return { challenge: updated, error };
};
