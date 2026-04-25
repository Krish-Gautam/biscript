
import { getDB } from "../config/mongodb.js";


/* ------------------------------- GET ALL ------------------------------- */
export async function getBadges() {
  try {
    const db = getDB();

    const badges = await db
      .collection("badges")
      .find({})
      .toArray();

    return badges;
  } catch (error) {
    console.error("Error fetching badges:", error);
    throw error;
  }
}