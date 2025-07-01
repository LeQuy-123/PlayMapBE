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
