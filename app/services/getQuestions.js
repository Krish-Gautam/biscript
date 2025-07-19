import { supabase } from "../utils/supabaseClient";

export const getQuestion = async (lessonid) => {
    const {data, error} = await supabase.from('questions').select('*').eq('lesson_id', lessonid)

    if(error) {
        console.log(error)
        return []
    }

    return data
}