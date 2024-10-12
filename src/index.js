import { config } from "dotenv";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { loadEvents, loadCommands } from "./utils/loader.js";
import { infoLog } from "../function/log.js"
import mongoose from "mongoose";

// if (process.env.NODE_ENV === "DEVELOPMENT") {
//     config({
//         path: ".env.development"
//     });
// } else {
//     config();
// }

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

await loadEvents(client);
await loadCommands(client);

await mongoose.connect(process.env.MONGO_DB);
infoLog("MongoDB has connected");

client.login(process.env.BOT_TOKEN);