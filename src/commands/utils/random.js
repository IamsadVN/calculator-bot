import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { getLang } from "../../utils/getLang.js";

export default {
    name: "random",
    description: "Random 1 con số nào đó",
    aliases: ["ran", "rand"],

    async executeMessage(message, args, i18next) {
        const language = await getLang(message);

        await message.channel.send({
            content: i18next.t("random.error.onlySupportSlashCommand",{lng: language})
        })
    },

    async executeChatInput(interaction, i18next) {
        const typeRandom = interaction.options.getString("type", true);
        const min = interaction.options.getNumber("min") || 0;
        const max = interaction.options.getNumber("max", true);
        const amount = interaction.options.getNumber("amount") || 1;

        const language = await getLang(interaction);

        if (min >= max) {
            return interaction.reply({
                content: i18next.t("random.error.minGreaterThanMax",{lng: language}),
                ephemeral: true
            })
        }

        let result = formattedNumber(getRandValue(typeRandom, min, max, amount));


        if (result.length >= 1024) {
            result = result.slice(0, 1012) + "...";
        }

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("random.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("random.fields.typeInput",{lng: language}),
                    value: codeBlock(typeRandom),
                    inline: true
                },
                {
                    name: i18next.t("random.fields.minInput",{lng: language}),
                    value: codeBlock(min),
                    inline: true
                },
                {
                    name: i18next.t("random.fields.maxInput",{lng: language}),
                    value: codeBlock(max),
                    inline: true
                },
                {
                    name: i18next.t("random.fields.amountInput",{lng: language}),
                    value: codeBlock(amount),
                    inline: true
                },
                {
                    name: i18next.t("random.fields.resultOutput",{lng: language}),
                    value: codeBlock(result),
                    inline: false
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ size: 64 })
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
                option.setName("type")
                    .setDescription("Loại số mà bạn muốn Random")
                    .setAutocomplete(true)
                    .setRequired(true)
            )
            .addNumberOption(option =>
                option.setName("max")
                    .setDescription("Con số lớn nhất để Random")
                    .setRequired(true)
                    .setMaxValue(1_000_000_000)
            )
            .addNumberOption(option =>
                option.setName("min")
                    .setDescription("Con số nhỏ nhất để Random")
                    .setRequired(false)
                    .setMinValue(-1_000_000_000)
            )
            .addNumberOption(option =>
                option.setName("amount")
                    .setDescription("Số lượng con số mà bạn muốn Random")
                    .setRequired(false)
                    .setMaxValue(100)
            )
        )
    },

    async executeAutocomplete(interaction, i18next) {
        const language = await getLang(interaction);

        const focusValue = interaction.options.getFocused();

        const choices = i18next.t("random.autocomplete.choices", { returnObjects: true, lng: language });

        const filtered = choices.filter(choice => choice.name.startsWith(focusValue));

        await interaction.respond(
            filtered.map(choice => ({ name: choice.name, value: choice.value }))
        )
    }
}

/**
 * 
 * @param {string} type Loại số cần Random
 * @param {number} min Số nhỏ nhất để Random
 * @param {number} max Số lớn nhất để Random
 * @param {number} amount Số lượng cần Random
 * @returns {number[]} Con số đã random
 */
function getRandValue(type, min, max, amount) {
    let arrResult = new Array();

    if (type === "decimal") {
        if (min === 0) {
            for (let i = 1; i <= amount; i++) {
                arrResult.push(Math.random() * max);
            }
        }
        else {
            for (let i = 1; i <= amount; i++) {
                arrResult.push(Math.random() * (max - min + 1) + min);
            }
        }
    }
    else if (type === "integer") {
        if (min === 0) {
            for (let i = 1; i <= amount; i++) {
                arrResult.push(Math.floor(Math.random() * max));
            }
        }
        else {
            for (let i = 1; i <= amount; i++) {
                arrResult.push(Math.floor(Math.random() * (max - min + 1) + min));
            }
        }
    }

    return arrResult;
}

/**
 * 
 * @param {number[]} numbers 
 * @returns {string}
 */
function formattedNumber(numbers) {
    return numbers.map(number => Number(number.toFixed(3)).toLocaleString("en-US",{
        useGrouping: false
    })).join(", ");
}   