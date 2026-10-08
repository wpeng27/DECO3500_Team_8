"use client";

import { useParams } from "next/navigation";
import { GameHeader, LeaderStage, LoadingCard, ErrorCard, PublicMessageWall, RulePanel, StatusStrip, VictoryCelebration } from "@/components/game-ui";
import { useGame } from "@/hooks/use-game";
import type { PublicGame } from "@/lib/client-types";

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const sessionId = params.id.toUpperCase();
  const { data: game, error, refresh } = useGame<PublicGame>(`/api/sessions/${sessionId}`);
  if (error) return <main className="board-shell"><GameHeader sessionId={sessionId} label="Public board" /><ErrorCard message={error} retry={refresh} /></main>;
  if (!game) return <main className="board-shell"><GameHeader sessionId={sessionId} label="Public board" /><LoadingCard /></main>;
  return (
    <main className={`board-shell ${game.session.winner ? `winner-${game.session.winner}` : ""}`}>
      <GameHeader sessionId={sessionId} label="Public board" />
      <StatusStrip game={game} />
      <VictoryCelebration game={game} />
      <LeaderStage game={game} />
      <RulePanel game={game} />
      <PublicMessageWall game={game} />
      <footer className="privacy-footer">Leaders public · Other alliances private</footer>
    </main>
  );
}
