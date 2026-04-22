// services/questionService.js
import api from "./api";

// GET question by lesson
export const getQuestionByLesson = (lessonId) =>
  api.get(`/questions/lesson/${lessonId}`);


// GET one
export const getQuestionById = (id) =>
  api.get(`/questions/${id}`);

// CREATE (admin)
export const createQuestion = (data) =>
  api.post("/questions", data);

// UPDATE (admin)
export const updateQuestion = (id, data) =>
  api.put(`/questions/${id}`, data);

// DELETE (admin)
export const deleteQuestion = (id) =>
  api.delete(`/questions/${id}`);