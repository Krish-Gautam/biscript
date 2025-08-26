import { supabase } from "../utils/supabaseClient";

const lessonsCache = new Map();

export const getLessons = async (language) => {
    if (!language) return [];
    if (lessonsCache.has(language)) {
        return lessonsCache.get(language);
    }
    const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('language', language);

    if (error) {
        console.log(error);
        return [];
    }

    lessonsCache.set(language, data);
    return data;
}