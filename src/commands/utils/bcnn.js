import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";

function getBcnn(n1,n2) {
    const backup_n1 = n1;
    const backup_n2 = n2;

    while(n1 !== n2) {
        if (n1 > n2) n1-=n2;
        else n2-=n1;
    }

    return (backup_n1*backup_n2)/n1;
}

export default {
    name: "bcnn",
    aliases: ["lcm"],
    description: "Tìm bội chung nhỏ nhất của 2 số",

    async executeMessage(message,args,i18next) {
        const number1 = Number(args[0]);
        const number2 = Number(args[1]);
        const language = await getLang(message.guild.id)
        
        if (number1 <= 0 || number2 <= 0) {
            return message.channel.send({
                content: i18next.t("bcnn.error.isInvalidNumber",{lng: language})
            });
        } 
        else if (isNaN(number1) || isNaN(number2)) {
            return message.channel.send({
                content: i18next.t("bcnn.error.isNotInteger",{lng: language})
            });
        }

        const resultBcnn = getBcnn(number1,number2);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("bcnn.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("bcnn.fields.numberInput1",{lng: language}),
                    value: codeBlock(number1),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.numberInput2",{lng: language}),
                    value: codeBlock(number2),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.resultOutput",{lng: language}),
                    value: codeBlock(resultBcnn)
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL({size:64})
            })
            .setTimestamp(new Date())
            
        await message.channel.send({embeds: [embed]});
    },
    
    async executeChatInput(interaction,i18next) {
        const number1 = interaction.options.getNumber("number_1",true);
        const number2 = interaction.options.getNumber("number_2",true);
        const language = await getLang(interaction.guildId)

        if (number1 <= 0 || number2 <= 0) {
            return interaction.reply({
                content: i18next.t("bcnn.error.isInvalidNumber",{lng: language}),
                ephemeral: true
            });
        } 
        
        const resultBcnn = getBcnn(number1,number2);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("bcnn.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("bcnn.fields.numberInput1",{lng: language}),
                    value: codeBlock(number1),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.numberInput2",{lng: language}),
                    value: codeBlock(number2),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.resultOutput",{lng: language}),
                    value: codeBlock(resultBcnn)
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({size: 64})
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
            .addNumberOption(option =>
                option.setName("number_1")
                    .setDescription("Con số thứ nhất")
                    .setRequired(true)
            )
            .addNumberOption(option =>
                option.setName("number_2")
                    .setDescription("Con số thứ hai")
                    .setRequired(true)
            )
        )
    }
}