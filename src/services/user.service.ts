import { randomUUID } from "crypto";
import { supabase } from "src/supabase";


export const createAnonymousUser = async (
    name: string,
    lat: number,
    lng: number,
    main_sport_id: string
) => {
    const email = `anon-${randomUUID()}@playmap.local`;
    const password = randomUUID();

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { is_anonymous: true },
    });

    const user = data?.user;

    if (!user || error) return { error, user: null };

    const [upsertErr, sportErr] = await Promise.all([
        supabase.rpc("upsert_user", {
            _id: user.id,
            _email: email,
            _phone: null,
            _name: name,
            _lat: lat,
            _lng: lng,
            _is_anonymous: true,
        }),
        supabase.from("user_sports").insert([
            {
                user_id: user.id,
                sport_id: main_sport_id,
                is_main: true,
            },
        ]),
    ]);

    return { user, error: upsertErr.error || sportErr.error };
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

