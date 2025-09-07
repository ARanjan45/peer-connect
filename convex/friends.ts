// friends.ts
import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });
    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    const friendships = [...friendships1, ...friendships2];

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        // Correctly get the user ID of the other person in the friendship
        const otherUserId = friendship.user1 === currentUser._id
          ? friendship.user2
          : friendship.user1;

        // Get the user document and attach it to the friendship document
        const user = await ctx.db.get(otherUserId);
        
        // This is the key change: return the friendship with the resolved user object
        return {
          ...friendship,
          user,
        };
      })
    );

    // Return the array of friendship documents with the attached user data
    return friends;
  },
});