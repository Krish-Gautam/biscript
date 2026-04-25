// controllers/challengeController.js
import * as Challenge from "../models/challengeModels.js";

// GET all challenges 
export const getChallenges = async (req, res) => {
  try {
    const { challengeType } = req.params; // 👈 FIX

    const challenges = await Challenge.getAllChallenges(challengeType);

    res.json(challenges);
  } catch (error) {
    console.error("❌ ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
// GET one challenge    
export const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.getChallengeById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET challenges for a specific user
export const getChallengeByUserID = async (req, res) => {
  try {
    const challenges = await Challenge.getChallengeByUserID(req.params.userId);

    res.json(challenges || []); // ✅ always return array
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
export const addChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.addChallenge({
      ...req.body,
      createdBy: req.user._id, // from auth middleware
    });

    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateChallenge = async (req, res) => {
  try {
    const updated = await Challenge.updateChallenge(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteChallenge = async (req, res) => {
  try {
    const deleted = await Challenge.deleteChallenge(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};