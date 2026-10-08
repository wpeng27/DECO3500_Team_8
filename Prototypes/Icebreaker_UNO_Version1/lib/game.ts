export type Team = "red" | "blue";
export type AssignmentMode = "random" | "choice";

export const GAME_RULES = [
  {
    id: "team-round",
    category: "Cooperation",
    name: "Team Round",
    short: "Get every hand below the target before time runs out.",
    purpose: "One table, one goal.",
  },
  {
    id: "shared-goal",
    category: "Cooperation",
    name: "Shared Goal",
    short: "Complete the table objective, then resume UNO.",
    purpose: "Coordinate as one group.",
  },
  {
    id: "save-player",
    category: "Cooperation",
    name: "Save Another Player",
    short: "Help one player avoid drawing cards.",
    purpose: "Make support visible.",
  },
  {
    id: "blind-hand",
    category: "Information dependency",
    name: "Blind Hand",
    short: "Face your cards outward. Let the table guide your move.",
    purpose: "Rely on the group.",
  },
  {
    id: "guide-player",
    category: "Information dependency",
    name: "Guide the Player",
    short: "Guide the player who has limited information.",
    purpose: "Explain, listen and decide together.",
  },
  {
    id: "silent-round",
    category: "Communication change",
    name: "Silent Round",
    short: "No talking. Use gestures and cards.",
    purpose: "Coordinate without conversation pressure.",
  },
  {
    id: "questions-only",
    category: "Communication change",
    name: "Questions Only",
    short: "Speak only in questions.",
    purpose: "Invite others into the turn.",
  },
  {
    id: "partner-decision",
    category: "Communication change",
    name: "Partner Decision",
    short: "Agree with a partner before either player takes a turn.",
    purpose: "Make one quick shared decision.",
  },
  {
    id: "gift",
    category: "Card exchange & interaction",
    name: "Gift",
    short: "Give one useful card to another player.",
    purpose: "Notice what someone else needs.",
  },
  {
    id: "swap",
    category: "Card exchange & interaction",
    name: "Swap",
    short: "Swap a card—or hands, when shown—with another player.",
    purpose: "Create a structured exchange.",
  },
  {
    id: "opposite-partner",
    category: "Card exchange & interaction",
    name: "Opposite Partner",
    short: "Work with the player opposite you until the rule ends.",
    purpose: "Connect beyond your alliance.",
  },
] as const;

export function otherTeam(team: Team): Team {
  return team === "red" ? "blue" : "red";
}

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function cleanEmail(value: unknown) {
  const email = String(value ?? "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
