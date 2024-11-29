import { SlashCommandBuilder } from "discord.js";
import langOfEachGuild from "../../../schemas/LangOfGuild.js";
import { getLang } from "../../utils/getLang.js";

export default {
    name: 'language',
    description: 'Chỉnh ngôn ngữ của máy tính - Change the language (Only using ISO-639)',
    aliases: ["lang"],

    async executeMessage(message, args, i18next) {
        const langCode = args[0];
        const language = await getLang(message.guild.id)

        let guildToChangeLang = await langOfEachGuild.findOne({
            guildID: message.guild.id
        });

        if (!guildToChangeLang) {
            guildToChangeLang = new langOfEachGuild({
                guildID: message.guild.id
            });
        }

        guildToChangeLang.lang = langCode;
        await guildToChangeLang.save();

        message.channel.send(i18next.t("lang.changedLang", { language: langCode, lng: language }))
    },

    async executeChatInput(interaction, i18next) {
        const langCode = interaction.options.getString("lang");

        const language = await getLang(interaction.guildId)

        await interaction.deferReply();

        let guildToChangeLang = await langOfEachGuild.findOne({
            guildID: interaction.guild.id,
        });
        //Check xem guildID đã có hay chưa, nếu chưa
        //Thì tạo 
        if (!guildToChangeLang) {
            guildToChangeLang = new langOfEachGuild({
                guildID: interaction.guild.id
            })
        }
        //Có nghĩa rằng sau khi check xem đã có hay chưa, giờ
        //Sẽ add thêm lang vào
        guildToChangeLang.lang = langCode;

        await guildToChangeLang.save();

        interaction.editReply(i18next.t("lang.changedLang", {language: langCode, lng: language }));
    },

    registerApplicationCommands(commands) {
        commands.push(new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addStringOption(option =>
                option.setName("lang")
                    .setDescription("Ngôn ngữ mà bạn muốn thay đổi")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
        );
    },

    async autocomplete(interaction, i18next) {
        const language = await getLang(interaction.guildId)
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