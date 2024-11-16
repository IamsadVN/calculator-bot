import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { getLang } from "../../../function/getLang.js"

export default {
    name: "average",
    aliases: ["tb"],
    description: "Tìm trung bình của nhiều số",

    async executeMessage(message,args,i18next) {
        const language = await getLang(message.guild.id);
        let numbers = new Array();

        //Nếu arr có length > 1 thì có nghĩa: "1 2 3 4 5 6"
        if (args.length > 1) {
            args.forEach((arg) => {
                if (arg.includes(",")) {
                    //Nếu nhập cả 2 loại thì bỏ
                    return message.channel.send({
                        content: i18next.t("average.error.wrongInput",{lng: language})
                    });
                }
                else {
                    numbers.push(Number(arg));
                }
            })
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
                    value: codeBlock(args[0])
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
        const language = await getLang(interaction.guildId);
        /**
         * @type {string}
         */
        const input = interaction.options.getString("input",true).trim();
        let numbers = new Array();

        if (input.includes(",") && input.includes(" ")) {
            return interaction.reply({
                content: i18next.t("average.error.wrongInput",{lng: language}),
                ephemeral: true
            })
        }
        else {
            if (input.includes(",")) {
                input.split(",").forEach((num) => {
                    numbers.push(num);
                })
            }
            else if (input.includes(" ")) {
                input.split(" ").forEach((num) => {
                    numbers.push(num);
                })
            }
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

/**
 * Get the average of these number
 * @param {number[]} numbers An Array of numbers
 * @returns 
 */
function getAverage(numbers) {
    let result = 0;
    numbers.forEach((number) => {
        result += number;
    })
    return result / numbers.length;
}