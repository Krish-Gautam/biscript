// controllers/goblinLineController.js

import * as GoblinLine from "../models/goblinLineModels.js";
import { ObjectId } from "mongodb";

// GET goblin script by lesson
export const getGoblinScript = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }

    const script = await GoblinLine.getGoblinScript(lessonId);

    // Instead of throwing 404, return empty array
    if (!script) {
      return res.json([]); 
    }

    res.json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE / ADD (same as replace)
export const addGoblinScript = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }

    const script = await GoblinLine.addGoblinScript(lessonId, {
      ...req.body,
      createdBy: req.user?._id || null,
    });

    res.status(201).json(script);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateGoblinScript = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }

    const updated = await GoblinLine.updateGoblinScript(
      lessonId,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Goblin script not found" });
    }

    res.json({ message: "Goblin script updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteGoblinScript = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }

    const deleted = await GoblinLine.deleteGoblinScript(lessonId);

    if (!deleted) {
      return res.status(404).json({ message: "Goblin script not found" });
    }

    res.json({ message: "Goblin script deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};