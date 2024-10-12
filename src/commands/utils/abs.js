import { codeBlock } from "discord.js";

export default {
    name: "abs",
    description: "Lệnh dùng để trị tuyệt đối 1 số",

    async executeMessage(message,args) {
        //console.log(message.author.avatar);
        const numberInput = args[0];
        const embedSend = {
            color: 0x3399ff,
            title: 'Trị tuyệt đối của 1 số',
            fields: [
                {
                    name: 'Số:',
                    value: `${codeBlock("txt",numberInput)}`,
                    inline: false,
                },
                {
                    name: 'Kết quả:',
                    value: `${codeBlock("txt",Math.abs(numberInput))}`,
                    inline: false,
                }
            ],
            footer: {
                text: `${message.author.username}`,
                icon_url: `${message.author.displayAvatarURL()}`,
            },  
            timestamp: new Date().toISOString(),    
        };

        await message.channel.send({
            embeds: [embedSend],
        });
    },

    async executeChatInput(interaction) {
        const numberInput = interaction.options.getNumber("number");
        const embedSend = {
            color: 0x3399ff,
            title: 'Trị tuyệt đối của 1 số',
            fields: [
                {
                    name: 'Số:',
                    value: `${codeBlock("txt",numberInput)}`,
                    inline: false,
                },
                {
                    name: 'Kết quả:',
                    value: `${codeBlock("txt",Math.abs(numberInput))}`,
                    inline: false,
                }
            ],
            footer: {
                text: `${interaction.user.tag}`,
                icon_url: `${interaction.user.displayAvatarURL({size: 64})}`,
            },  
            timestamp: new Date().toISOString(),    
        };

        await interaction.reply({embeds: [embedSend]});
    },
    

    registerApplicationCommands(commands) {
        commands.push( 
            {
                name: this.name,
                description: this.description,
                options: [
                    {
                        name: "number",
                        type: 10,
                        description: "Vui lòng cho 1 số vào đây",
                    }
                ]
            }
        );
    }
}