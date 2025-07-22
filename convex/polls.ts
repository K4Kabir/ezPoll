import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPoll = mutation({
  args: {
    title: v.string(),
    createdBy: v.string(),
    description: v.string(),
    validTill: v.string(),
    options: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const optionsWithVotes = args.options.map((title) => ({
      title,
      totalVotes: 0,
    }));

    await ctx.db.insert("polls", {
      title: args.title,
      description: args.description,
      validTill: args.validTill,
      options: optionsWithVotes,
      createdBy: args.createdBy,
    });
  },
});

export const getPolls = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("polls")
      .filter((q) => q.eq(q.field("createdBy"), args.userId))
      .collect();
  },
});
