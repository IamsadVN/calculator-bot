import { config } from "dotenv";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { loadEvents, loadCommands } from "./utils/loader.js";
import { errorLog, infoLog, warnLog } from "./utils/log.js"
import i18next from "i18next";
import Backend from "i18next-fs-backend";

//env
config();

//Debug log warning
if (process.env.DEBUG_LOG === "true")
    warnLog("Debug log is on, turn off debug log if you forgot config the .env file");

//i18next 
await i18next.use(Backend).init({
    fallbackLng: "vi",
    preload: ["en", "vi"],
    backend: {
        loadPath: "./locales/{{lng}}.json"
    }
}, (err) => {
    if (err) return errorLog(err);
    else infoLog("Multiple Language loaded");
})

//Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

//Loader
await loadEvents(client);
await loadCommands(client);

//Bot Login 
client.login(process.env.BOT_TOKEN);