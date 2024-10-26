import langOfEachGuild from "../schemas/LangOfGuild.js"

/**
 * 
 * @param {string} guildID 
 * @returns
 */

export async function getLang(guildID) {
    const findLang = await langOfEachGuild.findOne({
        guildID: guildID
    });

    if (findLang == null) return "vi";

    return findLang.lang;
}