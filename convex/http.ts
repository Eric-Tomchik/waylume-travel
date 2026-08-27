import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/trip-request",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      if (!body.name || !body.email || !body.destination) {
        return new Response(JSON.stringify({ error: "Name, email, and destination are required." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const id = await ctx.runMutation(internal.travelRequests.create, {
        name: String(body.name).trim(),
        email: String(body.email).trim().toLowerCase(),
        destination: String(body.destination).trim(),
        dates: body.dates ? String(body.dates).trim() : undefined,
        travelers: body.travelers ? String(body.travelers).trim() : "2",
        budget: body.budget ? String(body.budget).trim() : undefined,
        tripType: body.tripType ? String(body.tripType).trim() : "Vacation Package",
        notes: body.notes ? String(body.notes).trim() : undefined,
      });

      return new Response(JSON.stringify({ ok: true, id }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Unable to process trip request." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
