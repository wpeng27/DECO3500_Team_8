import { NextResponse } from "next/server";
import { hostAction, hostSnapshot } from "@/lib/session-store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const state = await hostAction(id.toUpperCase(), String(body.hostKey ?? ""), String(body.action ?? ""), body.value);
    if (!state) throw new Error("Session not found.");
    return NextResponse.json(hostSnapshot(state));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Action failed." }, { status: 400 });
  }
}
