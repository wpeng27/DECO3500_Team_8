import { NextResponse } from "next/server";
import { cleanEmail, type Team } from "@/lib/game";
import { joinSession } from "@/lib/session-store";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const name = String(body.name ?? "").trim().slice(0, 40);
    const email = cleanEmail(body.email);
    const preferredTeam: Team | undefined = body.preferredTeam === "red" || body.preferredTeam === "blue"
      ? body.preferredTeam
      : undefined;
    if (name.length < 2) throw new Error("Enter a display name with at least two characters.");
    if (!email) throw new Error("Enter a valid email address.");
    const player = await joinSession({
      sessionId: id.toUpperCase(), name, email,
      contactConsent: Boolean(body.contactConsent), preferredTeam,
    });
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not join session." }, { status: 400 });
  }
}
