"use client";

import { useState } from "react";
import { ArrowRight, Dices, Hash, ShieldCheck, Users } from "lucide-react";
import { Brand } from "@/components/game-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Home() {
  const [mode, setMode] = useState<"random" | "choice">("random");
  const [minutes, setMinutes] = useState(10);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createGame() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentMode: mode, durationSeconds: minutes * 60 }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create a session.");
      window.location.href = `/host/${data.id}?key=${encodeURIComponent(data.hostKey)}`;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create a session.");
      setBusy(false);
    }
  }

  function joinGame() {
    const session = code.trim().toUpperCase();
    if (session) window.location.href = `/join/${encodeURIComponent(session)}`;
  }

  return (
    <main className="home-shell">
      <header className="home-header"><Brand /><span className="prototype-badge">5 players</span></header>
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><Users /> Physical UNO · private alliances</p>
          <h1>Play together.<br/><em>Stay unpredictable.</em></h1>
          <p className="hero-lead">Leaders stay visible. Other alliances can shift.</p>
          <div className="principles">
            <span><ShieldCheck /> Private roles</span>
            <span><Dices /> Rule every 3 rounds</span>
            <span><Hash /> One game code</span>
          </div>
        </div>

        <div className="setup-card">
          <div className="setup-heading"><span>Host a table</span><strong>01</strong></div>
          <label className="field-label">Alliance setup</label>
          <RadioGroup value={mode} onValueChange={(value) => setMode(value as "random" | "choice")} className="mode-grid">
            <label className={`mode-option ${mode === "random" ? "selected" : ""}`}>
              <RadioGroupItem value="random" />
              <span><strong>Random assignment</strong><small>Randomly split into teams of 3 and 2</small></span>
            </label>
            <label className={`mode-option ${mode === "choice" ? "selected" : ""}`}>
              <RadioGroupItem value="choice" />
              <span><strong>Player-selected teams</strong><small>Players choose; the third choice finalises the split</small></span>
            </label>
          </RadioGroup>
          <label className="field-label">Game time</label>
          <div className="duration-row">
            {[8, 10, 12].map((value) => (
              <button type="button" key={value} onClick={() => setMinutes(value)} className={minutes === value ? "active" : ""}>{value} min</button>
            ))}
          </div>
          {error && <p className="inline-error">{error}</p>}
          <Button onClick={createGame} disabled={busy} className="primary-action">
            {busy ? "Creating…" : "Create game"}<ArrowRight />
          </Button>
        </div>
      </section>

      <section className="join-bar">
        <div><span className="join-number">02</span><div><strong>Join a table</strong><small>Enter the shared game code.</small></div></div>
        <div className="join-controls">
          <Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} onKeyDown={(event) => event.key === "Enter" && joinGame()} maxLength={6} placeholder="GAME CODE" aria-label="Game code" />
          <Button onClick={joinGame} disabled={!code.trim()} variant="outline">Join table <ArrowRight /></Button>
        </div>
      </section>
    </main>
  );
}
