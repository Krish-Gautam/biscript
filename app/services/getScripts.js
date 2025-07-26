import { supabase } from "../utils/supabaseClient";

export const getScripts = async (lessonid) => {
    const {data, error} = await supabase.from('scripts').select('*').eq('lesson_id', lessonid)

    if(error) {
        console.log(error)
        return []
    }

    return data
} 