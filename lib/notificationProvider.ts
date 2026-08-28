export type DeliverableNotification = {
  channel: "email" | "sms";
  recipient: string;
  subject?: string;
  message: string;
};

export type DeliveryResult = {
  ok: boolean;
  provider?: string;
  id?: string;
  error?: string;
};

async function sendWithResend(notification: DeliverableNotification): Promise<DeliveryResult | null> {
  if (notification.channel !== "email") return null;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WAYLUME_EMAIL_FROM;
  if (!apiKey || !from) return null;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to: [notification.recipient],
      subject: notification.subject || "Waylume Travel update",
      text: notification.message,
    }),
  });
  const data = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    provider: "resend",
    id: data.id ? String(data.id) : undefined,
    error: response.ok ? undefined : `Resend returned ${response.status}`,
  };
}

async function sendWithWebhook(notification: DeliverableNotification): Promise<DeliveryResult | null> {
  const url = process.env.WAYLUME_NOTIFICATION_WEBHOOK_URL;
  if (!url) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.WAYLUME_NOTIFICATION_WEBHOOK_SECRET
        ? { Authorization: `Bearer ${process.env.WAYLUME_NOTIFICATION_WEBHOOK_SECRET}` }
        : {}),
    },
    body: JSON.stringify(notification),
  });
  const data = await response.json().catch(() => ({}));
  return {
    ok: response.ok,
    provider: "webhook",
    id: data.id ? String(data.id) : undefined,
    error: response.ok ? undefined : `Delivery webhook returned ${response.status}`,
  };
}

export async function deliverNotification(notification: DeliverableNotification): Promise<DeliveryResult> {
  const directEmail = await sendWithResend(notification);
  if (directEmail) return directEmail;
  const webhook = await sendWithWebhook(notification);
  if (webhook) return webhook;
  return { ok: false, error: "No compatible notification provider is configured" };
}
