import { config } from "dotenv";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { loadEvents, loadCommands } from "./utils/loader.js";
import { errorLog, infoLog } from "../function/log.js"
import mongoose, { get } from "mongoose";
import i18next from "i18next";
import Backend from "i18next-fs-backend";

// if (process.env.NODE_ENV === "DEVELOPMENT") {
//     config({
//         path: ".env.development"
//     });
// } else {
//     config();
// }

config();

//i18next 
i18next.use(Backend).init({
    fallbackLng: "vi",
    preload: ["en","vi"],
    backend: {
        loadPath: "./locales/{{lng}}/translation.json"
    }
}, (err,t) => {
    if (err) return errorLog(err);
    infoLog("Multiple Language loaded");
})

//Client Gateway
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
await mongoose.connect(process.env.MONGO_DB);
infoLog("MongoDB has connected");


//Bot Login 
client.login(process.env.BOT_TOKEN);