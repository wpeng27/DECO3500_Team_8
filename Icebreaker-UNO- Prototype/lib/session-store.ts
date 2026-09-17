import { env } from "cloudflare:workers";
import { GAME_RULES, otherTeam, randomItem, type AssignmentMode, type Team } from "./game";

type SessionRow = {
  id: string; host_key: string; assignment_mode: AssignmentMode;
  status: "lobby" | "playing" | "paused" | "finished";
  direction: "clockwise" | "counterclockwise"; current_round: number;
  current_rule: string | null; rule_history: string; last_rule_change_round: number; duration_seconds: number;
  ends_at: number | null; paused_remaining: number;
  winner: "red" | "blue" | "shared" | null; created_at: number;
};

type PlayerRow = {
  id: string; session_id: string; name: string; email: string;
  contact_consent: number; token: string; team: Team; initial_team: Team; is_leader: number;
  leader_cards: number; last_notification: string | null; post_game_status: "undecided" | "stay" | "leave";
  replay_vote: number; joined_at: number;
};

type MessageRow = {
  id: number; session_id: string; sender_id: string; recipient_id: string | null;
  message: string; anonymous: number; created_at: number;
};

function db() {
  if (!env.DB) throw new Error("Game storage is unavailable.");
  return env.DB;
}

export async function getSession(id: string) {
  const session = await db().prepare("SELECT * FROM sessions WHERE id = ?").bind(id).first<SessionRow>();
  if (!session) return null;
  const result = await db().prepare("SELECT * FROM players WHERE session_id = ? ORDER BY joined_at ASC").bind(id).all<PlayerRow>();
  const players = result.results;
  const messageResult = await db().prepare("SELECT * FROM postgame_messages WHERE session_id = ? ORDER BY created_at ASC").bind(id).all<MessageRow>();
  const messages = messageResult.results;

  if (session.status === "playing" && session.ends_at && session.ends_at <= Date.now()) {
    const red = players.find((player) => player.is_leader && player.team === "red");
    const blue = players.find((player) => player.is_leader && player.team === "blue");
    if (red && blue) {
      const difference = Math.abs(red.leader_cards - blue.leader_cards);
      const winner = difference < 3 ? "shared" : red.leader_cards < blue.leader_cards ? "red" : "blue";
      await db().prepare("UPDATE sessions SET status = 'finished', winner = ?, ends_at = NULL, paused_remaining = 0 WHERE id = ?").bind(winner, id).run();
      session.status = "finished";
      session.winner = winner;
      session.ends_at = null;
    }
  }
  return { session, players, messages };
}

export async function createSession(input: { assignmentMode: AssignmentMode; durationSeconds: number }) {
  const id = crypto.randomUUID().slice(0, 6).toUpperCase();
  const hostKey = crypto.randomUUID();
  const now = Date.now();
  await db().prepare(
    `INSERT INTO sessions
    (id, host_key, assignment_mode, status, direction, current_round, current_rule,
     rule_history, last_rule_change_round, duration_seconds, ends_at, paused_remaining, winner, created_at)
     VALUES (?, ?, ?, 'lobby', 'clockwise', 0, NULL, '[]', 0, ?, NULL, ?, NULL, ?)`,
  ).bind(id, hostKey, input.assignmentMode, input.durationSeconds, input.durationSeconds, now).run();
  return { id, hostKey };
}

export async function joinSession(input: {
  sessionId: string; name: string; email: string; contactConsent: boolean; preferredTeam?: Team;
}) {
  const state = await getSession(input.sessionId);
  if (!state) throw new Error("Session not found.");
  if (state.session.status !== "lobby") throw new Error("This game has already started.");
  if (state.players.length >= 5) throw new Error("This session already has five players.");
  if (state.players.some((player) => player.email === input.email)) throw new Error("This email has already joined.");

  const counts = state.players.reduce((value, player) => {
    value[player.team] += 1;
    return value;
  }, { red: 0, blue: 0 });
  let team: Team;
  if (state.session.assignment_mode === "choice" && input.preferredTeam) {
    team = counts[input.preferredTeam] < 3 ? input.preferredTeam : otherTeam(input.preferredTeam);
  } else if (counts.red === counts.blue) {
    team = Math.random() < 0.5 ? "red" : "blue";
  } else {
    team = counts.red < counts.blue ? "red" : "blue";
  }
  if (counts[team] >= 3) team = otherTeam(team);

  const id = crypto.randomUUID();
  const token = crypto.randomUUID();
  await db().prepare(
    `INSERT INTO players
    (id, session_id, name, email, contact_consent, token, team, initial_team, is_leader,
     leader_cards, last_notification, joined_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 7, ?, ?)`,
  ).bind(
    id, input.sessionId, input.name, input.email, input.contactConsent ? 1 : 0,
    token, team, team, `You joined the ${team.toUpperCase()} alliance. Keep this screen private.`, Date.now(),
  ).run();
  return { id, token, team };
}

async function logEvent(sessionId: string, type: string, message: string, playerId?: string) {
  await db().prepare(
    "INSERT INTO events (session_id, type, message, player_id, created_at) VALUES (?, ?, ?, ?, ?)",
  ).bind(sessionId, type, message, playerId ?? null, Date.now()).run();
}

export async function hostAction(sessionId: string, hostKey: string, action: string, value?: unknown) {
  const state = await getSession(sessionId);
  if (!state) throw new Error("Session not found.");
  if (state.session.host_key !== hostKey) throw new Error("Host access denied.");

  if (action === "start") {
    if (state.players.length !== 5) throw new Error("Five players are required before starting.");
    const red = state.players.filter((player) => player.team === "red");
    const blue = state.players.filter((player) => player.team === "blue");
    if (!red.length || !blue.length) throw new Error("Both alliances need at least one player.");
    const redLeader = randomItem(red);
    const blueLeader = randomItem(blue);
    await db().batch([
      db().prepare("UPDATE players SET is_leader = 0, leader_cards = 7 WHERE session_id = ?").bind(sessionId),
      db().prepare("UPDATE players SET is_leader = 1 WHERE id IN (?, ?)").bind(redLeader.id, blueLeader.id),
      db().prepare(
        "UPDATE sessions SET status = 'playing', ends_at = ?, paused_remaining = duration_seconds, winner = NULL WHERE id = ?",
      ).bind(Date.now() + state.session.duration_seconds * 1000, sessionId),
    ]);
    await logEvent(sessionId, "start", "The game started and both leaders were locked.");
  } else if (action === "toggle_pause") {
    if (state.session.status === "playing") {
      const remaining = Math.max(0, Math.ceil(((state.session.ends_at ?? Date.now()) - Date.now()) / 1000));
      await db().prepare("UPDATE sessions SET status = 'paused', paused_remaining = ?, ends_at = NULL WHERE id = ?")
        .bind(remaining, sessionId).run();
    } else if (state.session.status === "paused") {
      await db().prepare("UPDATE sessions SET status = 'playing', ends_at = ? WHERE id = ?")
        .bind(Date.now() + state.session.paused_remaining * 1000, sessionId).run();
    }
  } else if (action === "next_round") {
    if (state.session.status !== "playing") throw new Error("Start the game first.");
    await db().prepare("UPDATE sessions SET current_round = current_round + 1 WHERE id = ?").bind(sessionId).run();
  } else if (action === "toggle_direction") {
    const direction = state.session.direction === "clockwise" ? "counterclockwise" : "clockwise";
    await db().prepare("UPDATE sessions SET direction = ? WHERE id = ?").bind(direction, sessionId).run();
    await logEvent(sessionId, "direction", `Turn direction changed to ${direction}.`);
  } else if (action === "switch_rule") {
    if (
      state.session.current_round === 0 ||
      state.session.current_round % 3 !== 0 ||
      state.session.last_rule_change_round === state.session.current_round
    ) {
      throw new Error("Rules can change after every three completed rounds.");
    }
    const history = JSON.parse(state.session.rule_history || "[]") as string[];
    const available = GAME_RULES.filter((rule) => rule.id !== state.session.current_rule);
    const nextRule = randomItem(available);
    const nonLeaders = state.players.filter((player) => !player.is_leader);
    if (!nonLeaders.length) throw new Error("No eligible player can change alliance.");
    const switched = randomItem(nonLeaders);
    const nextTeam = otherTeam(switched.team);
    await db().batch([
      db().prepare("UPDATE players SET team = ?, last_notification = ? WHERE id = ?").bind(
        nextTeam,
        `Alliance update: you are now with the ${nextTeam.toUpperCase()} alliance. Your role remains private.`,
        switched.id,
      ),
      db().prepare("UPDATE sessions SET current_rule = ?, rule_history = ?, last_rule_change_round = current_round WHERE id = ?").bind(
        nextRule.id, JSON.stringify([...history, nextRule.id]), sessionId,
      ),
    ]);
    await logEvent(sessionId, "rule", `${nextRule.name} began. One hidden player changed alliance.`, switched.id);
  } else if (action === "leader_cards") {
    const payload = value as { team?: Team; delta?: number };
    if (!payload?.team || !Number.isFinite(payload.delta)) throw new Error("Invalid card update.");
    const leader = state.players.find((player) => player.is_leader && player.team === payload.team);
    if (!leader) throw new Error("Leader not found.");
    const cards = Math.max(0, Math.min(30, leader.leader_cards + Number(payload.delta)));
    await db().prepare("UPDATE players SET leader_cards = ? WHERE id = ?").bind(cards, leader.id).run();
    if (cards === 0) {
      const other = state.players.find((player) => player.is_leader && player.team !== payload.team);
      const winner = other?.leader_cards === 0 ? "shared" : payload.team;
      await db().prepare("UPDATE sessions SET status = 'finished', winner = ?, ends_at = NULL, paused_remaining = 0 WHERE id = ?")
        .bind(winner, sessionId).run();
    }
  } else if (action === "reset") {
    await db().batch([
      db().prepare("UPDATE players SET team = initial_team, is_leader = 0, leader_cards = 7, last_notification = NULL, post_game_status = 'undecided', replay_vote = 0 WHERE session_id = ?").bind(sessionId),
      db().prepare(
        "UPDATE sessions SET status = 'lobby', direction = 'clockwise', current_round = 0, current_rule = NULL, rule_history = '[]', last_rule_change_round = 0, ends_at = NULL, paused_remaining = duration_seconds, winner = NULL WHERE id = ?",
      ).bind(sessionId),
    ]);
  } else {
    throw new Error("Unknown host action.");
  }
  return getSession(sessionId);
}

export async function postgameAction(
  sessionId: string,
  token: string,
  action: string,
  value?: unknown,
) {
  const state = await getSession(sessionId);
  if (!state) throw new Error("Session not found.");
  if (state.session.status !== "finished") throw new Error("Post-game actions unlock when the game finishes.");
  const player = state.players.find((item) => item.token === token);
  if (!player) throw new Error("Player access denied.");

  if (action === "choose") {
    const status = value === "stay" ? "stay" : value === "leave" ? "leave" : null;
    if (!status) throw new Error("Choose stay or leave.");
    await db().prepare("UPDATE players SET post_game_status = ?, replay_vote = CASE WHEN ? = 'leave' THEN 0 ELSE replay_vote END WHERE id = ?")
      .bind(status, status, player.id).run();
  } else if (action === "replay_vote") {
    const enabled = Boolean(value);
    await db().prepare("UPDATE players SET post_game_status = 'stay', replay_vote = ? WHERE id = ?")
      .bind(enabled ? 1 : 0, player.id).run();
  } else if (action === "message") {
    const payload = value as { message?: unknown; recipientId?: unknown; anonymous?: unknown };
    const message = String(payload?.message ?? "").trim().slice(0, 300);
    if (message.length < 1) throw new Error("Write a message first.");
    const recipientId = payload?.recipientId ? String(payload.recipientId) : null;
    if (recipientId === player.id) throw new Error("Choose another player for a private message.");
    if (recipientId && !state.players.some((item) => item.id === recipientId)) throw new Error("Recipient not found.");
    await db().prepare(
      "INSERT INTO postgame_messages (session_id, sender_id, recipient_id, message, anonymous, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).bind(sessionId, player.id, recipientId, message, recipientId ? 0 : payload?.anonymous ? 1 : 0, Date.now()).run();
  } else {
    throw new Error("Unknown post-game action.");
  }
  return getSession(sessionId);
}

export function publicSnapshot(state: NonNullable<Awaited<ReturnType<typeof getSession>>>) {
  const rule = GAME_RULES.find((item) => item.id === state.session.current_rule) ?? null;
  return {
    session: {
      id: state.session.id, status: state.session.status, direction: state.session.direction,
      currentRound: state.session.current_round, currentRule: rule,
      durationSeconds: state.session.duration_seconds, endsAt: state.session.ends_at,
      pausedRemaining: state.session.paused_remaining, winner: state.session.winner,
      joinedCount: state.players.length,
      canChangeRule:
        state.session.current_round > 0 &&
        state.session.current_round % 3 === 0 &&
        state.session.last_rule_change_round !== state.session.current_round,
    },
    leaders: state.players.filter((player) => player.is_leader).map((player) => ({
      name: player.name, team: player.team, cards: player.leader_cards,
    })),
    postgame: {
      replayVotes: state.players.filter((player) => player.replay_vote).length,
      publicMessages: state.messages.filter((message) => !message.recipient_id).map((message) => ({
        id: message.id,
        senderName: message.anonymous
          ? "Anonymous player"
          : state.players.find((player) => player.id === message.sender_id)?.name ?? "Player",
        message: message.message,
        createdAt: message.created_at,
      })),
    },
  };
}

export function playerSnapshot(state: NonNullable<Awaited<ReturnType<typeof getSession>>>, token: string) {
  const player = state.players.find((item) => item.token === token);
  if (!player) return null;
  return {
    ...publicSnapshot(state),
    me: {
      id: player.id, name: player.name, team: player.team,
      isLeader: Boolean(player.is_leader), notification: player.last_notification,
      contactConsent: Boolean(player.contact_consent),
      postGameStatus: player.post_game_status,
      replayVote: Boolean(player.replay_vote),
    },
    postgame: {
      ...publicSnapshot(state).postgame,
      players: state.players.filter((item) => item.id !== player.id).map((item) => ({ id: item.id, name: item.name })),
      privateMessages: state.messages.filter((message) =>
        message.recipient_id && (message.sender_id === player.id || message.recipient_id === player.id)
      ).map((message) => ({
        id: message.id,
        senderId: message.sender_id,
        senderName: state.players.find((item) => item.id === message.sender_id)?.name ?? "Player",
        recipientId: message.recipient_id as string,
        recipientName: state.players.find((item) => item.id === message.recipient_id)?.name ?? "Player",
        message: message.message,
        createdAt: message.created_at,
      })),
    },
  };
}

export function hostSnapshot(state: NonNullable<Awaited<ReturnType<typeof getSession>>>) {
  return {
    ...publicSnapshot(state), assignmentMode: state.session.assignment_mode,
    players: state.players.map((player) => ({
      id: player.id, name: player.name, isLeader: Boolean(player.is_leader),
      contactConsent: Boolean(player.contact_consent),
      postGameStatus: player.post_game_status,
      replayVote: Boolean(player.replay_vote),
      contactEmail:
        state.session.status === "finished" && player.contact_consent ? player.email : null,
    })),
  };
}
