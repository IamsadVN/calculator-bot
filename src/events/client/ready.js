import { ActivityType } from "discord.js";
import { infoLog } from "../../utils/log.js";

export default {
    name: "ready",
    once: true,

    async execute(client) {
        infoLog(`Login on ${client.user.tag} complete`);

        function sleep(time) {
            return new Promise((resolve) => {
                setTimeout(resolve,time);
            })
        }

        const timeToChangeActivity = 30000;

        while(true) {
            client.user.setPresence({
                status: "online",
                activities: [
                    {
                        name: "Casio fx-580VN X",
                        type: ActivityType.Playing
                    }
                ]
            });

            await sleep(timeToChangeActivity);

            client.user.setPresence({
                status: "dnd",
                activities: [
                    {
                        name: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} người đang bấm máy`,
                        type: ActivityType.Watching
                    }
                ]
            });

            await sleep(timeToChangeActivity);
        }
    }
}