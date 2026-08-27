import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getConvexServerClient, quoteTravelerRespond } from "@/lib/convexServer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.token || !body.quoteId || !["accepted", "declined"].includes(body.response)) {
      return NextResponse.json({ error: "Valid portal token, quote, and response are required" }, { status: 400 });
    }
    const token = String(body.token);
    if (token.length < 32) return NextResponse.json({ error: "Invalid access token" }, { status: 400 });
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const client = getConvexServerClient();
    const result = await client.mutation(quoteTravelerRespond, {
      tokenHash,
      quoteId: String(body.quoteId),
      response: body.response,
      message: body.message ? String(body.message).slice(0, 2000) : undefined,
    });
    return NextResponse.json(result, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to record quote response";
    return NextResponse.json({ error: message.includes("expired") ? "This quote or portal link has expired." : "Unable to record quote response." }, { status: 400 });
  }
}
