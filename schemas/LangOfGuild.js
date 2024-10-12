import { Schema, model } from "mongoose";

const langOfEachGuildSchema = new Schema({
    guildID: {
        type: String,
        required: true,
        index: true, //Tăng tốc độ tìm kiếm (maybe)
        unique: true //Đảm bảo là guildID là duy nhất 1 guild
    },
    lang: {
        type: String,
        required: true,
        default: 'vi',
        enum: ['vi','en']
    }
});

export default model('LangOfEachGuild',langOfEachGuildSchema);