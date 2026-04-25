import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
import { v4 as uuidv4 } from "uuid";

/* ------------------------------- CREATE ------------------------------- */
export async function addChallenge(data) {
  const db = getDB();
  const challenges = db.collection("challenges");

  if (!data.title || !data.description) {
    throw new Error("Title and description are required");
  }

  const challenge = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    type: data.type || "solo",

    participants: Number(data.participants) || 1,
    category: data.category || "Easy",
    points: Number(data.points) || 0,
    active: data.active ?? false,

    solution: data.solution || "",
    timelimit: data.timelimit || "",
    hint: data.hint || "",
    bp_code: data.bp_code || "",
    function_name: data.function_name || "",
    skill_tested: data.skill_tested || "",

    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: data.completedAt ? new Date(data.completedAt) : null,
  };

  const result = await challenges.insertOne(challenge);
  return { ...challenge, _id: result.insertedId };
}
/* ------------------------------- GET ALL ------------------------------- */
export async function getAllChallenges(type) {
  const db = getDB();

  const filter = {
    active: true, // 👈 THIS is what you're missing
  };

  if (type) {
    filter.type = type;
  }

  return await db
    .collection("challenges")
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}
/* ------------------------------- GET BY ID ------------------------------- */
export async function getChallengeById(id) {
  const db = getDB();

  return await db.collection("challenges").findOne({
    _id: new ObjectId(id),
  });
}

export async function getChallengeByUserID(userId) {
  const db = getDB();

  return await db.collection("user_challenges").find({
    userId: userId
  }).toArray();
}

/* ------------------------------- UPDATE ------------------------------- */
export async function updateChallenge(id, data) {
  const db = getDB();

  const result = await db.collection("challenges").updateOne(
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

/* ------------------------------- DELETE ------------------------------- */
export async function deleteChallenge(id) {
  const db = getDB();

  const result = await db.collection("challenges").deleteOne({
    _id: new ObjectId(id),
  });

  return result.deletedCount > 0;
}