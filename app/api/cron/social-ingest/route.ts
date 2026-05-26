import { NextResponse } from "next/server";
import { runSocialIngest } from "@/lib/ingest/social-pipeline";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getDatabaseUrl } = await import("@/lib/db");
  if (!getDatabaseUrl()) {
    return NextResponse.json({ error: "DATABASE_URL missing" }, { status: 500 });
  }

  try {
    const result = await runSocialIngest({ maxItems: 25 });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Social ingest failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
