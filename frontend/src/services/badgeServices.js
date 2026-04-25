// services/badgeService.js
import api from "./api";

// GET badges
export const getBadges = () =>
  api.get("/badges");

