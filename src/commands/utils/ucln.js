import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { getLang } from "../../utils/getLang.js";
import { limitStrLength } from "../../utils/limitStrLength.js";

export default {
    name: "ucln",
    aliases: ["gcd"],
    description: "Tìm Ước Chung Lớn nhất của 2 số",

    async executeMessage(message,args,i18next) {
        const language = await getLang(message);
        let numbers = [];

        if (args.length > 1) {
            for (const arg of args) {
                if (arg.includes(",")) {
                    return message.channel.send({
                        content: i18next.t("ucln.error.isInvalidInput",{lng:language})
                    });
                }
                else {
                    const current = Number(arg);
                    if (current < 0) continue;
                    if (!Number.isInteger(current)) continue;
                    numbers.push(current);
                }
            }
        }
        else {
            const temp = args[0].split(",");
            for (const arg of temp) {
                const current = arg.trim();
                if (!current) continue;
                const number = Number(current);
                if (isNaN(number)) continue;
                if (number < 0) continue;
                if (!Number.isInteger(number)) continue;
                numbers.push(number);
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(i18next.t("ucln.title",{lng: language}))
            .setColor(Number(process.env.CALC))
            .setFields([
                {
                    name: i18next.t("ucln.fields.numbersInput",{lng: language}),
                    value: codeBlock(limitStrLength(numbers.join(","),1014))
                },
                {
                    name: i18next.t("ucln.fields.resultOutput",{lng: language}),
                    value: codeBlock(gcd(numbers))
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
        const args = interaction.options.getString("numbers",true).split(",");
        const language = await getLang(interaction);

        const numbers = [];

        if (args.length < 2) {
            return interaction.reply({
                content: i18next.t("ucln.error.isInvalidInput"),
                ephemeral: true
            })
        }

        for (const arg of args) {
            const current = arg.trim();
            if (!current) continue;
            const number = Number(current);
            if (isNaN(number)) continue;
            if (number < 0) continue;
            if (!Number.isInteger(number)) continue;
            numbers.push(number);
        }

        const embed = new EmbedBuilder()
            .setTitle(i18next.t("ucln.title",{lng: language}))
            .setColor(Number(process.env.CALC))
            .setFields([
                {
                    name: i18next.t("ucln.fields.numbersInput",{lng: language}),
                    value: codeBlock(limitStrLength(numbers.join(","),1014))
                },
                {
                    name: i18next.t("ucln.fields.resultOutput",{lng: language}),
                    value: codeBlock(gcd(numbers))
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
                option.setName("numbers")
                    .setRequired(true)
                    .setDescription("Cho nhiều con số vào đây")
                    .setMaxLength(3_000)
            )
        )
    }
}

function gcd(numbers) {
    let result = numbers[0];

    for(let i=1;i < numbers.length;i++) {
        const current = numbers[i];
        let temp = Math.min(result,current);

        while (temp > 0) {
            if (current % temp === 0 && result % temp === 0) {
                break;
            }

            temp--;
        }
        result = temp;
    }

    return result;
}