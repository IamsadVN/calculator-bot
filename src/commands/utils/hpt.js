import { codeBlock, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as math from "mathjs";
import { getLang } from "../../../function/getLang.js";

export default {
    name: "hpt",
    description: "Hệ Phương Trình Tính Tuyến 2 Ẩn",
    aliases: ["seq"],

    async executeMessage(message,args,i18next) {
        const [equation1, c1] = args[0].split("=");
        const [equation2, c2] = args[1].split("=");
        const valEquation1 = getValueOfEquation(equation1);
        const valEquation2 = getValueOfEquation(equation2);
        const language = await getLang(message.guild.id);

        if (valEquation1 === "error" || valEquation2 === "error") {
            await message.channel.send(i18next.t("hpt.error.wrongEquation",{lng: language}));
            return;
        }
        else if(valEquation1.variable_1 !== valEquation2.variable_1 && valEquation1.variable_2 !== valEquation2.variable_2) {
            await message.channel.send(i18next.t("hpt.error.diffVariable",{lng: language}));
            return;
        }
        
        const a1 = math.evaluate(valEquation1.coefficient_1);
        const a2 = math.evaluate(valEquation2.coefficient_1);
        const b1 = math.evaluate(valEquation1.coefficient_2);
        const b2 = math.evaluate(valEquation2.coefficient_2);

        const resultSeq = calculateSeq(a1,b1,c1,a2,b2,c2);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("hpt.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("hpt.fields.inputBlock1",{lng: language}),
                    value: codeBlock(args[0])
                },
                {
                    name: i18next.t("hpt.fields.inputBlock2",{lng: language}),
                    value: codeBlock(args[1])
                },
                {
                    name: i18next.t("hpt.fields.outputBlock1", {var1: valEquation1.variable_1.toUpperCase(), lng: language}),
                    value: codeBlock(`${valEquation1.variable_1} = ${resultSeq.xValue}`),
                    inline: true
                },
                {
                    name: i18next.t("hpt.fields.outputBlock2", {var2: valEquation1.variable_2.toUpperCase(), lng: language}),
                    value: codeBlock(`${valEquation1.variable_2} = ${resultSeq.yValue}`),
                    inline: true
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
        const [equation1, c1] = interaction.options.getString("equation-1").replaceAll(" ","").split("=");
        const [equation2, c2] = interaction.options.getString("equation-2").replaceAll(" ","").split("=");
        
        const valEquation1 = getValueOfEquation(equation1);
        const valEquation2 = getValueOfEquation(equation2);

        const language = await getLang(interaction.guildId)

        if (valEquation1 === "error" || valEquation2 === "error") {
            return interaction.reply({
                content: i18next.t("hpt.error.wrongEquation",{lng: language}),
                ephemeral: true
            });
        }
        else if (valEquation1.variable_1 !== valEquation2.variable_1 && valEquation1.variable_2 !== valEquation2.variable_2) {
            return interaction.reply({
                content: i18next.t("hpt.error.diffVariable",{lng: language}),
                ephemeral: true
            });
        }

        const a1 = math.evaluate(valEquation1.coefficient_1);
        const a2 = math.evaluate(valEquation2.coefficient_1);
        const b1 = math.evaluate(valEquation1.coefficient_2);
        const b2 = math.evaluate(valEquation2.coefficient_2);

        const resultSeq = calculateSeq(a1,b1,c1,a2,b2,c2);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("hpt.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("hpt.fields.inputBlock1",{lng: language}),
                    value: codeBlock(interaction.options.getString("equation-1"))
                },
                {
                    name: i18next.t("hpt.fields.inputBlock2",{lng: language}),
                    value: codeBlock(interaction.options.getString("equation-2"))
                },
                {
                    name: i18next.t("hpt.fields.outputBlock1", {var1: valEquation1.variable_1.toUpperCase(), lng: language}), //`Giá trị ${valEquation1.variable_1.toUpperCase()}:`,
                    value: codeBlock(`${valEquation1.variable_1} = ${resultSeq.xValue}`),
                    inline: true
                },
                {
                    name: i18next.t("hpt.fields.outputBlock2", {var2: valEquation1.variable_2.toUpperCase(), lng: language}), //`Giá trị ${valEquation1.variable_2.toUpperCase()}:`,
                    value: codeBlock(`${valEquation1.variable_2} = ${resultSeq.yValue}`),
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
            .addStringOption(option =>
                option.setName("equation-1")
                    .setDescription("Nhập phương trình thứ nhất")
                    .setRequired(true)
            )
            .addStringOption(option => 
                option.setName("equation-2")
                    .setDescription("Nhập phương trình thứ hai")
                    .setRequired(true)
            )
        )
    }
}

function getValueOfEquation(equation) {
    const regex = /^(-?\d*\.?\d*\/?\d*)?([a-zA-Z])\s*([+-])\s*(-?\d*\.?\d*\/?\d*)?([a-zA-Z])$/;

    const matched = equation.match(regex);

    if(!matched) return "error";

    return {
        coefficient_1: matched[1] || 1,
        coefficient_2: `${matched[3]}${matched[4] || 1}`,
        variable_1: matched[2],
        variable_2: matched[5]
    };
}

function calculateSeq(a1,b1,c1,a2,b2,c2) {
    let D= a1*b2 - a2*b1;
    let Dx= c1*b2 - c2*b1;
    let Dy= a1*c2 - a2*c1;

    if (D === 0) {
        if (Dx + Dy === 0) {
            return {
                xValue: "Vô số Nghiệm",
                yValue: "Vô số Nghiệm"
            }
        }
        else {
            return {
                xValue: "Vô Nghiệm",
                yValue: "Vô Nghiệm"
            }
        }
    }
    else {
        return {
            xValue: Dx/D,
            yValue: Dy/D
        }
    }
}