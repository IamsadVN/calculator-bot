import { WebhookClient, codeBlock } from "discord.js"

export default {
    name: "guildMemberRemove",
    once: false,

    async execute(client) {
        const webhook = new WebhookClient({
            url: process.env.WEBHOOK_GUILDLEFT,
        });

        const dateJoin = new Date(client.guild.joinedTimestamp);
        const formattedDate = dateJoin.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) + "\n" + dateJoin.getHours() + "h" + " "
           + dateJoin.getMinutes() + "m" + " "
           + dateJoin.getSeconds() + "s";

        const embed = {
            color: 0x808080,
            title: "Đã rời một Guild nào đó...",
            description: `**Tên Guild:** ${codeBlock(`${client.guild.name}`)}`,
            fields: [
                {
                    name: "Member:",
                    value: `${codeBlock(client.guild.memberCount)}`,
                    inline: true
                },
                {
                    name: "Biệt danh:",
                    value: `${codeBlock(client.nickname || "Không có")}`,
                    inline: true
                },
                {
                    name: "Owner:",
                    value: `${codeBlock(client.guild.ownerId)}`,
                    inline: false
                },
                {
                    name: "Ngôn ngữ:",
                    value: `${codeBlock(client.guild.preferredLocale)}`,
                    inline: true
                },
                {
                    name: "Join at:",
                    value: `${codeBlock(formattedDate)}`,
                    inline: false
                }
            ],
            footer: {
                text: "Goodbye!"
            },
            timestamp: new Date().toISOString()
        }

        webhook.send({
            embeds: [embed]
        });
    }
}