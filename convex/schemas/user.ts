import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  user: defineTable({
    id: v.string(),
    userName: v.string(),
  }),
});
