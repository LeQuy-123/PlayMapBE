import { supabase } from "src/supabase";

export const addSportToUser = async (user_id: string, sport_id: string) => {
    const { error } = await supabase.from("user_sports").insert({
        user_id,
        sport_id,
        is_main: false,
    });

    return { success: !error, error };
};

export const getAllSports = async () => {
    const { data, error } = await supabase.from("sports").select("*");
    return { sports: data, error };
};



export const addMainSportToUser = async (user_id: string, sport_id: string) => {
    // 1. Unset previous main sport (if any)
    const { error: clearError } = await supabase
        .from("user_sports")
        .update({ is_main: false })
        .eq("user_id", user_id)
        .eq("is_main", true);

    if (clearError) {
        return { success: false, error: clearError };
    }

    // 2. Upsert sport as main (insert or update existing row)
    const { error: upsertError } = await supabase.from("user_sports").upsert({
        user_id,
        sport_id,
        is_main: true,
    });

    if (upsertError) {
        return { success: false, error: upsertError };
    }

    // 3. Fetch and return full list of user sports with sport names
    const { data: sports, error: fetchError } = await supabase
        .from("user_sports")
        .select("sport_id, is_main, sports(name)")
        .eq("user_id", user_id);

    return {
        success: !fetchError,
        error: fetchError,
        sports,
    };
};
