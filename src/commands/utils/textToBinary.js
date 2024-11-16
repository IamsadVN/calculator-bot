import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../../function/getLang.js";

function textToCharCode(str) {
    return [...str].map((x) => x.charCodeAt(0));
}

function numberToBinary(input) {
    let temp;
    while(input > 0) {
        temp = (input % 2).toString() + temp;
        input = Math.floor(input / 2);
    }
    let result = parseInt(temp);
    return result;
}

function textToBinary(str) {
    let temp = textToCharCode(str);
    let result = [];

    for(let i=0;i < temp.length;i++) {
        result[i] = numberToBinary(temp[i]).toString();
    }

    for(let i=0;i < result.length;i++) {
        if (result[i].length < 8) {
            while(result[i].length !== 8) {
                result[i]='0'+result[i];
            }
        }
    }
    return result.join(" ");
}

export default {
    name: "text-to-binary",
    description: "Chuyển ký tự thành nhị phân",
    aliases: ["t2b"],

    async executeMessage(message,args,i18next) {
        const inputText = args.join(" ");
        const language = await getLang(message.guild.id);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("textToBinary.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("textToBinary.fields.textInput",{lng: language}),
                    value: codeBlock(inputText)
                },
                {
                    name: i18next.t("textToBinary.fields.resultOutput",{lng: language}),
                    value: codeBlock(textToBinary(inputText))
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL({size: 64})
            })
            .setTimestamp(new Date())

        await message.channel.send({
            embeds: [embed]
        })
    },

    async executeChatInput(interaction,i18next) {
        const language = await getLang(interaction.guildId);

        const inputText = interaction.options.getString("input");

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("textToBinary.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("textToBinary.fields.textInput",{lng: language}),
                    value: codeBlock(inputText)
                },
                {
                    name: i18next.t("textToBinary.fields.resultOutput",{lng: language}),
                    value: codeBlock(textToBinary(inputText))
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
            .addStringOption(option => 
                option.setName("input")
                    .setDescription("Hãy nhập ký tự vào đây")
                    .setRequired(true)
            )
        )
    }
}
