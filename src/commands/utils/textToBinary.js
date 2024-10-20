import { codeBlock } from "discord.js";

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

    async executeMessage(message,args) {
        const inputText = args.join(" ");

        const embed = {
            color: 0x3399ff,
            title: "Text To Binary",
            fields: [
                {
                    name: "Text:",
                    value: codeBlock(inputText)
                },
                {
                    name: "Result:",
                    value: codeBlock(textToBinary(inputText))
                }
            ],
            footer: {
                text: message.author.username,
                icon_url: message.author.displayAvatarURL({size: 64})
            },
            timestamp: new Date().toISOString()
        };

        await message.channel.send({
            embeds: [embed]
        })
    },

    async executeChatInput(interaction) {
        const inputText = interaction.options.getString("input");

        const embed = {
            color: 0x3399ff,
            title: "Text To Binary",
            fields: [
                {
                    name: "Text:",
                    value: codeBlock(inputText)
                },
                {
                    name: "Result:",
                    value: codeBlock(textToBinary(inputText))
                }
            ],
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL({size: 64})
            },
            timestamp: new Date().toISOString()
        };

        await interaction.reply({
            embeds: [embed]
        })
    },

    registerApplicationCommands(commands) {
        commands.push({
            name: this.name,
            description: this.description,
            options: [
                {
                    required: true,
                    name: "input",
                    type: 3,
                    description: "Hãy nhập ký tự vào đây"
                }
            ]
        })
    }
}