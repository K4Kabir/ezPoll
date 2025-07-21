import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  polls: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    validTill: v.string(),
    createdBy: v.id("user"),
    options: v.array(
      v.object({
        title: v.string(),
        totalVotes: v.number(),
      })
    ),
  }),
});
