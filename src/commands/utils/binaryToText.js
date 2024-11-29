import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";

function bitToText(str) {
    return [...str.split(/ +/g)].map((x) => String.fromCharCode(parseInt(x, 2))).join("");
}

export default {
    name: "binary-to-text",
    aliases: ["b2t"],
    description: "Converts a binary string to a text",

    async executeMessage(message, args, i18next) {
        const binaryString = args.join(" ");
        const language = await getLang(message.guild.id)

        if (binaryString.search(/^[01\s]+/gm) === -1) {
            return message.channel.send({
                content: i18next.t("binaryToText.error.isInvalidBinary", { lng: language })
            })
        }

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("binaryToText.title", { lng: language }))
            .setFields([
                {
                    name: i18next.t("binaryToText.fields.binaryInput", { lng: language }),
                    value: codeBlock(binaryString)
                },
                {
                    name: i18next.t("binaryToText.fields.resultOutput", { lng: language }),
                    value: codeBlock(bitToText(binaryString))
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL({ size: 64 })
            })
            .setTimestamp(new Date())

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction, i18next) {
        const binaryString = interaction.options.getString("input");
        const language = await getLang(interaction.guildId)

        if (binaryString.search(/^[01\s]+/gm) === -1) {
            return interaction.reply({
                content: i18next.t("binaryToText.error.isInvalidBinary", { lng: language }),
                ephemeral: true
            })
        }

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("binaryToText.title", { lng: language }))
            .setFields([
                {
                    name: i18next.t("binaryToText.fields.binaryInput", { lng: language }),
                    value: codeBlock(binaryString)
                },
                {
                    name: i18next.t("binaryToText.fields.resultOutput", { lng: language }),
                    value: codeBlock(bitToText(binaryString))
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ size: 64 })
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
            .setIntegrationTypes([0,1])
            .addStringOption(option =>
                option.setName("input")
                    .setDescription("Nhập một dãy nhị phân")
                    .setRequired(true)
            )
        )
    }
}