// services/challengeService.js
import api from "./api";

// GET challenges
export const getChallenges = (challengeType) =>
  api.get(`/challenges/type/${challengeType}`);


// GET one
export const getChallengeById = (id) =>
  api.get(`/challenges/${id}`);


// CREATE (admin)
export const addChallenge = (data) =>
  api.post("/challenges", data);

// UPDATE (admin)
export const updateChallenge = (id, data) =>
  api.put(`/challenges/${id}`, data);

// DELETE (admin)
export const deleteChallenge = (id) =>
  api.delete(`/challenges/${id}`);

export const getChallengeByUserId = (userId) =>
  api.get(`/challenges/user/${userId}`);