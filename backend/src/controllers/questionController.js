import * as Question from "../models/questionModels.js";
import { ObjectId } from "mongodb";

// GET questions by lesson
export const getQuestionsByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }

    const questions = await Question.getQuestionsByLesson(lessonId);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET one question
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const question = await Question.getQuestionById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
export const addQuestion = async (req, res) => {
  try {
    const { title, lessonId } = req.body;

    if (!title || !lessonId) {
      return res.status(400).json({
        message: "title and lessonId are required",
      });
    }

    if (!ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }

    const question = await Question.addQuestion({
      ...req.body,
      createdBy: req.user?._id || null,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const updated = await Question.updateQuestion(id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    const deleted = await Question.deleteQuestion(id);

    if (!deleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};