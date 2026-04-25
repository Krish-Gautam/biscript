import { getDB } from "../config/mongodb.js";

// UPSERT (insert if not exists, otherwise ignore/update safely)
export async function upsertUserChallenge(data) {
  const db = getDB();
  const collection = db.collection("user_challenges");

  const filter = {
    userId: data.userId,
    challengeId: data.challengeId,
  };

  const update = {
    $setOnInsert: {
      userId: data.userId,
      challengeId: data.challengeId,
      title: data.title,
      completedAt: data.completedAt || new Date(),
      language: data.language?.toLowerCase(),
      score: data.score ?? 0,
      createdAt: new Date(),
    },
    $set: {
      updatedAt: new Date(),
    },
  };

  const options = {
    upsert: true,
    returnDocument: "after", // returns updated/new doc
  };

  const result = await collection.findOneAndUpdate(
    filter,
    update,
    options
  );

  return result.value;
}