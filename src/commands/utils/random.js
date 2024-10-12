import { codeBlock } from "discord.js";

export default {
    name: "random",
    description: "Random 1 con số nào đó",
    aliases: ["ran","rand"],

    async executeMessage(message,args) {
        const min = Number(args[0]);
        const max = Number(args[1]);

        const arr = [];
        

        const result = arr.join("\n");

        const embed = {
            color: 0x3399ff,
            title: "Random Number",
            fields: fieldsForEmbed(min,max,result),
            footer: {
                text: message.author.username,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        }

        await message.channel.send({
            embeds: [embed]
        })
    } 
}

function getRandValue(arr,min,max) {
    if (max === null || max === undefined) {
        for(let i = 1; i <= 10;i++) {
            arr.push(Math.random() * min)
        }

        const result = arr.join("\n");

        return result;
    }
    else {
        for(let i = 1; i <= 10;i++) {
            arr.push(Math.random() * (max - min + 1) + min)
        }

        const result = arr.join("\n");

        return result;
    }
}

function fieldsForEmbed(min,max,result) {
    if (max === undefined || max === null){
        return [
            {
                name: "Max:",
                value: codeBlock(min)
            },
            {
                name: "Result:",
                value: codeBlock(result)
            }
        ]
    }
    else {
        return [
            {
                name: "Min:",
                value: codeBlock(min),
                inline: true
            },
            {
                name: "Max:",
                value: codeBlock(max),
                inline: true
            },
            {
                name: "Result:",
                value: codeBlock(result)
            }
        ]
    }
}