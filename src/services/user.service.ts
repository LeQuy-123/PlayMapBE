import { randomUUID } from "crypto";
import { supabase } from "src/supabase";

export const createAnonymousUser = async (
    name: string,
    lat: number,
    lng: number,
    main_sport_id?: string
): Promise<{
    user: (typeof user & { main_sport?: { id: string; name: string } }) | null;
    error: string | null;
}> => {
    const email = `anon-${randomUUID()}@playmap.local`;
    const password = randomUUID();

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { is_anonymous: true },
    });

    const user = data?.user;
    if (!user || error) {
        return { user: null, error: error?.message || "User creation failed" };
    }

    // Step 1: Upsert user info
    const { error: upsertError } = await supabase.rpc("upsert_user", {
        _id: user.id,
        _email: email,
        _phone: null,
        _name: name,
        _lat: lat,
        _lng: lng,
        _is_anonymous: true,
    });

    if (upsertError) {
        await supabase.auth.admin.deleteUser(user.id);
        return {
            user: null,
            error: upsertError.message || "User profile upsert failed",
        };
    }

    let main_sport: { id: string; name: string } | undefined = undefined;

    // Step 2: Insert and fetch main sport
    if (main_sport_id) {
        const { error: sportInsertError } = await supabase
            .from("user_sports")
            .insert([
                {
                    user_id: user.id,
                    sport_id: main_sport_id,
                    is_main: true,
                },
            ]);

        if (sportInsertError) {
            await supabase.auth.admin.deleteUser(user.id);
            return {
                user: null,
                error: sportInsertError.message || "Failed to add user sport",
            };
        }

        // Fetch sport name
        const { data: sportData, error: sportFetchError } = await supabase
            .from("sports")
            .select("id, name")
            .eq("id", main_sport_id)
            .single();

        if (!sportFetchError && sportData) {
            main_sport = {
                id: sportData.id,
                name: sportData.name,
            };
        }
    }

    return {
        user: {
            ...user,
            main_sport,
        },
        error: null,
    };
};


/**
 * Calls Supabase RPC 'upsert_user' to insert or update user location, phone, and anonymous flag
 */
export const updateUserLocation = async (
    user_id: string,
    lat: number,
    lng: number,
    phone: string = "",
    is_anonymous: boolean = true
) => {
    const { error } = await supabase.rpc("upsert_user", {
        _id: user_id,
        _phone: phone,
        _lat: lat,
        _lng: lng,
        _is_anonymous: is_anonymous,
    });

    return { success: !error, error };
};

export const fetchNearbyUsers = async (
    lat: number,
    lng: number,
    radius_km: number,
    current_user_id: string
) => {
    const { data, error } = await supabase.rpc("get_nearby_users", {
        _self_id: current_user_id,
        lat,
        lng,
        radius_km,
    });

    return { users: data, error };
};

export const fetchNearbyUsersCluster = async (
    lat: number,
    lng: number,
    radius_km: number,
    zoom_level: number,
    current_user_id: string
) => {
    const { data, error } = await supabase.rpc("get_user_clusters", {
        lat,
        lng,
        radius_km: radius_km || 5,
        zoom_level: zoom_level || 12,
        _self_id: current_user_id,
    });

    return { users: data, error };
};
