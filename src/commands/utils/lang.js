import { SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";
import { ServerSetting, UserSetting } from "../../../database/schema.js";

export default {
    name: 'language',
    description: 'Chỉnh ngôn ngữ của máy tính - Change the language (Only using ISO-639)',
    aliases: ["lang"],

    /**
     * 
     * @param {import("discord.js").Message<true>} message 
     * @param {string[] | undefined} args 
     * @param {import("i18next").i18n} i18next 
     * @returns 
     */
    async executeMessage(message, args, i18next) {
        const langCode = args[0];
        const language = await getLang(message);

        if (langCode === undefined) {
            const serverLang = await new ServerSetting().getServerLang(message.guildId);
            await message.channel.send({
                content: i18next.t("lang.currentLang",{lng: language, currentLang: serverLang})
            });
            return;
        }
        else if (langCode.length > 2) {
            await message.channel.send({
                content: i18next.t("lang.error.isNotLangCode",{lng:language})
            });
            return;
        }

        await new ServerSetting().writeServerLang({
            servername: message.guild.name,
            serverid: message.guildId,
            serverlang: langCode,
            servermembers: message.guild.memberCount,
            serverowner: (await message.guild.fetchOwner(message.guild.ownerId)).user.username,
            serverownerid: message.guild.ownerId
        });

        message.channel.send(i18next.t("lang.changedLang", { language: langCode, lng: language }));
    },

    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     * @param {import("i18next").i18n} i18next 
     */
    async executeChatInput(interaction, i18next) {
        const langCode = interaction.options.getString("lang");
        const language = await getLang(interaction);

        await interaction.deferReply();

        if (interaction.inCachedGuild()) {
            await new ServerSetting().writeServerLang({
                serverid: interaction.guildId,
                serverlang: langCode,
                servermembers: interaction.guild.memberCount,
                servername: interaction.guild.name,
                serverowner: (await interaction.guild.fetchOwner(interaction.guild.ownerId)).user.username,
                serverownerid: interaction.guild.ownerId
            });
        }
        else {
            await new UserSetting().writeUserLang({
               userId: interaction.user.id,
               userlang: langCode,
               username: interaction.user.username
            });
        }

        interaction.editReply(i18next.t("lang.changedLang", {language: langCode, lng: language }));
    },

    registerApplicationCommands(commands) {
        commands.push(new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setContexts([0,2])
            .setIntegrationTypes([0,1])
            .addStringOption(option =>
                option.setName("lang")
                    .setDescription("Ngôn ngữ mà bạn muốn thay đổi")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
        );
    },

    async executeAutocomplete(interaction, i18next) {
        const language = await getLang(interaction)
        const focusValue = interaction.options.getFocused();
        const choices = i18next.t("lang.autocomplete.choices", { returnObjects: true, lng: language });
        const filtered = choices.filter(choice => choice.name.startsWith(focusValue));

        await interaction.respond(
            filtered.map(choice => ({
                name: choice.name,
                value: choice.value
            }))
        );
    }
}