"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Crown, EyeOff, MessageCircle, RotateCcw, ScanLine, Sparkles, Timer, Trophy, Users } from "lucide-react";
import type { PublicGame } from "@/lib/client-types";

export function Brand() {
  return (
    <a href="/" className="brand-lockup" aria-label="Icebreaker UNO home">
      <span className="brand-mark"><span>I</span><span>U</span></span>
      <span><strong>Icebreaker UNO</strong><small>private alliances</small></span>
    </a>
  );
}

export function GameHeader({ sessionId, label }: { sessionId: string; label: string }) {
  return (
    <header className="topbar">
      <Brand />
      <div className="session-pill"><span>{label}</span><strong>{sessionId}</strong></div>
    </header>
  );
}

function formatTime(total: number) {
  const safe = Math.max(0, total);
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

export function useRemaining(game: PublicGame | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);
  if (!game) return 0;
  if (game.session.status === "playing" && game.session.endsAt) {
    return Math.max(0, Math.ceil((game.session.endsAt - now) / 1000));
  }
  return game.session.pausedRemaining;
}

export function RulePanel({ game }: { game: PublicGame }) {
  const rule = game.session.currentRule;
  const [announcing, setAnnouncing] = useState(false);
  useEffect(() => {
    if (!rule) return;
    setAnnouncing(true);
    const timer = window.setTimeout(() => setAnnouncing(false), 1800);
    return () => window.clearTimeout(timer);
  }, [rule?.id]);

  const RuleIcon = rule?.category.toLowerCase().includes("cooperation")
    ? Users
    : rule?.category.toLowerCase().includes("information")
      ? EyeOff
      : rule?.category.toLowerCase().includes("communication")
        ? MessageCircle
        : ArrowLeftRight;
  return (
    <section className="rule-panel" aria-live="polite">
      {announcing && <div className="rule-burst" aria-hidden="true"><Sparkles /><span>New rule</span></div>}
      <div className="rule-panel-content" key={rule?.id ?? "classic"}>
        <div className="rule-topline">
          <div className="eyebrow"><ScanLine /> {rule ? "Active rule" : "Current play"}</div>
          {rule && <span className="rule-category"><RuleIcon /> {rule.category}</span>}
        </div>
        {rule ? (
          <>
            <h2>{rule.name}</h2>
            <p>{rule.short}</p>
            <div className="social-purpose"><Sparkles /><span>{rule.purpose}</span></div>
          </>
        ) : (
          <><h2>Classic UNO</h2><p>Next rule unlocks after round 3.</p></>
        )}
        <div className="rule-meta">
          <span>Round <strong>{game.session.currentRound}</strong></span>
          <span><ArrowLeftRight /> {game.session.direction === "clockwise" ? "Clockwise" : "Counter-clockwise"}</span>
        </div>
      </div>
    </section>
  );
}

export function LeaderStage({ game }: { game: PublicGame }) {
  const red = game.leaders.find((leader) => leader.team === "red");
  const blue = game.leaders.find((leader) => leader.team === "blue");
  return (
    <div className="leader-stage">
      <LeaderCard team="red" name={red?.name} cards={red?.cards} />
      <div className="versus"><span>VS</span><small>others stay private</small></div>
      <LeaderCard team="blue" name={blue?.name} cards={blue?.cards} />
    </div>
  );
}

function LeaderCard({ team, name, cards }: { team: "red" | "blue"; name?: string; cards?: number }) {
  return (
    <article className={`leader-card ${team}`}>
      <div className="leader-title"><Crown /><span>{team} leader</span></div>
      <h3>{name ?? "Hidden until start"}</h3>
      <div className="card-count"><strong key={cards ?? "hidden"}>{cards ?? "—"}</strong><span>cards</span></div>
    </article>
  );
}

export function StatusStrip({ game }: { game: PublicGame }) {
  const remaining = useRemaining(game);
  const statusText = useMemo(() => {
    if (game.session.status === "lobby") return `${game.session.joinedCount} / 5 players joined`;
    if (game.session.status === "paused") return "Game paused";
    if (game.session.status === "finished") return game.session.winner === "shared" ? "Shared victory" : `${game.session.winner?.toUpperCase()} wins`;
    return "Game in progress";
  }, [game]);
  return (
    <div className="status-strip">
      <div><span className={`status-dot ${game.session.status}`} /><strong>{statusText}</strong></div>
      <div className={`timer ${game.session.status === "playing" && remaining <= 60 ? "urgent" : ""}`}><Timer /><strong>{formatTime(remaining)}</strong></div>
      <div><EyeOff /><span>Leaders public · roles private</span></div>
    </div>
  );
}

export function VictoryCelebration({ game, playerTeam, compact = false }: { game: PublicGame; playerTeam?: "red" | "blue"; compact?: boolean }) {
  const winner = game.session.winner;
  if (!winner) return null;
  const shared = winner === "shared";
  const playerWon = playerTeam && winner === playerTeam;
  const winningLeader = winner !== "shared" ? game.leaders.find((leader) => leader.team === winner) : null;
  const title = shared ? "Shared victory!" : playerWon ? "Your alliance wins!" : `${winner.toUpperCase()} alliance wins!`;
  const detail = shared
    ? "The leaders finished within two cards of each other. Everyone shares the win."
    : winningLeader?.cards === 0
      ? playerWon ? "Your leader reached zero cards first." : `${winner.toUpperCase()} leader reached zero cards first. Thanks for playing together.`
      : playerWon ? "Your leader had fewer cards when time expired." : `${winner.toUpperCase()} leader had fewer cards when time expired. Thanks for playing together.`;
  return (
    <section className={`victory-celebration victory-${winner} ${compact ? "compact" : ""}`} role="status" aria-live="assertive">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ left: `${4 + ((index * 17) % 92)}%`, animationDelay: `${(index % 7) * -.16}s` }} />)}
      </div>
      <div className="victory-icon">{shared ? <Sparkles /> : <Trophy />}</div>
      <span className="victory-kicker">Finished</span>
      <h1>{title}</h1>
      <p>{detail}</p>
    </section>
  );
}

export function PublicMessageWall({ game }: { game: PublicGame }) {
  if (!game.postgame.publicMessages.length) return null;
  return (
    <section className="message-wall">
      <div className="panel-heading"><div><span className="eyebrow">Table traces</span><h2>Game notes</h2></div><span>{game.postgame.publicMessages.length}</span></div>
      <div className="message-grid">
        {game.postgame.publicMessages.map((item) => <blockquote key={item.id}><p>“{item.message}”</p><cite>— {item.senderName}</cite></blockquote>)}
      </div>
    </section>
  );
}

export function LoadingCard({ text = "Loading the table…" }: { text?: string }) {
  return <div className="loading-card"><span className="spinner" />{text}</div>;
}

export function ErrorCard({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="error-card"><strong>Something needs attention</strong><p>{message}</p>
      {retry && <button className="text-button" onClick={retry}><RotateCcw /> Try again</button>}
    </div>
  );
}
