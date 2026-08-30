import { deliverNotification } from "@/lib/notificationProvider";
import { getConvexServerClient, notificationsEnqueue, notificationsMarkResult } from "@/lib/convexServer";
import { HOST_AGENCY } from "@/lib/hostAgency";

export type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  contactPreference?: string;
  bestTime?: string;
  heardAbout?: string;
  marketingOptIn?: boolean;
  destination: string;
  dates?: string;
  travelers?: string;
  budget?: string;
  tripType?: string;
  notes?: string;
};

function advisorBody(lead: LeadPayload) {
  const rows: Array<[string, string | undefined]> = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Prefers", lead.contactPreference],
    ["Best time to reach", lead.bestTime],
    ["Heard about me via", lead.heardAbout],
    ["Marketing opt-in", lead.marketingOptIn ? "Yes" : undefined],
    ["Destination", lead.destination],
    ["Travel dates", lead.dates],
    ["Travelers", lead.travelers],
    ["Planning budget", lead.budget],
    ["Trip type", lead.tripType],
    ["Notes", lead.notes],
  ];
  const details = rows
    .filter(([, value]) => value && String(value).trim().length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  return `New trip request from the Waylume Travel website.\n\n${details}\n\nOpen the admin dashboard to research suppliers and reply:\nhttps://waylumetravel.com/admin\n`;
}

function travelerBody(lead: LeadPayload) {
  return `Hi ${lead.name},\n\nThanks for sending your trip details to Waylume Travel. We have your request for ${lead.destination} and a real advisor is reviewing it now.\n\nWhat happens next: we research current supplier availability and options that fit what you described, then follow up personally with recommendations. Availability, pricing, and booking terms are confirmed at the time of booking. Secure payment is completed through an approved Fora or supplier workflow.\n\nIf anything changes or you want to add details, just reply to this email.\n\n— Waylume Travel\n${HOST_AGENCY.disclosure}\n`;
}

/**
 * Sends the advisor alert and the traveler acknowledgement for a new lead, and
 * records both in the Convex notification queue so they appear in the admin
 * dashboard with their real delivery status.
 *
 * Never throws: a delivery problem must not fail the visitor's form submission.
 */
export async function notifyNewLead(lead: LeadPayload, relatedTravelRequestId?: string): Promise<void> {
  const advisorRecipient = process.env.WAYLUME_ADVISOR_EMAIL;

  const outbound: Array<{ recipient: string; subject: string; message: string }> = [];
  if (advisorRecipient) {
    outbound.push({
      recipient: advisorRecipient,
      subject: `New trip request: ${lead.destination} — ${lead.name}`,
      message: advisorBody(lead),
    });
  }
  outbound.push({
    recipient: lead.email,
    subject: "We received your Waylume Travel trip request",
    message: travelerBody(lead),
  });

  for (const item of outbound) {
    try {
      const result = await deliverNotification({ channel: "email", ...item });
      const adminSecret = process.env.WAYLUME_ADMIN_TOKEN;
      if (!adminSecret) continue;
      const client = getConvexServerClient();
      const id = await client.mutation(notificationsEnqueue, {
        adminSecret,
        channel: "email",
        recipient: item.recipient,
        subject: item.subject,
        message: item.message,
        relatedTravelRequestId,
      });
      await client.mutation(notificationsMarkResult, {
        adminSecret,
        id: String(id),
        status: result.ok ? "sent" : "failed",
        provider: result.provider,
        providerMessageId: result.id,
        failureReason: result.error,
      });
    } catch {
      // Delivery and logging are best-effort; the lead is already stored.
    }
  }
}
