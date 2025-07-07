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
    user_id: string, // authenticated user (should be `to_user_id`)
    response: "accepted" | "rejected"
) => {
    // 1. Fetch challenge and verify the user is the target
    const { data: challenge, error: fetchError } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challenge_id)
        .single();

    if (fetchError) {
        return { error: fetchError.message };
    }

    if (!challenge) {
        return { error: "Challenge not found" };
    }

    if (challenge.to_user_id !== user_id) {
        return { error: "Not your challenge" };
    }

    // 2. Update the challenge with the response
    const { data: updated, error: updateError } = await supabase
        .from("challenges")
        .update({
            status: response,
            responded_at: new Date().toISOString(),
        })
        .eq("id", challenge_id)
        .select("*")
        .single();

    if (updateError) {
        return { error: updateError.message };
    }

    // 3. If accepted, create a match
    if (response === "accepted") {
        const match_id = randomUUID();

        const { error: matchError } = await supabase.from("matches").insert({
            id: match_id,
            sport_id: updated.sport_id,
        });

        const { error: participantsError } = await supabase
            .from("match_participants")
            .insert([
                { match_id, user_id: updated.from_user_id },
                { match_id, user_id: updated.to_user_id },
            ]);

        if (matchError || participantsError) {
            return { error: matchError?.message || participantsError?.message };
        }
    }

    return { challenge: updated, error: null };
};
