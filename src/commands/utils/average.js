import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { getLang } from "../../utils/getLang.js"

export default {
    name: "average",
    aliases: ["tb"],
    description: "Tìm trung bình của nhiều số",

    async executeMessage(message,args,i18next) {
        const language = await getLang(message);
        let numbers = [];

        //Nếu arr có length > 1 thì có nghĩa: "1 2 3 4 5 6"
        if (args.length > 1) {
            for (const arg of args) {
                if (arg.includes(",")) {
                    await message.channel.send({
                        content: i18next.t("average.error.wrongInput",{lng: language})
                    });
                    break;
                }
                else {
                    numbers.push(Number(arg));
                }
            }
        }
        //Nếu không phải > 1 thì có nghĩa: "1,2,3,4,5,6"
        else {
            args[0].split(",").forEach((num) => {
                numbers.push(Number(num));
            })
        }

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("average.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("average.fields.argsInput",{lng:language}),
                    value: codeBlock(numbers)
                },
                {
                    name: i18next.t("average.fields.resultOutput",{lng: language}),
                    value: codeBlock(getAverage(numbers))
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL({size:64})
            })
            .setTimestamp(new Date())

        await message.channel.send({
            embeds: [embed]
        })
    },

    async executeChatInput(interaction,i18next) {
        const language = await getLang(interaction);

        const input = interaction.options.getString("input",true);
        let numbers = [];

        //Co nghia la "1,   2,, 354 ,4,3 "
        if (input.includes(",")) {
            numbers = input
                .split(",").map((num) => num.trim())
                .filter((num) => Boolean(num))
                .map((num) => Number(num));
        }
        //Co nghia la "       1    2     3     4      "
        else {
            numbers = input.trim().split(/ +/g).map((num) => Number(num));
        }

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("average.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("average.fields.argsInput",{lng:language}),
                    value: codeBlock(input)
                },
                {
                    name: i18next.t("average.fields.resultOutput",{lng: language}),
                    value: codeBlock(getAverage(numbers))
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({size:64})
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
            .addStringOption(option => 
                option.setName("input")
                    .setDescription("Nhập vào các con số ở đây")
                    .setRequired(true)
            )
        )
    }
}

function getAverage(numbers) {
    let result = 0;
    numbers.forEach((number) => {
        result += number;
    })
    return result / numbers.length;
}