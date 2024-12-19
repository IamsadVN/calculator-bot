import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";
import { limitStrLength } from "../../utils/limitStrLength.js";


export default {
    name: "bcnn",
    aliases: ["lcm"],
    description: "Tìm bội chung nhỏ nhất của 2 số",
 
    
    async executeMessage(message,args,i18next) {
        const language = await getLang(message);
        
        const numbers = [];

        if(args.length > 1) {
            for(const arg of args) {
                if (arg.includes(",")) {
                    return message.channel.send({
                        content: i18next.t("bcnn.error.isInvalidInput",{lng:language})
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
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("bcnn.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("bcnn.fields.numbersInput",{lng: language}),
                    value: codeBlock(limitStrLength(numbers.join(","),1014)),
                    inline: true
                },
                {
                    name: i18next.t("bcnn.fields.resultOutput",{lng: language}),
                    value: codeBlock(lcm(numbers))
                }
            ])
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL({size:64})
            })
            .setTimestamp(new Date())
        
        
        await message.channel.send({embeds: [embed]});
    },
    
    async executeChatInput(interaction,i18next) {
        const language = await getLang(interaction);
        
        const args = interaction.options.getString("numbers",true).split(",");

        const numbers = [];
        
        if (args.length < 2) {
            return interaction.reply({
                content: i18next.t("bcnn.error.isInvalidInput",{lng:language}),
                ephemeral: true
            });
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
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("bcnn.title",{lng: language}))
            .setFields([
                {
                    name: i18next.t("bcnn.fields.numbersInput",{lng: language}),
                    value: codeBlock(limitStrLength(numbers.join(","),1014))
                },
                {
                    name: i18next.t("bcnn.fields.resultOutput",{lng: language}),
                    value: codeBlock(lcm(numbers))
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({size: 64})
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
                option.setName("numbers")
                .setDescription("Những con số cần tính")
                .setRequired(true)
            )
        )
    }
}

/**
 * Get least common multiple
 * @param {number[]} numbers An array of the numbers
 * @returns {number}
 */
function lcm(numbers) {
    function gcd(a,b) {
        if (b==0) return a;
        
        return gcd(b,a % b);
    }

    return numbers.reduce((a,b) => a * b / gcd(a,b));
}