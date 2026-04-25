import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";

// CREATE
export async function addQuestion(data) {
  const db = getDB();
  const questions = db.collection("questions");

  if (!data.title || !data.lessonId) {
    throw new Error("Title and lessonId are required");
  }

  const question = {
    title: data.title,
    description: data.description || "",
    solution: data.solution || "",
    lessonId: new ObjectId(data.lessonId),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await questions.insertOne(question);

  return { ...question, _id: result.insertedId };
}

// GET by lesson (FIXED NAME)
export async function getQuestionsByLesson(lessonId) {
  const db = getDB();

  return await db
    .collection("questions")
    .find({ lessonId: new ObjectId(lessonId) })
    .sort({ createdAt: -1 })
    .toArray();
}

// GET single
export async function getQuestionById(id) {
  const db = getDB();

  return await db.collection("questions").findOne({
    _id: new ObjectId(id),
  });
}

// UPDATE
export async function updateQuestion(id, data) {
  const db = getDB();

  const updateData = {
    ...data,
    updatedAt: new Date(),
  };

  // Prevent overriding ObjectId accidentally
  delete updateData._id;
  delete updateData.lessonId;

  const result = await db.collection("questions").updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  return result.modifiedCount > 0;
}

// DELETE
export async function deleteQuestion(id) {
  const db = getDB();

  const result = await db.collection("questions").deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount > 0;
}