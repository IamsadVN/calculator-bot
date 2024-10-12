import { codeBlock } from "discord.js";

export default {
    name: "fact",
    description: "Phân tích 1 số ra thừa số nguyên tố",
    
    async executeMessage(message,args) {
        const number = Number(args[0]);

        if (number > 9007199254740991) {
            await message.channel.send("Con số lớn đến nỗi JavaScript đe'o thể lưu vào và hỗ trợ nó, vui lòng chọn con số nào nhỏ giúp!");
            return;
        }

        const factors = primeFactorization(number);
        const formattedResult = formatFactors(factors);

        const embed = {
            color: 0x3399ff,
            title: "Phân tích 1 số sang thừa số nguyên tố",
            fields: [
                {
                    name: "Input:",
                    value: codeBlock(number)
                },
                {
                    name: "Result:",
                    value: codeBlock(formattedResult)
                }
            ],
            footer: {
                text: message.author.username,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await message.channel.send({
            embeds: [embed]
        });
    },

    async executeChatInput(interaction) {
        const number = interaction.options.getNumber("input");

        if (number > 9007199254740991) {
            await interaction.reply({
                content: "Con số lớn đến nỗi JavaScript đe'o thể lưu vào và hỗ trợ nó, vui lòng chọn con số nào nhỏ giúp!",
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply();

        const factors = primeFactorization(number);
        const formattedResult = formatFactors(factors);

        const embed = {
            color: 0x3399ff,
            title: "Phân tích 1 số sang thừa số nguyên tố",
            fields: [
                {
                    name: "Input:",
                    value: codeBlock(number)
                },
                {
                    name: "Result:",
                    value: codeBlock(formattedResult)
                }
            ],
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL()
            },
            timestamp: new Date().toISOString()
        };

        await interaction.editReply({
            embeds: [embed]
        });
    },

    registerApplicationCommands(commands) {
        commands.push({
            name: this.name,
            description: this.description,
            options: [
                {
                    required: true,
                    name: "input",
                    type: 10,
                    description: "Input Here"
                }
            ]
        })
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
