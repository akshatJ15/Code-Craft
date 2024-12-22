import { mutation } from "./_generated/server";
import { ConvexError, convexToJson, v } from "convex/values";

export const saveExecution = mutation({
  args: {
    language: v.string(),
    output: v.optional(v.string()),
    error: v.optional(v.string()),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    //check pro status
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user?.isPro && args.language !== "javascript") {
      throw new ConvexError("You need to be a pro user to run this code");
    }

    await ctx.db.insert("codeExecutions", {
      ...args,
      userId: identity.subject,
    });
  },
});
