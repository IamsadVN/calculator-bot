import { codeBlock } from "discord.js";
import i18next from "i18next";
import * as math from "mathjs";

export default {
    name: "hpt",
    description: "Hệ Phương Trình Tính Tuyến 2 Ẩn",
    aliases: ["seq"],

    async executeMessage(message,args,i18next) {
        const [equation1, c1] = args[0].split("=");
        const [equation2, c2] = args[1].split("=");
        const valEquation1 = getValueOfEquation(equation1);
        const valEquation2 = getValueOfEquation(equation2);

        if (valEquation1 === "error" || valEquation2 === "error") {
            await message.channel.send(i18next.t("hpt.error.wrongEquation"));
            return;
        }
        else if(valEquation1.variable_1 !== valEquation2.variable_1 && valEquation1.variable_2 !== valEquation2.variable_2) {
            await message.channel.send(i18next.t("hpt.error.diffVariable"));
            return;
        }
        
        const a1 = math.evaluate(valEquation1.coefficient_1);
        const a2 = math.evaluate(valEquation2.coefficient_1);
        const b1 = math.evaluate(valEquation1.coefficient_2);
        const b2 = math.evaluate(valEquation2.coefficient_2);

        const resultSeq = calculateSeq(a1,b1,c1,a2,b2,c2);

        const embed = {
            color: 0x3399ff,
            title: i18next.t("hpt.title"),
            fields: [
                {
                    name: i18next.t("hpt.fields.inputBlock1"),
                    value: codeBlock(args[0])
                },
                {
                    name: i18next.t("hpt.fields.inputBlock2"),
                    value: codeBlock(args[1])
                },
                {
                    name: i18next.t("hpt.fields.outputBlock1", {var1: valEquation1.variable_1.toUpperCase()}),
                    value: codeBlock(`${valEquation1.variable_1} = ${resultSeq.xValue}`),
                    inline: true
                },
                {
                    name: i18next.t("hpt.fields.outputBlock2", {var2: valEquation1.variable_2.toUpperCase()}),
                    value: codeBlock(`${valEquation1.variable_2} = ${resultSeq.yValue}`),
                    inline: true
                }
            ],
            footer: {
                text: message.author.username,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction,i18next) {
        const [equation1, c1] = interaction.options.getString("equation-1").replaceAll(" ","").split("=");
        const [equation2, c2] = interaction.options.getString("equation-2").replaceAll(" ","").split("=");
        
        const valEquation1 = getValueOfEquation(equation1);
        const valEquation2 = getValueOfEquation(equation2);

        if (valEquation1 === "error" || valEquation2 === "error") {
            await interaction.reply({
                content: i18next.t("hpt.error.wrongEquation"),
                ephemeral: true
            });
            return;
        }
        else if (valEquation1.variable_1 !== valEquation2.variable_1 && valEquation1.variable_2 !== valEquation2.variable_2) {
            await interaction.reply(i18next.t("hpt.error.diffVariable"));
            return;
        }

        const a1 = math.evaluate(valEquation1.coefficient_1);
        const a2 = math.evaluate(valEquation2.coefficient_1);
        const b1 = math.evaluate(valEquation1.coefficient_2);
        const b2 = math.evaluate(valEquation2.coefficient_2);

        const resultSeq = calculateSeq(a1,b1,c1,a2,b2,c2);

        const embed = {
            color: 0x3399ff,
            title: i18next.t("hpt.title"),
            fields: [
                {
                    name: i18next.t("hpt.fields.inputBlock1"),
                    value: codeBlock(interaction.options.getString("equation-1"))
                },
                {
                    name: i18next.t("hpt.fields.inputBlock2"),
                    value: codeBlock(interaction.options.getString("equation-2"))
                },
                {
                    name: i18next.t("hpt.fields.outputBlock1", {var1: valEquation1.variable_1.toUpperCase()}), //`Giá trị ${valEquation1.variable_1.toUpperCase()}:`,
                    value: codeBlock(`${valEquation1.variable_1} = ${resultSeq.xValue}`),
                    inline: true
                },
                {
                    name: i18next.t("hpt.fields.outputBlock2", {var2: valEquation1.variable_2.toUpperCase()}), //`Giá trị ${valEquation1.variable_2.toUpperCase()}:`,
                    value: codeBlock(`${valEquation1.variable_2} = ${resultSeq.yValue}`),
                    inline: true
                }
            ],
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({
            embeds: [embed]
        });
    },

    registerApplicationCommands(commands) {
        commands.push({
            name: this.name,
            description: this.description,
            options: [
                {
                    required: true,
                    name: "equation-1",
                    description: "Type your first Equation here",
                    type: 3
                },
                {
                    required: true,
                    name: "equation-2",
                    description: "Type your second Equation here",
                    type: 3
                }
            ]
        })
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