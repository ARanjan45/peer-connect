import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";
import { getUserByClerkId } from "./_utils";

// This mutation will either create a new user or update an existing one
export const store = internalMutation({
    args: {
        username: v.string(),
        imageurl: v.string(),
        clerkId: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        // Try to find an existing user by their clerkId
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            // If the user exists, patch their information
            // This is safer than updating if there are other fields in 'users' table
            // that are not part of Clerk's webhook data.
            await ctx.db.patch(existingUser._id, {
                username: args.username,
                imageurl: args.imageurl,
                email: args.email,
            });
            console.log(`Patched existing user: ${existingUser._id}`);
            return existingUser._id; // Return the ID of the updated user
        } else {
            // If the user doesn't exist, insert a new one
            const newUserId = await ctx.db.insert("users", args);
            console.log(`Inserted new user: ${newUserId}`);
            return newUserId; // Return the ID of the new user
        }
    },
});

// Query to get a user by clerkId
export const get = internalQuery({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();
    },
});

// Optional: Mutation to remove a user when deleted from Clerk
export const remove = internalMutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .unique();

        if (existingUser) {
            await ctx.db.delete(existingUser._id);
            console.log(`Deleted user: ${existingUser._id}`);
        } else {
            console.log(`Attempted to delete non-existent user with clerkId: ${args.clerkId}`);
        }
    },
});
export const searchUsers = query({
    args: { searchTerm: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new ConvexError("Unauthorized");

        const currentUser = await getUserByClerkId({
            ctx, clerkId: identity.subject
        });
        if (!currentUser) throw new ConvexError("User not found");

        if (args.searchTerm.trim() === "") return [];

        const allUsers = await ctx.db.query("users").collect();

        // get all friend IDs
        const friends1 = await ctx.db.query("friends")
            .withIndex("by_user1", (q) => q.eq("user1", currentUser._id)).collect();
        const friends2 = await ctx.db.query("friends")
            .withIndex("by_user2", (q) => q.eq("user2", currentUser._id)).collect();

        const friendIdStrings = [
            ...friends1.map(f => f.user2.toString()),
            ...friends2.map(f => f.user1.toString()),
        ];


        const term = args.searchTerm.toLowerCase();

        return allUsers
    .filter(user =>
        user._id.toString() !== currentUser._id.toString() &&
        (user.username.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term))
    )
    .map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
    }));
    },
});