import { WebhookClient, codeBlock } from "discord.js"

export default {
    name: "guildCreate",
    once: false,

    async execute(client) {
        const webhook = new WebhookClient({
            url: process.env.GUILDJOIN
        });

        //console.log(client);

        const dateFormatted = new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const embed = {
            color: 0x008000,
            title: 'Bot vừa vào một máy chủ nào đó',
            fields: [
                {
                    name: "Tên máy chủ:",
                    value: codeBlock(client.name)
                },
                {
                    name: "Member:",
                    value: codeBlock(client.memberCount),
                    inline: true
                },
                {
                    name: "Language:",
                    value: codeBlock(client.preferredLocale),
                    inline: true
                },
                {
                    name: "Owner ID:",
                    value: codeBlock(client.ownerId)
                },
                {
                    name: "Date Join:",
                    value: codeBlock(dateFormatted)
                }
            ],
            footer: {
                text: "Máy chủ này rất đẹp trai"
            },
            timestamp: new Date().toISOString()
        }

        webhook.send({
            embeds: [embed]
        })
    }
}