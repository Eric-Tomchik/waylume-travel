import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    web: true,
    convexConfigured: Boolean(process.env.CONVEX_SITE_URL),
    adminTokenConfigured: Boolean(process.env.WAYLUME_ADMIN_TOKEN),
    sessionSecretConfigured: Boolean(process.env.WAYLUME_ADMIN_SESSION_SECRET),
    intakeSecretConfigured: Boolean(process.env.WAYLUME_INTAKE_SECRET),
    emailProviderConfigured: Boolean(process.env.RESEND_API_KEY && process.env.WAYLUME_EMAIL_FROM),
    notificationWebhookConfigured: Boolean(process.env.WAYLUME_NOTIFICATION_WEBHOOK_URL),
    itineraryProviderConfigured: Boolean(process.env.WAYLUME_ITINERARY_DRAFT_WEBHOOK_URL),
  }, { headers: { "Cache-Control": "no-store" } });
}
