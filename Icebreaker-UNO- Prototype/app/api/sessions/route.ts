import { NextResponse } from "next/server";
import { createSession } from "@/lib/session-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const assignmentMode = body.assignmentMode === "choice" ? "choice" : "random";
    const durationSeconds = Math.max(180, Math.min(1800, Number(body.durationSeconds) || 600));
    const session = await createSession({ assignmentMode, durationSeconds });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create session." }, { status: 400 });
  }
}
