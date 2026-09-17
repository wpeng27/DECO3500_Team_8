import { NextResponse } from "next/server";
import { getSession, hostSnapshot, playerSnapshot, publicSnapshot } from "@/lib/session-store";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const state = await getSession(id.toUpperCase());
  if (!state) return NextResponse.json({ error: "Session not found." }, { status: 404 });

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const hostKey = url.searchParams.get("hostKey");
  if (hostKey && hostKey === state.session.host_key) return NextResponse.json(hostSnapshot(state));
  if (token) {
    const snapshot = playerSnapshot(state, token);
    return snapshot
      ? NextResponse.json(snapshot)
      : NextResponse.json({ error: "Player link is invalid." }, { status: 403 });
  }
  return NextResponse.json(publicSnapshot(state));
}
