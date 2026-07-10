import { CATEGORY_CARDS } from "@/constants/categories";

const HOME_CATEGORY_TITLES = new Set([
  "Wedding Planner",
  "Birthday Planner",
  "Kids Party Planner",
  "Event Planner",
  "Venue",
  "Photographer",
  "Decorator",
  "Caterer",
]);

export const categories = CATEGORY_CARDS.filter(
  ({ title }) => HOME_CATEGORY_TITLES.has(title)
);
