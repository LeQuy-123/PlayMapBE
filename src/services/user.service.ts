import { randomUUID } from "crypto";
import { supabase } from "src/supabase";

export const createAnonymousUser = async (
    name: string,
    lat: number,
    lng: number
) => {
    const email = `anon-${randomUUID()}@playmap.local`;
    const password = randomUUID();

    // Step 1: Create the anonymous user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            is_anonymous: true,
            display_name: name,
        },
    });

    const user = data?.user;

    // Step 2: Insert user into 'users' table via RPC with location
    if (user?.id) {
        const { error: upsertError } = await supabase.rpc("upsert_user", {
            _id: user.id,
            _phone: "",
            _lat: lat,
            _lng: lng,
            _is_anonymous: true,
        });

        if (upsertError) {
            return { user, error: upsertError };
        }
    }

    return { user, error };
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
    radius_km: number
) => {
    const { data, error } = await supabase.rpc("get_nearby_users", {
        lat,
        lng,
        radius_km,
    });

    return { users: data, error };
};
