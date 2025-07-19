"use client"
import React from "react";
import { useEffect } from "react";
import { supabase } from "../utils/supabaseClient"

const InsertLesson = () => {

    useEffect(() => {

        const insertlesson = async () => {
            const lesson = {
                title: 'For Loops in Python',
                language: 'python',
                description: 'This lesson teaches you how to use for loops in Python...',
                difficulty: 'Medium'
            }

            const { data: user } = await supabase.auth.getUser();
            console.log("user", user);

            const { data: lessonData, error: lessonError } = await supabase.from('lessons').insert([lesson]).select('*')
            if (lessonError) {
                console.log(lessonError)
                return
            } else {
                console.log(lessonData)
            }

            const lessonId = lessonData[0].id

            const questions = [
                {
                    lesson_id: lessonId,
                    question_text: "What does range(3) return?",
                    correct_ans: "0, 1, 2",
                    difficulty: "easy"
                },
                {
                    lesson_id: lessonId,
                    question_text: "How do you loop through a list?",
                    correct_ans: "for item in list:",
                    difficulty: "medium"
                },
                {
                    lesson_id: lessonId,
                    question_text: "What keyword stops a loop early?",
                    correct_ans: "break",
                    difficulty: "easy"
                }
            ];

            const { data: questionData, error: questionError } = await supabase.from('questions').insert(questions)

            if (questionError) {
                console.log(questionError)
            } else {
                console.log("questions:", questionData)
            }
           }

        insertlesson()


    }, [])

    return <p>inserting lessons</p>
}

export default InsertLesson;