import langOfEachGuild from "../../../schemas/LangOfGuild.js";

export default {
    name: 'language',
    description: 'Chỉnh ngôn ngữ cho máy chủ - Change the language (Only using ISO-639)',
    aliases: ["lang"],

    async executeMessage(message,args) {
        const typeLang = args[0];
        let guildToChangeLang = await langOfEachGuild.findOne({
            guildID: message.guild.id
        });

        if (!guildToChangeLang) {
            guildToChangeLang = new langOfEachGuild({
                guildID: message.guild.id
            });
        }

        guildToChangeLang.lang = typeLang;
        await guildToChangeLang.save();

        message.channel.send("Thay đổi ngôn ngữ thành công")
    },

    async executeChatInput(interaction) {
        const typeLang = interaction.options.getString("type");

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
        guildToChangeLang.lang = typeLang;
        
        await guildToChangeLang.save();

        interaction.editReply(`Đã chỉnh ngôn ngữ thành công`);
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