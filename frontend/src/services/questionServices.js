import api from "./api";

// GET questions by lesson
export const getQuestionByLesson = (lessonId) =>
  api.get(`/questions/lesson/${lessonId}`);

// GET one question
export const getQuestionById = (id) =>
  api.get(`/questions/${id}`);

// CREATE
export const addQuestion = (data) =>
  api.post("/questions", data);

// UPDATE
export const updateQuestion = (id, data) =>
  api.put(`/questions/${id}`, data);

// DELETE
export const deleteQuestion = (id) =>
  api.delete(`/questions/${id}`);