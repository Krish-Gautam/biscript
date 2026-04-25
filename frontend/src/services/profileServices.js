// services/lessonService.js
import api from "./api";


// GET one
export const getProfile = (id) =>
  api.get(`/auth/profile/${id}`);

// UPDATE (admin)
export const updateProfile = (id, data) =>
  api.put(`/auth/profile/${id}`, data);
