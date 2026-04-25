import api from "./api";

// GET goblin script by lesson
export const getGoblinScript = (lessonId) =>
  api.get(`/goblin/${lessonId}`);

// CREATE / ADD
export const addGoblinScript = (lessonId, data) =>
  api.post(`/goblin/${lessonId}`, data);

// UPDATE
export const updateGoblinScript = (lessonId, data) =>
  api.put(`/goblin/${lessonId}`, data);

// DELETE
export const deleteGoblinScript = (lessonId) =>
  api.delete(`/goblin/${lessonId}`);