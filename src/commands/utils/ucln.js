import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { getLang } from "../../../function/getLang.js";

export default {
    name: "ucln",
    aliases: ["gcd"],
    description: "Tìm Ước Chung Lớn nhất của 2 số",

    async executeMessage(message,args,i18next) {
        const number1 = Number(args[0]);
        const number2 = Number(args[1]);
        const language = await getLang(message.guild.id);

        if (number1 <= 0 || number2 <= 0) {
            return message.channel.send({
                content: i18next.t("ucln.error.isInvalidNumber",{lng: language})
            });
        }
        else if (isNaN(number1) || isNaN(number2)) {
            return message.channel.send({
                content: i18next.t("ucln.error.isNotInteger",{lng: language})
            })
        }

        const embed = new EmbedBuilder()
            .setTitle(i18next.t("ucln.title",{lng: language}))
            .setColor(Number(process.env.CALC))
            .setFields([
                {
                    name: i18next.t("ucln.fields.numberInput1",{lng: language}),
                    value: codeBlock(number1),
                    inline: true
                },
                {
                    name: i18next.t("ucln.fields.numberInput2",{lng: language}),
                    value: codeBlock(number2),
                    inline: true
                },
                {
                    name: i18next.t("ucln.fields.resultOutput",{lng: language}),
                    value: codeBlock(gcd(number1,number2))
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL({size: 64})
            })
            .setTimestamp(new Date())
        
        await message.channel.send({embeds: [embed]});
    },

    async executeChatInput(interaction,i18next) {
        const number1 = interaction.options.getNumber("number_1",true);
        const number2 = interaction.options.getNumber("number_2",true);

        const language = await getLang(interaction.guildId);

        if (number1 <= 0 || number2 <= 0) {
            return interaction.reply({
                content: i18next.t("ucln.error.isInvalidNumber",{lng: language}),
                emphermal: true
            })
        }

        const embed = new EmbedBuilder()
            .setTitle(i18next.t("ucln.title",{lng: language}))
            .setColor(Number(process.env.CALC))
            .setFields([
                {
                    name: i18next.t("ucln.fields.numberInput1",{lng: language}),
                    value: codeBlock(number1),
                    inline: true
                },
                {
                    name: i18next.t("ucln.fields.numberInput2",{lng: language}),
                    value: codeBlock(number2),
                    inline: true
                },
                {
                    name: i18next.t("ucln.fields.resultOutput",{lng: language}),
                    value: codeBlock(gcd(number1,number2))
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({size: 64})
            })
            .setTimestamp(new Date())

        await interaction.reply({
            embeds: [embed]
        })
    },

    registerApplicationCommands(commands) {
        commands.push(new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setContexts([0,2])
            .setIntegrationTypes([0,1])
            .addNumberOption(option =>
                option.setName("number_1")
                    .setRequired(true)
                    .setDescription("Cho con số thứ nhất vào đây")
            )
            .addNumberOption(option =>
                option.setName("number_2")
                    .setRequired(true)
                    .setDescription("Cho con số thứ hai vào đây")
            )
        )
    }
}

function gcd(a,b) {
    while(a !== b) {
        if (a > b) a=a-b;
        else b=b-a;
    }
    return a;
}