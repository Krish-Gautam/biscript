import { supabase } from "../utils/supabaseClient";

export const getBadges = async () => {
    const { data, error } = await supabase
        .from("badges")
        .select("*");


    if (error) {
        console.error("Error fetching badges:", error);
    }
    return { data, error };
};