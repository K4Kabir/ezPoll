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
      voted: [],
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

export const deletePolls = mutation({
  args: { id: v.id("polls") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { message: "success" };
  },
});

export const getPollById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("polls")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
  },
});

export const voteOnPoll = mutation({
  args: {
    pollId: v.id("polls"),
    optionTitle: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.pollId);
    const user = await ctx.auth.getUserIdentity();
    const ip = user?.ipAddress ?? "unknown";

    if (!poll) {
      throw new Error("Poll not found");
    }

    const voterId = args.userId ?? ip;

    if (poll.voted?.includes(voterId)) {
      throw new Error("Already voted");
    }

    const option = poll.options.find(
      (o: { title: string; totalVotes: number }) => o.title === args.optionTitle
    );

    if (!option) {
      throw new Error("Option not found");
    }

    option.totalVotes += 1;
    poll.voted?.push(voterId);

    await ctx.db.patch(args.pollId, {
      options: poll.options,
      voted: poll.voted,
    });
  },
});
