import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import {api} from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return new Response("WebHook Secret not found", { status: 500 });
    }

    const svx_id = request.headers.get("svx-id");
    const svx_signature = request.headers.get("svx-signature");
    const svx_timestamp = request.headers.get("svx-timestamp");

    if (!svx_id || !svx_signature || !svx_timestamp) {
      return new Response("Invalid Headers", { status: 401 });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt;

    try {
      evt = wh.verify(body, {
        "svix-id": svx_id,
        "svix-timestamp": svx_timestamp,
        "svix-signature": svx_signature,
      }) as WebhookEvent;
    } catch (error) {
      console.error(error);
      return new Response("Invalid WebHook", { status: 401 });
    }

    const eventType = evt.type;
    if (eventType === "user.created") {
      //save the user to db
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`;
      try {
        //save user to db
        await ctx.runMutation(api.users.syncUser,{
          userId:id,
          email,
          name
        })
      } catch (error) {
        console.error(error);
        return new Response("Error Occurred", { status: 500 });
      }
    }
    return new Response("WebHook processed successfully", { status: 200 });
  }),
});
