import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
    // input 
    args:{
        userId:v.string(),
        email:v.string(),
        name:v.string(),
    },
    // checking if user exists or not and making entry into db
    handler:async(ctx,args)=>{
        const existingUser = await ctx.db.query("users")
        .filter(q=>q.eq(q.field("userId"),args.userId))
        .first();

        if(!existingUser)
        {
            await ctx.db.insert("users",{
                userId:args.userId,
                email:args.email,
                name:args.name,
                isPro:false,
            })
        }
    }
})