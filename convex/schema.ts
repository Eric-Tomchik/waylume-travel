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
  quotes: defineTable({
    travelRequestId: v.id("travelRequests"),
    title: v.string(),
    summary: v.string(),
    amount: v.optional(v.number()),
    currency: v.string(),
    supplierName: v.optional(v.string()),
    supplierReference: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("accepted"), v.literal("expired"), v.literal("declined")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_request", ["travelRequestId"]).index("by_status", ["status"]),
  supplierLinks: defineTable({
    name: v.string(),
    category: v.string(),
    url: v.string(),
    notes: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_active", ["active"]),
  savedTrips: defineTable({
    accessCode: v.string(),
    email: v.string(),
    title: v.string(),
    destination: v.string(),
    tripType: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_accessCode", ["accessCode"]).index("by_email", ["email"]),
});
