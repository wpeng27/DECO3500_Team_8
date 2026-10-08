"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeftRight, CircleMinus, CirclePlus, Copy, ExternalLink, Hash, Pause, Play, RefreshCw, RotateCcw, Shuffle, Users } from "lucide-react";
import { ErrorCard, GameHeader, LeaderStage, LoadingCard, PublicMessageWall, RulePanel, StatusStrip, VictoryCelebration } from "@/components/game-ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGame } from "@/hooks/use-game";
import type { HostGame } from "@/lib/client-types";

export default function HostPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const sessionId = params.id.toUpperCase();
  const hostKey = search.get("key") ?? "";
  const endpoint = hostKey ? `/api/sessions/${sessionId}?hostKey=${encodeURIComponent(hostKey)}` : null;
  const { data: game, error, refresh } = useGame<HostGame>(endpoint);
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  useEffect(() => {
    const context = (document as Document & {
      modelContext?: {
        registerTool: (tool: {
          name: string; title: string; description: string;
          inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
          execute: () => Promise<unknown>;
        }, options: { signal: AbortSignal }) => void | Promise<void>;
      };
    }).modelContext;
    if (!context?.registerTool || !hostKey) return;
    const lifecycle = new AbortController();
    const run = async (action: string) => {
      const response = await fetch(`/api/sessions/${sessionId}/host`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostKey, action }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Action failed.");
      await refresh();
      return { sessionId, action, round: body.session.currentRound };
    };
    const tools = [
      { name: "complete_game_round", title: "Complete game round", description: "Mark the current physical UNO round as complete for this host session.", action: "next_round" },
      { name: "switch_random_game_rule", title: "Switch random rule", description: "After three completed rounds, activate a random dynamic rule and privately switch one eligible non-leader's alliance.", action: "switch_rule" },
    ];
    for (const tool of tools) {
      void Promise.resolve(context.registerTool({
        name: tool.name, title: tool.title, description: tool.description,
        inputSchema: { type: "object", properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: () => run(tool.action),
      }, { signal: lifecycle.signal })).catch(() => undefined);
    }
    return () => lifecycle.abort();
  }, [hostKey, refresh, sessionId]);

  async function act(action: string, value?: unknown) {
    setBusy(action); setActionError("");
    try {
      const response = await fetch(`/api/sessions/${sessionId}/host`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostKey, action, value }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Action failed.");
      await refresh();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Action failed.");
    } finally { setBusy(""); }
  }

  if (!hostKey) return <main className="page-shell"><GameHeader sessionId={sessionId} label="Host" /><ErrorCard message="This host link is missing its private key." /></main>;
  if (error) return <main className="page-shell"><GameHeader sessionId={sessionId} label="Host" /><ErrorCard message={error} retry={refresh} /></main>;
  if (!game) return <main className="page-shell"><GameHeader sessionId={sessionId} label="Host" /><LoadingCard /></main>;

  const joinUrl = origin;
  const boardUrl = `${origin}/board/${sessionId}`;
  const red = game.leaders.find((leader) => leader.team === "red");
  const blue = game.leaders.find((leader) => leader.team === "blue");

  return (
    <main className="page-shell">
      <GameHeader sessionId={sessionId} label="Host control" />
      <StatusStrip game={game} />
      <VictoryCelebration game={game} compact />
      <div className="host-grid">
        <section className="host-main">
          <LeaderStage game={game} />
          <RulePanel game={game} />
          <div className="control-panel">
            <div className="panel-heading"><div><span className="eyebrow">Table controls</span><h2>Game controls</h2></div><Badge variant="outline">{game.assignmentMode === "random" ? "Random assignment" : "Player-selected teams"}</Badge></div>
            {actionError && <p className="inline-error">{actionError}</p>}
            <div className="control-grid">
              {game.session.status === "lobby" ? (
                <Button className="control-primary" onClick={() => act("start")} disabled={game.players.length !== 5 || !!busy}><Play /> Start with 5 players</Button>
              ) : (
                <Button className="control-primary" onClick={() => act("toggle_pause")} disabled={game.session.status === "finished" || !!busy}>
                  {game.session.status === "paused" ? <Play /> : <Pause />} {game.session.status === "paused" ? "Resume timer" : "Pause timer"}
                </Button>
              )}
              <Button variant="outline" onClick={() => act("next_round")} disabled={game.session.status !== "playing" || !!busy}><RefreshCw /> Complete round</Button>
              <Button variant="outline" onClick={() => act("toggle_direction")} disabled={game.session.status === "lobby" || game.session.status === "finished" || !!busy}><ArrowLeftRight /> Reverse direction</Button>
              <Button className="rule-button" onClick={() => act("switch_rule")} disabled={!game.session.canChangeRule || game.session.status !== "playing" || !!busy}><Shuffle /> New rule + secret switch</Button>
            </div>
            <div className="control-hints"><span><RefreshCw /> Rules: rounds 3, 6, 9…</span><span><Shuffle /> One non-leader switches privately</span></div>
          </div>

          {game.session.status !== "lobby" && (
            <div className="score-controls">
              <h2>Leader cards</h2>
              <div className="score-logic"><span>0 cards = instant win</span><span>≤2-card gap at time = shared win</span></div>
              <div className="score-row">
                {[{ team: "red" as const, leader: red }, { team: "blue" as const, leader: blue }].map(({ team, leader }) => (
                  <div className={`score-control ${team}`} key={team}>
                    <span>{team} leader</span><strong>{leader?.cards ?? "—"}</strong>
                    <div><button disabled={game.session.status === "finished"} aria-label={`Remove a card from ${team} leader`} onClick={() => act("leader_cards", { team, delta: -1 })}><CircleMinus /></button><button disabled={game.session.status === "finished"} aria-label={`Add a card to ${team} leader`} onClick={() => act("leader_cards", { team, delta: 1 })}><CirclePlus /></button></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {game.session.status === "finished" && <PublicMessageWall game={game} />}
        </section>

        <aside className="host-aside">
          <section className="game-code-card">
            <div className="eyebrow"><Hash /> Player entry</div>
            <span className="game-code-label">Game code</span>
            <strong className="game-code-value">{sessionId}</strong>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(joinUrl)} disabled={!origin}><Copy /> Copy player website</Button>
          </section>
          <section className="player-list">
            <div className="player-list-head"><div><Users /><strong>Players</strong></div><span>{game.players.length}/5</span></div>
            {game.players.length ? game.players.map((player, index) => (
              <div className="player-row" key={player.id}><span>{index + 1}</span><strong>{player.name}</strong><div className="player-row-status">{player.isLeader ? <CrownBadge /> : game.session.status === "finished" ? <small>{player.postGameStatus === "undecided" ? "deciding" : player.postGameStatus}</small> : <small>role private</small>}{player.replayVote && <small className="replay-vote">replay ✓</small>}</div></div>
            )) : <p className="empty-copy">Waiting for players…</p>}
          </section>
          {game.session.status === "finished" && (
            <section className="player-list contact-list">
              <div className="player-list-head"><strong>Consented contacts</strong><span>{game.players.filter((player) => player.contactEmail).length}</span></div>
              {game.players.filter((player) => player.contactEmail).map((player) => (
                <div className="contact-row" key={player.id}><strong>{player.name}</strong><a href={`mailto:${player.contactEmail}`}>{player.contactEmail}</a></div>
              ))}
              {!game.players.some((player) => player.contactEmail) && <p className="empty-copy">No player opted into follow-up contact.</p>}
            </section>
          )}
          <a className="board-link" href={boardUrl} target="_blank" rel="noreferrer"><ExternalLink /> Public board</a>
          <Button variant="ghost" className="reset-button" onClick={() => act("reset")} disabled={!!busy}><RotateCcw /> {game.session.status === "finished" ? `Prepare rematch · ${game.postgame.replayVotes}/5 ready` : "Reset game state"}</Button>
        </aside>
      </div>
    </main>
  );
}

function CrownBadge() {
  return <Badge className="leader-badge">Leader</Badge>;
}
