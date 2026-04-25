import * as Badge from "../models/badgeModels.js";
// GET badges
export const getBadges = async (req, res) => {
  try {
    const badges = await Badge.getBadges();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

