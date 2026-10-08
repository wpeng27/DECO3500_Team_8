import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  hostKey: text("host_key").notNull(),
  assignmentMode: text("assignment_mode").notNull().default("random"),
  status: text("status").notNull().default("lobby"),
  direction: text("direction").notNull().default("clockwise"),
  currentRound: integer("current_round").notNull().default(0),
  currentRule: text("current_rule"),
  ruleHistory: text("rule_history").notNull().default("[]"),
  lastRuleChangeRound: integer("last_rule_change_round").notNull().default(0),
  durationSeconds: integer("duration_seconds").notNull().default(600),
  endsAt: integer("ends_at"),
  pausedRemaining: integer("paused_remaining").notNull().default(600),
  winner: text("winner"),
  createdAt: integer("created_at").notNull(),
});

export const players = sqliteTable("players", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  contactConsent: integer("contact_consent", { mode: "boolean" })
    .notNull()
    .default(false),
  token: text("token").notNull().unique(),
  team: text("team").notNull(),
  initialTeam: text("initial_team").notNull(),
  isLeader: integer("is_leader", { mode: "boolean" })
    .notNull()
    .default(false),
  leaderCards: integer("leader_cards").notNull().default(7),
  lastNotification: text("last_notification"),
  postGameStatus: text("post_game_status").notNull().default("undecided"),
  replayVote: integer("replay_vote", { mode: "boolean" }).notNull().default(false),
  joinedAt: integer("joined_at").notNull(),
}, (table) => [index("idx_players_session_id").on(table.sessionId)]);

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  playerId: text("player_id"),
  createdAt: integer("created_at").notNull(),
}, (table) => [index("idx_events_session_id").on(table.sessionId)]);

export const postgameMessages = sqliteTable("postgame_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sessionId: text("session_id").notNull(),
  senderId: text("sender_id").notNull(),
  recipientId: text("recipient_id"),
  message: text("message").notNull(),
  anonymous: integer("anonymous", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
}, (table) => [
  index("idx_postgame_messages_session_id").on(table.sessionId),
  index("idx_postgame_messages_recipient_id").on(table.recipientId),
]);
