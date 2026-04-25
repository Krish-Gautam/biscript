import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";


// CREATE
export async function addLesson(data) {
  const db = getDB();
  const lessons = db.collection("lessons");

  const lesson = {
  title: data.title,
  description: data.description,
  content: data.content,
  difficulty: data.difficulty || "easy",
  language: data.language?.toLowerCase(), // 🔥 important
  createdBy: data.createdBy,
  createdAt: new Date(),
  updatedAt: new Date(),
};

  const result = await lessons.insertOne(lesson);

  return { ...lesson, _id: result.insertedId };
}

export async function getLessonByLanguage(language) {
  const db = getDB();
  return await db
    .collection("lessons")
    .find({ language })
    .sort({ createdAt: -1 })
    .toArray();
}


export async function getLessonById(id) {
  const db = getDB();

  return await db.collection("lessons").findOne({
    _id: new ObjectId(id),
  });
}

export async function updateLesson(id, data) {
  const db = getDB();

  const result = await db.collection("lessons").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

export async function deleteLesson(id) {
  const db = getDB();

  const result = await db.collection("lessons").deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount > 0;
}