export const EVENT_TYPES = [
  "Wedding",
  "Engagement",
  "Anniversary",
  "Birthday",
  "Kids Birthday",
  "Baby Shower",
  "Birth Celebration",
  "Naming Ceremony",
  "Mundan",
  "Housewarming",
  "Retirement Party",
  "Graduation Party",
  "Corporate Event",
  "Other Celebration",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const COUPLE_EVENT_TYPES: EventType[] = [
  "Wedding",
  "Engagement",
  "Anniversary",
];

export const AGE_RELEVANT_EVENT_TYPES: EventType[] = [
  "Birthday",
  "Kids Birthday",
  "Birth Celebration",
  "Naming Ceremony",
  "Mundan",
  "Retirement Party",
];

