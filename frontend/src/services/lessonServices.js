// services/lessonService.js
import api from "./api";

// GET lesson by language
export const getLessonByLanguage = (language) =>
  api.get(`/lessons/language/${encodeURIComponent(language)}`);


// GET one
export const getLessonById = (id) =>
  api.get(`/lessons/${id}`);

// CREATE (admin)
export const addLesson = (data) =>
  api.post("/lessons", data);

// UPDATE (admin)
export const updateLesson = (id, data) =>
  api.put(`/lessons/${id}`, data);

// DELETE (admin)
export const deleteLesson = (id) =>
  api.delete(`/lessons/${id}`);