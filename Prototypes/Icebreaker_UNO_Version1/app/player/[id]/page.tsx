"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { BellRing, Crown, EyeOff, LogOut, MessageCircle, MessagesSquare, RefreshCw, RotateCcw, Send, ShieldCheck, Users } from "lucide-react";
import { ErrorCard, GameHeader, LoadingCard, PublicMessageWall, RulePanel, StatusStrip, VictoryCelebration } from "@/components/game-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useGame } from "@/hooks/use-game";
import type { PlayerGame } from "@/lib/client-types";

export default function PlayerPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const sessionId = params.id.toUpperCase();
  const [storedToken, setStoredToken] = useState("");
  useEffect(() => setStoredToken(window.localStorage.getItem(`uno-alliance-${sessionId}`) ?? ""), [sessionId]);
  const token = search.get("token") ?? storedToken;
  const endpoint = token ? `/api/sessions/${sessionId}?token=${encodeURIComponent(token)}` : null;
  const { data: game, error, refresh } = useGame<PlayerGame>(endpoint);
  const [seenNotification, setSeenNotification] = useState("");

  const leader = useMemo(() => game?.leaders.find((item) => item.team === game.me.team), [game]);
  if (!token) return <main className="player-shell"><GameHeader sessionId={sessionId} label="Player" /><ErrorCard message="Private token missing. Enter the game code again." /></main>;
  if (error) return <main className="player-shell"><GameHeader sessionId={sessionId} label="Player" /><ErrorCard message={error} retry={refresh} /></main>;
  if (!game) return <main className="player-shell"><GameHeader sessionId={sessionId} label="Player" /><LoadingCard text="Revealing your alliance…" /></main>;

  const changed = Boolean(game.me.notification && game.me.notification !== seenNotification);
  const finished = game.session.status === "finished";
  return (
    <main className={`player-shell team-${game.me.team}`}>
      <GameHeader sessionId={sessionId} label="Player" />
      <StatusStrip game={game} />
      <VictoryCelebration game={game} playerTeam={game.me.team} />
      {changed && !finished && (
        <div className="private-alert" role="alert"><BellRing /><div><strong>Alliance update</strong><p>{game.me.notification}</p></div><button onClick={() => setSeenNotification(game.me.notification ?? "")}>Got it</button></div>
      )}
      <section className={`alliance-reveal ${game.me.team} ${finished ? "finished" : ""}`}>
        <div className="eyebrow"><EyeOff /> Private to this screen</div>
        <span className="alliance-label">Your alliance</span>
        <h1>{game.me.team}</h1>
        {game.me.isLeader ? <div className="leader-callout"><Crown /> Fixed leader</div> : <p>May switch when a new rule appears.</p>}
        <div className="my-leader"><ShieldCheck /><span><small>Leader</small><strong>{leader?.name ?? "Selected at game start"}</strong></span></div>
      </section>
      {finished ? (
        <PostGameHub game={game} sessionId={sessionId} token={token} refresh={refresh} />
      ) : (
        <>
          <RulePanel game={game} />
          <div className="player-actions"><Button variant="outline" onClick={refresh}><RefreshCw /> Refresh</Button><small><EyeOff /> Private screen</small></div>
        </>
      )}
    </main>
  );
}

function PostGameHub({ game, sessionId, token, refresh }: { game: PlayerGame; sessionId: string; token: string; refresh: () => Promise<void> }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [recipientId, setRecipientId] = useState(game.postgame.players[0]?.id ?? "");
  const [privateMessage, setPrivateMessage] = useState("");
  const [publicMessage, setPublicMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  async function act(action: string, value?: unknown) {
    setBusy(action); setError("");
    try {
      const response = await fetch(`/api/sessions/${sessionId}/postgame`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, value }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not save your choice.");
      await refresh();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your choice.");
      return false;
    } finally { setBusy(""); }
  }

  async function sendPrivate(event: FormEvent) {
    event.preventDefault();
    if (await act("message", { recipientId, message: privateMessage })) setPrivateMessage("");
  }

  async function sendPublic(event: FormEvent) {
    event.preventDefault();
    if (await act("message", { message: publicMessage, anonymous })) setPublicMessage("");
  }

  if (game.me.postGameStatus === "undecided") {
    return (
      <section className="postgame-choice">
        <span className="eyebrow">What next?</span><h2>Stay or leave?</h2>
        <p>Your choice is private.</p>
        {error && <p className="inline-error">{error}</p>}
        <div className="postgame-choice-grid">
          <button className="stay-choice" onClick={() => act("choose", "stay")} disabled={!!busy}><Users /><span><strong>Stay</strong><small>Replay · chat · comment</small></span></button>
          <button className="leave-choice" onClick={() => act("choose", "leave")} disabled={!!busy}><LogOut /><span><strong>Leave</strong><small>Optional final message</small></span></button>
        </div>
      </section>
    );
  }

  return (
    <section className="postgame-hub">
      <div className="postgame-head"><div><span className="eyebrow">After the game</span><h2>{game.me.postGameStatus === "stay" ? "Stay connected" : "Before you leave"}</h2></div><Button variant="ghost" onClick={() => act("choose", game.me.postGameStatus === "stay" ? "leave" : "stay")}>{game.me.postGameStatus === "stay" ? <LogOut /> : <Users />}{game.me.postGameStatus === "stay" ? "Leave" : "Stay"}</Button></div>
      {error && <p className="inline-error">{error}</p>}

      {game.me.postGameStatus === "stay" && (
        <div className="postgame-tools">
          <article className="postgame-tool replay-tool">
            <RotateCcw /><div><h3>Play again</h3><p>{game.postgame.replayVotes}/5 ready</p></div>
            <Button onClick={() => act("replay_vote", !game.me.replayVote)} disabled={!!busy}>{game.me.replayVote ? "Vote recorded" : "I’m in"}</Button>
          </article>
          <form className="postgame-tool chat-tool" onSubmit={sendPrivate}>
            <MessagesSquare /><div><h3>Private message</h3><p>Visible only to both of you.</p></div>
            <label><span>Send to</span><select value={recipientId} onChange={(event) => setRecipientId(event.target.value)}>{game.postgame.players.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}</select></label>
            <textarea value={privateMessage} onChange={(event) => setPrivateMessage(event.target.value)} maxLength={300} placeholder="Write a low-pressure follow-up…" required />
            <Button type="submit" disabled={!recipientId || !privateMessage.trim() || !!busy}><Send /> Send privately</Button>
          </form>
          {game.postgame.privateMessages.length > 0 && <div className="private-thread"><strong>Your private messages</strong>{game.postgame.privateMessages.map((message) => <p key={message.id}><span>{message.senderId === game.me.id ? `To ${message.recipientName}` : `From ${message.senderName}`}</span>{message.message}</p>)}</div>}
        </div>
      )}

      <form className="public-message-form" onSubmit={sendPublic}>
        <div><MessageCircle /><span><strong>{game.me.postGameStatus === "leave" ? "Final note" : "Game note"}</strong><small>Appears on the shared screen.</small></span></div>
        <textarea value={publicMessage} onChange={(event) => setPublicMessage(event.target.value)} maxLength={300} placeholder="What felt fun, helpful or worth changing?" required />
        <div className="message-form-actions"><label><Checkbox checked={anonymous} onCheckedChange={(value) => setAnonymous(Boolean(value))} /> Post anonymously</label><Button type="submit" disabled={!publicMessage.trim() || !!busy}><Send /> Post message</Button></div>
      </form>
      <PublicMessageWall game={game} />
      {game.me.postGameStatus === "leave" && <a className="leave-home" href="/"><LogOut /> Leave table</a>}
    </section>
  );
}
