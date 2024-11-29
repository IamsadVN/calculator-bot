import { WebhookClient, codeBlock } from "discord.js"

export default {
    name: "guildDelete",
    once: false,
    
    async execute(guild) {
        const webhook = new WebhookClient({
            url: process.env.WEBHOOK_GUILDLEFT
        });
                
        const dateJoin = new Date(guild.joinedTimestamp);
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
            description: `**Tên Guild:** ${codeBlock(`${guild.name}`)}`,
            fields: [
                {
                    name: "Member:",
                    value: `${codeBlock(guild.memberCount)}`,
                    inline: true
                },
                {
                    name: "Owner:",
                    value: `${codeBlock(guild.ownerId)}`,
                    inline: true
                },
                {
                    name: "Ngôn ngữ:",
                    value: `${codeBlock(guild.preferredLocale)}`,
                    inline: false
                },
                {
                    name: "Join at:",
                    value: `${codeBlock(formattedDate)}`,
                    inline: true
                }
            ],
            footer: {
                text: "Goodbye!"
            },
            timestamp: new Date().toISOString()
        }
        
        webhook.send({
            embeds: [embed],
        });
    }
}