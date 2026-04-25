import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";

// ADD or REPLACE goblin script
export async function addGoblinScript(lessonId, data) {
  const db = getDB();

  const script = {
    title: data.title,
    plan: data.plan || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection("lessons").updateOne(
    { _id: new ObjectId(lessonId) },
    {
      $set: { goblin_scripts: script },
    }
  );

  return result.modifiedCount > 0 ? script : null;
}

export async function getGoblinScript(lessonId) {
  const db = getDB();

  const lesson = await db.collection("lessons").findOne(
    { _id: new ObjectId(lessonId) },
    { projection: { goblin_scripts: 1 } } // ✅ FIX
  );

  return lesson?.goblin_scripts || null; // ✅ FIX
}

export async function updateGoblinScript(lessonId, data) {
  const db = getDB();

  const result = await db.collection("lessons").updateOne(
    { _id: new ObjectId(lessonId) },
    {
      $set: {
        "goblin_scripts.title": data.title,
        "goblin_scripts.plan": data.plan,
        "goblin_scripts.updatedAt": new Date(),
      },
    }
  );

  return result.modifiedCount > 0;
}

export async function deleteGoblinScript(lessonId) {
  const db = getDB();

  const result = await db.collection("lessons").updateOne(
    { _id: new ObjectId(lessonId) },
    {
      $unset: { goblin_scripts: "" },
    }
  );

  return result.modifiedCount > 0;
}