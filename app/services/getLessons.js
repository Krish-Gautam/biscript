import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const getLessons = async (language) => {
    const {data, error} = await supabase.from('lessons').select('*').eq('language', language)

    if(error) {
        console.log(error)
        return []
    }

    return data
}