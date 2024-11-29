import { REST, Routes } from "discord.js";
import { readdir } from "fs/promises";
import { infoLog } from "./log.js";

//Hàm để load event
export async function loadEvents(client) {
    const dirs = (await readdir("src/events", {
        withFileTypes: true
    })).filter((target) => target.isDirectory());

    for (const dir of dirs) {
        const files = (await readdir(`src/events/${dir.name}`, {
            withFileTypes: true
        })).filter((target) => target.isFile() && target.name.endsWith(".js"));

        for (const file of files) {
            const { default: event } = await import(`../events/${dir.name}/${file.name}`);
            infoLog(`Loaded Event: ${event.name}`) //console.log(event);
            client[event.once ? "once" : "on"](event.name, event.execute);
        }
    }
}

//Hàm để load lệnh
export async function loadCommands(client) {
    const dirs = (await readdir("src/commands", {
        withFileTypes: true
    })).filter((target) => target.isDirectory());

    for (const dir of dirs) {
        const files = (await readdir(`src/commands/${dir.name}`, {
            withFileTypes: true
        })).filter((target) => target.isFile() && target.name.endsWith(".js"));

        for (const file of files) {
            const { default: command } = await import(`../commands/${dir.name}/${file.name}`);
            infoLog(`Loaded Command: ${command.name}`) //console.log(command);
            command.applicationCommands = [];
            command.registerApplicationCommands?.(command.applicationCommands);
            client.commands.set(command.name, command);
        }
    }
    const commands = client.commands.map((command) => command.applicationCommands).flat();

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    const user = await rest.get(Routes.user());

    await rest.put(Routes.applicationCommands(user.id), {
        body: [...commands],
    });
}

