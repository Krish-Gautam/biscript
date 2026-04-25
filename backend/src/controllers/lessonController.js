// controllers/lessonController.js
import * as Lesson from "../models/lessonModels.js";

// GET all lessons by language
export const getLessonByLanguage = async (req, res) => {
  try {
    const { language } = req.params;

    const lessons = await Lesson.getLessonByLanguage(language);
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET one lesson
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.getLessonById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
export const addLesson = async (req, res) => {
  try {
    const lesson = await Lesson.addLesson({
      ...req.body,
      createdBy: req.user._id, // from auth middleware
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateLesson = async (req, res) => {
  try {
    const updated = await Lesson.updateLesson(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({ message: "Lesson updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteLesson = async (req, res) => {
  try {
    const deleted = await Lesson.deleteLesson(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};