export default {
    name: `avatar`,
    description: "Xem anh dai dien cua nguoi dung",
    aliases: ["av","avt","profile","pfp"],

    async executeMessage(message, args) {
        const userID = args[0]?.match(/[0-9]+/)?.[0];
        const user = await message.client.users
            .fetch(userID)
            .catch(() => message.author);

        await message.channel.send({
            embeds: [
                {
                    image: { url: user.displayAvatarURL({ size: 4096 }) },
                }
            ],

        });
    },

    async executeChatInput(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        await interaction.reply({
            embeds: [
                {
                    image: { url: user.displayAvatarURL({ size: 4096 }) },
                }
            ],
        });
    },

    registerApplicationCommands(commands) {
        commands.push(
            {
                name: this.name,
                description: this.description,
                options: [
                    {
                        name: "user",
                        type: 6,
                        description: "Xem avatar nguoi dung",
                    }
                ]
            }
        );
    }
}