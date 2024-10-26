import { codeBlock } from "discord.js";

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

        if (number1 <= 0 || number2 <= 0) {
            return message.channel.send({
                content: i18next.t("bcnn.error.isInvalidNumber")
            });
        } 
        else if (isNaN(number1) || isNaN(number2)) {
            return message.channel.send({
                content: i18next.t("bcnn.error.isNotInteger")
            });
        }

        const resultBcnn = getBcnn(number1,number2);

        const embed = {
            color: 0x3399ff,
            title: i18next.t("bcnn.title"),
            fields: [
                {
                    name: i18next.t("bcnn.fields.numberInput1"),
                    value: codeBlock(number1),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.numberInput2"),
                    value: codeBlock(number2),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.resultOutput"),
                    value: codeBlock(resultBcnn)
                }
            ],
            footer: {
                text: message.author.username,
                icon_url: message.author.displayAvatarURL({size: 64})
            },
            timestamp: new Date().toISOString()
        };

        await message.channel.send({embeds: [embed]});
    },
    
    async executeChatInput(interaction) {
        const number1 = interaction.options.getNumber("number_1",true);
        const number2 = interaction.options.getNumber("number_2",true);

        const resultBcnn = getBcnn(number1,number2);

        const embed = {
            color: 0x3399ff,
            title: i18next.t("bcnn.title"),
            fields: [
                {
                    name: i18next.t("bcnn.fields.numberInput1"),
                    value: codeBlock(number1),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.numberInput2"),
                    value: codeBlock(number2),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.resultOutput"),
                    value: codeBlock(resultBcnn)
                }
            ],
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL({size: 64})
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({embeds: [embed]});
    },

    registerApplicationCommands(commands) {
        commands.push({
            name: this.name,
            description: this.description,
            options: [
                {
                    required: true,
                    name: "number_1",
                    type: 10,
                    description: "Cho con số thứ nhất vào đây"
                },
                {
                    required: true,
                    name: "number_2",
                    type: 10,
                    description: "Cho con số thứ hai vào đây",
                }
            ]
        })
    }
}