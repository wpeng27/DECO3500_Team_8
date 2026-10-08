import { NextResponse } from "next/server";
import { playerSnapshot, postgameAction } from "@/lib/session-store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const state = await postgameAction(
      id.toUpperCase(),
      String(body.token ?? ""),
      String(body.action ?? ""),
      body.value,
    );
    if (!state) throw new Error("Session not found.");
    const snapshot = playerSnapshot(state, String(body.token ?? ""));
    if (!snapshot) throw new Error("Player access denied.");
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Post-game action failed." }, { status: 400 });
  }
}
