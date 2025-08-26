import { supabase } from "../utils/supabaseClient";

const questionsCache = new Map();

export const getQuestion = async (lessonid) => {
    if (!lessonid) return [];
    if (questionsCache.has(lessonid)) {
        return questionsCache.get(lessonid);
    }
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lessonid);

    if (error) {
        console.log(error);
        return [];
    }

    questionsCache.set(lessonid, data);
    return data;
}