import langOfEachGuild from "../../../schemas/LangOfGuild.js";

export default {
    name: 'language',
    description: 'Chỉnh ngôn ngữ của máy tính - Change the language (Only using ISO-639)',
    aliases: ["lang"],

    async executeMessage(message,args,i18next) {
        const langCode = args[0];

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

        message.channel.send(i18next.t("lang.changedLang"))
    },

    async executeChatInput(interaction,i18next) {
        const langCode = interaction.options.getString("type");

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

        interaction.editReply(i18next.t("lang.changedLang"));
    },

    registerApplicationCommands(commands) {
        commands.push(
            {
                name: this.name,
                description: this.description,
                options: [
                    {
                        required: true,
                        name: "type",
                        type: 3,
                        autocomplete: true,
                        description: this.description
                    }
                ]
            }
        );
    },
    
    async autocomplete(interaction) {
        const focusValue = interaction.options.getFocused();
        const choices = ["vi","en"];
        const filtered = choices.filter(choice => choice.startsWith(focusValue));

        await interaction.respond(
            filtered.map(choice => ({
                name: choice,
                value: choice
            }))
        );
    }
}