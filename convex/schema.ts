import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  travelRequests: defineTable({
    name: v.string(),
    email: v.string(),
    destination: v.string(),
    dates: v.optional(v.string()),
    travelers: v.string(),
    budget: v.optional(v.string()),
    tripType: v.string(),
    notes: v.optional(v.string()),
    advisorNotes: v.optional(v.string()),
    followUpAt: v.optional(v.number()),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("quoted"), v.literal("booked"), v.literal("closed")),
    source: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"])
    .index("by_followUpAt", ["followUpAt"]),
  promotions: defineTable({
    title: v.string(),
    description: v.string(),
    destination: v.optional(v.string()),
    badge: v.optional(v.string()),
    ctaLabel: v.string(),
    active: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_active", ["active", "sortOrder"]),
});
