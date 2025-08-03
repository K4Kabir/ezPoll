import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  comments: defineTable({
    username: v.string(),
    content: v.string(),
    poll: v.id("polls"),
  }),
});
