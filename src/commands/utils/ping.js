import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../../function/getLang.js";

function calculateTime(inputSeconds) {
    const hours = Math.floor(inputSeconds / 3600);
    const minutes = Math.floor((inputSeconds % 3600) / 60);
    const seconds = inputSeconds % 60;

    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

export default {
    name: "ping",
    aliases: ["lag","check","info"],
    description: "Kiểm tra tốc độ phản hồi của Casio fx-580VN X",


    async executeMessage(message,args,i18next) {
        const language = await getLang(message.guild.id);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setAuthor({
                name: "Pong 🏓",
                iconURL: message.client.user.displayAvatarURL({size:64})
            })
            .setFields([
                {
                    name: i18next.t("ping.fields.uptime",{lng: language}),
                    value: codeBlock(`[${calculateTime(Math.round(process.uptime()))}]`),
                    inline: true
                },
                {
                    name: i18next.t("ping.fields.latency",{lng: language}),
                    value: codeBlock(`${message.client.ws.ping}ms`),
                    inline: true
                }
            ])
            .setFooter({
                text: message.author.name,
                iconURL: message.author.displayAvatarURL({size: 64})
            })
            .setTimestamp(new Date())

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction,i18next) {
        const language = await getLang(interaction.guildId);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setAuthor({
                name: "Pong 🏓",
                iconURL: interaction.client.user.displayAvatarURL({size: 64})
            })
            .setFields([
                {
                    name: i18next.t("ping.fields.uptime",{lng: language}),
                    value: codeBlock(`[${calculateTime(Math.round(process.uptime()))}]`),
                    inline: true
                },
                {
                    name: i18next.t("ping.fields.latency",{lng: language}),
                    value: codeBlock(`${interaction.client.ws.ping}ms`),
                    inline: true
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({size:64})
            })
            .setTimestamp(new Date())

        await interaction.reply({
            embeds: [embed]
        });
    },

    registerApplicationCommands(commands) {
        commands.push(new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setContexts([0,2])
        );
    }
}