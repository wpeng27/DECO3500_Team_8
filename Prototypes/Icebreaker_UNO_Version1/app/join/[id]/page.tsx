"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, EyeOff, Mail, ShieldCheck } from "lucide-react";
import { GameHeader } from "@/components/game-ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function JoinPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id.toUpperCase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredTeam, setPreferredTeam] = useState<"red" | "blue">("red");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function join(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch(`/api/sessions/${sessionId}/join`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, preferredTeam, contactConsent: consent }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not join this table.");
      window.localStorage.setItem(`uno-alliance-${sessionId}`, body.token);
      window.location.href = `/player/${sessionId}?token=${encodeURIComponent(body.token)}`;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not join this table."); setBusy(false);
    }
  }

  return (
    <main className="join-shell">
      <GameHeader sessionId={sessionId} label="Private entry" />
      <div className="join-layout">
        <section className="join-intro">
          <span className="giant-number">05</span>
          <p className="eyebrow"><EyeOff /> Private player screen</p>
          <h1>Join the table.</h1>
          <p>Your alliance—and any switch—stays on this device.</p>
          <div className="privacy-note"><ShieldCheck /><span><strong>Private by design</strong><small>Email is used only if you consent to follow-up.</small></span></div>
        </section>
        <form className="join-form" onSubmit={join}>
          <div className="setup-heading"><span>Player details</span><strong><Mail /></strong></div>
          <label className="field-label" htmlFor="name">Display name</label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="What should the table call you?" autoComplete="name" required />
          <label className="field-label" htmlFor="email">Email</label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@uq.edu.au" autoComplete="email" required />
          <fieldset>
            <legend className="field-label">Preferred starting alliance</legend>
            <RadioGroup value={preferredTeam} onValueChange={(value) => setPreferredTeam(value as "red" | "blue")} className="team-choice">
              <label className={`team-choice-card red ${preferredTeam === "red" ? "selected" : ""}`}><RadioGroupItem value="red" /><strong>Red</strong><small>Starting preference</small></label>
              <label className={`team-choice-card blue ${preferredTeam === "blue" ? "selected" : ""}`}><RadioGroupItem value="blue" /><strong>Blue</strong><small>Starting preference</small></label>
            </RadioGroup>
            <p className="form-help">Random assignment ignores preferences. With player-selected teams, the third choice finalises the split.</p>
          </fieldset>
          <label className="consent-row"><Checkbox checked={consent} onCheckedChange={(value) => setConsent(Boolean(value))} /><span><strong>Allow follow-up contact</strong><small>The facilitator may use this email for group formation.</small></span></label>
          {error && <p className="inline-error">{error}</p>}
          <Button className="primary-action" type="submit" disabled={busy}>{busy ? "Joining…" : "Reveal my alliance"}<ArrowRight /></Button>
        </form>
      </div>
    </main>
  );
}
