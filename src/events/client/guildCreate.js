import { WebhookClient, codeBlock } from "discord.js"

export default {
    name: "guildCreate",
    once: false,

    async execute(client) {
        const webhook = new WebhookClient({
            url: "https://discord.com/api/webhooks/1254025359079247996/uUG9uQ9xwHdEa2Xu5SPg7BOpqfaRniT91PNyrYzxyoR7CM5GidnZifK1iue4FDOHHnVZ"
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