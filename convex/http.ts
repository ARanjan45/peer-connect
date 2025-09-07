import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
    const payload = await req.text();
    const svixHeaders = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    };

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("CLERK_WEBHOOK_SECRET is not set in Convex environment variables.");
        return;
    }

    const webhook = new Webhook(webhookSecret);

    try {
        const event = webhook.verify(payload, svixHeaders) as WebhookEvent;
        return event;
    } catch (error) {
        console.error("Clerk Webhook request couldn't be verified:", error);
        return;
    }
};

const handleClerkWebHook = httpAction(async (ctx, req) => {
    const event = await validatePayload(req);
    if (!event) {
        return new Response("Couldn't validate Clerk payload or secret missing.", {
            status: 400,
        });
    }

    console.log(`Received Clerk webhook event: ${event.type}`);
    console.log("Event Data:", JSON.stringify(event.data, null, 2));

    try {
        switch (event.type) {
            case "user.created":
            case "user.updated": {
                await ctx.runMutation(internal.user.store, {
                    username: `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim() || event.data.username || "Anonymous",
                    imageurl: event.data.image_url,
                    clerkId: event.data.id,
                    email: event.data.email_addresses?.[0]?.email_address || "",
                });
                console.log(`User ${event.data.id} processed via store mutation.`);
                break;
            }
            case "user.deleted": {
                // Ensure event.data.id is defined before passing it
                if (event.data.id) { // This is the crucial check!
                    await ctx.runMutation(internal.user.remove, { clerkId: event.data.id });
                    console.log(`User ${event.data.id} marked for deletion.`);
                } else {
                    console.warn("Clerk user.deleted event received without a valid ID. Skipping removal.");
                }
                break;
            }
            default: {
                console.log("Clerk Webhook event type not explicitly handled:", event.type);
            }
        }
    } catch (error) {
        console.error(`Error processing Clerk webhook event ${event.type}:`, error);
        return new Response(`Error processing webhook: ${error instanceof Error ? error.message : String(error)}`, {
            status: 500,
        });
    }

    return new Response(null, {
        status: 200,
    });
});

const http = httpRouter();
http.route({
    path: "/clerk-users-webhook",
    method: "POST",
    handler: handleClerkWebHook,
});

export default http;
