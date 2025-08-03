import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getComments = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("poll"), args.id))
      .collect();
  },
});

export const addComments = mutation({
  args: {
    username: v.string(),
    content: v.string(),
    poll: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      ...args,
    });
  },
});
