import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

/**
 * Fora offers carry hard booking and travel windows. Without this, a published
 * deal would keep advertising an offer the supplier has already withdrawn —
 * both an embarrassment and a Fora accuracy problem. Runs daily, just after
 * midnight US Central (06:10 UTC).
 */
crons.cron("retire expired Fora deals", "10 6 * * *", internal.foraDeals.retireExpiredInternal, {});

export default crons;
