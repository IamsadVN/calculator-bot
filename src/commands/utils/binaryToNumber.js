import { codeBlock, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";

function binToNum(str) {
    let result = 0;
    const binaryArr = str.split("").reverse();

    for(let i=0;i < binaryArr.length; i++) {
        const digit = Number(binaryArr[i]);
        if(isNaN(digit) || (digit !== 0 && digit !== 1)) {
            return "error";
        }
        result += digit * Math.pow(2,i);
    }

    return result;
}

export default {
    name: "binary-to-number",
    description: "Converts a binary to decimal",
    aliases: ["b2n"],

    async executeMessage(message,args,i18next) {
        const result = binToNum(args[0]);
        const language = await getLang(message);

        if (result === "error") {
            await message.channel.send(i18next.t("binaryToNumber.error.invalidBinary",{lng: language}));
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("binaryToNumber.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("binaryToNumber.fields.binaryInput",{lng: language}),
                    value: codeBlock(args[0])
                },
                {
                    name: i18next.t("binaryToNumber.fields.resultOutput",{lng: language}),
                    value: codeBlock(result)
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL({size:64})
            })
            .setTimestamp(new Date())

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction,i18next) {
        const result = binToNum(interaction.options.getString("input"));
        const language = await getLang(interaction)

        if (result === "error") {
            await interaction.reply({
                content: i18next.t("binaryToNumber.error.invalidBinary",{lng: language}),
                ephemeral: true
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("binaryToNumber.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("binaryToNumber.fields.binaryInput",{lng: language}),
                    value: codeBlock(interaction.options.getString("input"))
                },
                {
                    name: i18next.t("binaryToNumber.fields.resultOutput",{lng: language}),
                    value: codeBlock(result)
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
            .setIntegrationTypes([0,1])
            .addStringOption(option => 
                option.setName("input")
                    .setDescription("Nhập vào dãy nhị phân")
                    .setRequired(true)
            )
        )
    }
}