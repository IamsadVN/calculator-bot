import { config } from "dotenv";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { loadEvents, loadCommands } from "./utils/loader.js";
import { errorLog, infoLog } from "./utils/log.js"
import connection from "../database/schema.js";
import i18next from "i18next";
import Backend from "i18next-fs-backend";

//env
config();

//i18next 
i18next.use(Backend).init({
    fallbackLng: "vi",
    preload: ["en","vi"],
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

//Database
connection.connect((err) => {
    if (err) errorLog(err);
    else infoLog(`MySQL connected, using database "${connection.config.database}"`);
});

//Bot Login 
client.login(process.env.BOT_TOKEN);