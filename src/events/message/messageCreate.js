import { getLang } from "../../../function/getLang.js";
import { commandLog } from "../../../function/log.js";
import i18next from "i18next";

export default {
    name: "messageCreate",

    async execute(message) {
        if (message.author.bot || !message.guild) return;

        //Bien dung de ghi nho PREFIX bot
        const prefix = process.env.PREFIX;

        //Check xem noi dung USER gui co prefix o dau hay khong
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        const [name, ...args] = message.content
            .slice(prefix.length) //Xoa PREFIX o dau tin nhan
            .trim() //Xoa ky tu khoang trang thua o dau
            .split(/ +/g);

        //console.log(splitted);
        const command = message.client.commands.get(name.toLowerCase()) ||
                        message.client.commands.find((cmd) => cmd.aliases?.includes(name.toLowerCase()));

        if (!command) return;
        
        await command.executeMessage?.(message,args,i18next);
        
        commandLog(`${message.guild} / ${message.author.username}`,command.name,"Prefix");
    }
}