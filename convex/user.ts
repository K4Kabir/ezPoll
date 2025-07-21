import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CheckUser = mutation({
  args: {
    id: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (user) {
      return { message: "Welcome back", userId: user._id };
    }

    const newUser = await ctx.db.insert("user", args);
    return { message: "User created in db", newUser };
  },
});
