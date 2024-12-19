import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";

function numToBin(number) {
    let string = '';
    while(number > 0) {
        string = (number % 2) + string;
        number = Math.floor(number/2);
    }
    return string;
}

export default {
    name: "number-to-binary",
    aliases: ["n2b"],
    description: "Converts a number to binary",

    async executeMessage(message,args,i18next) {
        const number = Number(args[0]);
        const language = await getLang(message);

        if (!Number.isInteger(number)) 
            return message.channel.send(i18next.t("numberToBinary.error.isNotInteger",{lng:language}));

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("numberToBinary.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("numberToBinary.fields.numberInput",{lng: language}),
                    value: codeBlock(number)
                },
                {
                    name: i18next.t("numberToBinary.fields.resultOutput",{lng: language}),
                    value: codeBlock(numToBin(number))
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()

            })
            .setTimestamp(new Date())
        
        await message.channel.send({
            embeds: [embed]
        })
    },

    async executeChatInput(interaction,i18next) {
        const number = interaction.options.getInteger("input");
        const language = await getLang(interaction);
        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("numberToBinary.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("numberToBinary.fields.numberInput",{lng: language}),
                    value: codeBlock(number)
                },
                {
                    name: i18next.t("numberToBinary.fields.resultOutput",{lng: language}),
                    value: codeBlock(numToBin(number))
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()

            })
            .setTimestamp(new Date())

        await interaction.reply({embeds: [embed]});
    },

    registerApplicationCommands(commands) {
        commands.push(new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setContexts([0,2])
            .setIntegrationTypes([0,1])
            .addIntegerOption(option =>
                option.setName("input")
                    .setDescription("Vui lòng cho 1 con số vào đây")
                    .setRequired(true)
            )
        )
    }
}