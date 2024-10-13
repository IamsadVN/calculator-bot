import { errorLog, infoLog } from "../../../function/log.js"
import { WebhookClient, codeBlock } from "discord.js";

export default {
    name: "error",
    once: false,

    async execute(client) {
        errorLog(client);
        console.error(client);

        const webhook = new WebhookClient({
            url: process.env.WEBHOOK_ERROR
        });

        const embed = {
            color: 0xff0000,
            title: 'Đã có 1 lỗi xảy ra trong quá trình bot chạy !!!',
            description: `Lỗi: ${codeBlock(client)}`,
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Anti Crash đã hoạt động 💀',
            },
        };

        webhook.send({
            embeds: [embed]
        })
            .then(async webhook => infoLog("Đã gửi lỗi về máy chủ"))
            .catch(console.error);
    }
}