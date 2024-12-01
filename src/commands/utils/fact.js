import { codeBlock, Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";

export default {
    name: "fact",
    description: "Phân tích 1 số ra thừa số nguyên tố",

    async executeMessage(message, args, i18next) {
        const number = Number(args[0]);
        const language = await getLang(message.guild.id)

        if (number > 9007199254740991) {
            return message.channel.send(i18next.t("fact.error.numberTooLarge",{lng: language}));
        }
        else if (!Number.isInteger(number)) {
            return message.channel.send(i18next.t("fact.error.isNotInteger",{lng: language}))
        }

        const factors = primeFactorization(number);
        const formattedResult = formatFactors(factors);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("fact.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("fact.fields.numberInput",{lng: language}),
                    value: codeBlock(number)
                },
                {
                    name: i18next.t("fact.fields.resultOutput",{lng: language}),
                    value: codeBlock(formattedResult)
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp(new Date())

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction, i18next) {
        const number = interaction.options.getInteger("input");
        const language = await getLang(interaction.guildId)

        if (number > 9007199254740991) {
            await interaction.reply({
                content: i18next.t("fact.error.numberTooLarge",{lng: language}),
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply();

        const factors = primeFactorization(number);
        const formattedResult = formatFactors(factors);

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("fact.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("fact.fields.numberInput",{lng: language}),
                    value: codeBlock(number)
                },
                {
                    name: i18next.t("fact.fields.resultOutput",{lng: language}),
                    value: codeBlock(formattedResult)
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp(new Date())

        await interaction.editReply({
            embeds: [embed]
        });
    },

    registerApplicationCommands(commands) {
        commands.push(new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setContexts([0,2])
            .setIntegrationTypes([0,1])
            .addIntegerOption(option =>
                option.setName("input")
                    .setDescription("Input here")
                    .setRequired(true)
            )
        )
    }
}


//Hàm để kiểm tra có phải là snt không 
function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    let i = 5;
    while (i * i <= n) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
        i += 6;
    }

    return true;
}
//Hàm thực thi các snt
function primeFactorization(number) {
    let factors = [];

    while (number % 2 === 0) {
        factors.push(2);
        number /= 2;
    }

    for (let i = 3; i * i <= number; i += 2) {
        while (number % i === 0 && isPrime(i)) {
            factors.push(i);
            number /= i;
        }
    }

    if (number > 2 && isPrime(number)) {
        factors.push(number);
    }

    return factors;
}
//Hàm chuyển format từ dạng 1,2,4 sang 1*2*3^4
function formatFactors(factors) {
    let result = '';
    let currentFactor = factors[0];
    let count = 1;

    for (let i = 1; i < factors.length; i++) {
        if (factors[i] === currentFactor) {
            count++;
        } else {
            result += `${currentFactor}${count > 1 ? `^${count}` : ''} * `;
            currentFactor = factors[i];
            count = 1;
        }
    }

    result += `${currentFactor}${count > 1 ? `^${count}` : ''}`;

    return result;
}
