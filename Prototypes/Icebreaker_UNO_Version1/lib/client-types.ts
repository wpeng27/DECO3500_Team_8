import type { Team } from "./game";

export type Rule = {
  id: string;
  category: string;
  name: string;
  short: string;
  purpose: string;
};
export type PublicGame = {
  session: {
    id: string;
    status: "lobby" | "playing" | "paused" | "finished";
    direction: "clockwise" | "counterclockwise";
    currentRound: number;
    currentRule: Rule | null;
    durationSeconds: number;
    endsAt: number | null;
    pausedRemaining: number;
    winner: Team | "shared" | null;
    joinedCount: number;
    canChangeRule: boolean;
  };
  leaders: { name: string; team: Team; cards: number }[];
  postgame: {
    replayVotes: number;
    publicMessages: { id: number; senderName: string; message: string; createdAt: number }[];
  };
};

export type PlayerGame = PublicGame & {
  me: {
    id: string;
    name: string;
    team: Team;
    isLeader: boolean;
    notification: string | null;
    contactConsent: boolean;
    postGameStatus: "undecided" | "stay" | "leave";
    replayVote: boolean;
  };
  postgame: PublicGame["postgame"] & {
    players: { id: string; name: string }[];
    privateMessages: { id: number; senderId: string; senderName: string; recipientId: string; recipientName: string; message: string; createdAt: number }[];
  };
};

export type HostGame = PublicGame & {
  assignmentMode: "random" | "choice";
  players: { id: string; name: string; isLeader: boolean; contactConsent: boolean; contactEmail: string | null; postGameStatus: "undecided" | "stay" | "leave"; replayVote: boolean }[];
};
