import { ServerSetting, UserSetting } from "../../database/schema.js";

export async function getLang(ctx) {
    if ("author" in ctx) {
        //message -> serverlang
        return await new ServerSetting().getServerLang(ctx.guildId) || "vi";
    }
    else {
        //interaction
        if (ctx.inCachedGuild()) { //in a guild -> serverlang
            return await new ServerSetting().getServerLang(ctx.guildId) || "vi";
        }
        else { //not in a guild -> userlang
            return await new UserSetting().getUserLang(ctx.user.id) || "vi";
        }
    }
}