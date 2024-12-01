import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getLang } from "../../utils/getLang.js";

export default {
    name: "converter",
    description: "Chuyển đổi 1 giá trị số từ đơn vị này sang đơn vị khác",

    async executeMessage(message,args,i18next) {
    },

    async executeChatInput(interaction,i18next) {
        const language = await getLang(interaction.guildId);
        const categories = i18next.t("converter.autocomplete.categories",{lng:language,returnObjects:true});

        const categoryValue = interaction.options.getString("category",true);
        const typeValue = interaction.options.getString("type",true);
        const number = interaction.options.getNumber("number",true);
        
        const category = categories.find(element => element.value === categoryValue);
        const typeName = category.type.find(element => element.value === typeValue).name;
        const categoryName = category.name;

        const embed = new EmbedBuilder()
            .setColor(Number(process.env.CALC))
            .setTitle(i18next.t("converter.title",{lng:language}))
            .setFields([
                {
                    name: i18next.t("converter.fields.categoryName",{lng:language}),
                    value: codeBlock(categoryName),
                    inline: true
                },
                {
                    name: i18next.t("converter.fields.typeName",{lng:language}),
                    value: codeBlock(typeName),
                    inline: true
                },
                {
                    name: i18next.t("converter.fields.valueInput",{lng:language}),
                    value: codeBlock(number),
                    inline: false
                },
                {
                    name: i18next.t("converter.fields.valueOutput",{lng:language}),
                    value: codeBlock(getConvertedValue(categoryValue,typeValue,number)),
                    inline: true
                }
            ])
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({size:64})
            })
            .setTimestamp(new Date())

        await interaction.reply({
            embeds: [embed]
        })
    },

    registerApplicationCommands(commands) {
        commands.push(new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setContexts([0,2])
            .setIntegrationTypes([0,1])
            .addStringOption(option =>
                option.setName("category")
                    .setDescription("Danh mục để chuyển đổi")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option =>
                option.setName("type")
                    .setDescription("Đơn vị để chuyển đổi")
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addNumberOption(option =>
                option.setName("number")
                    .setDescription("Con số cần để chuyển đổi đơn vị")
                    .setRequired(true)
            )
        )
    },
    async autocomplete(interaction,i18next) {
        const language = await getLang(interaction.guildId);
        const focusedOption = interaction.options.getFocused(true);

        const categoriesChoices = i18next.t("converter.autocomplete.categories",{lng:language,returnObjects:true});

        let choices;

        if (focusedOption.name === "category") {
            choices = categoriesChoices;
        }
        if (focusedOption.name === "type") {
            const categoriesName = interaction.options.getString("category",true);

            const category = categoriesChoices.find(element => element.value === categoriesName);

            choices = category.type;
        }

        const filtered = choices.filter(choice => choice.name.startsWith(focusedOption.value));

        await interaction.respond(
            filtered.map(choice => ({
                name: choice.name,
                value: choice.value
            }))
        );
    },
}

/**
 * Dung de chuyen doi 1 gia tri
 * @param {string} category Danh muc de chuyen doi
 * @param {string} type Loai can de chuyen doi gia tri
 * @param {number} value Con so dung de chuyen doi gia tri
 * @returns {number}
 */

function getConvertedValue(category, type, value) {
    switch (category) {
        case "length": {
            switch (type) {
                case "in_to_cm": return value * 2.54; // inch to centimeter
                case "cm_to_in": return value / 2.54; // centimeter to inch
                case "ft_to_m": return value * 0.3048; // feet to meter
                case "m_to_ft": return value / 0.3048; // meter to feet
                case "yd_to_m": return value * 0.9144; // yard to meter
                case "m_to_yd": return value / 0.9144; // meter to yard
                case "mile_to_km": return value * 1.609344; // mile to kilometer
                case "km_to_mile": return value / 1.609344; // kilometer to mile
                case "nauticalmile_to_m": return value * 1852; // nautical mile to meter
                case "m_to_nauticalmile": return value / 1852; // meter to nautical mile
                case "pc_to_km": return value * 30.857e12; // parsec to kilometer
                case "km_to_pc": return value / 30.857e12; // kilometer to parsec
            }
        }
        case "area": {
            switch (type) {
                case "acre_to_m2": return value * 4046.8564; // acre to square meter
                case "m2_to_acre": return value / 4046.8564; // square meter to acre
            }
        }
        case "volume": {
            switch (type) {
                case "gal(us)_to_l": return value * 3.78541; // US gallon to liter
                case "l_to_gal(us)": return value / 3.78541; // liter to US gallon
                case "gal(uk)_to_l": return value * 4.54609; // UK gallon to liter
                case "l_to_gal(uk)": return value / 4.54609; // liter to UK gallon
            }
        }
        case "mass": {
            switch (type) {
                case "oz_to_g": return value * 28.3495; // ounce to gram
                case "g_to_oz": return value / 28.3495; // gram to ounce
                case "lb_to_kg": return value * 0.453592; // pound to kilogram
                case "kg_to_lb": return value / 0.453592; // kilogram to pound
            }
        }
        case "velocity": {
            switch (type) {
                case "km/h_to_m/s": return value * (1000 / 3600); // kilometer per hour to meter per second
                case "m/s_to_km/h": return value * (3600 / 1000); // meter per second to kilometer per hour
            }
        }
        case "pressure": {
            switch (type) {
                case "atm_to_Pa": return value * 101325; // standard atmosphere to pascal
                case "Pa_to_atm": return value / 101325; // pascal to standard atmosphere
                case "mmHg_to_Pa": return value * 133.322; // millimeter of mercury to pascal
                case "Pa_to_mmHg": return value / 133.322; // pascal to millimeter of mercury
                case "kgf/cm2_to_Pa": return value * 98066.5; // kilogram-force per square centimeter to pascal
                case "Pa_to_kgf/cm2": return value / 98066.5; // pascal to kilogram-force per square centimeter
                case "lbf/in2_to_kPa": return value * 6.89476; // pound-force per square inch to kilopascal
                case "kPa_to_lbf/in2": return value / 6.89476; // kilopascal to pound-force per square inch
            }
        }
        case "energy": {
            switch (type) {
                case "kgf-m_to_J": return value * 9.80665; // kilogram-force meter to joule
                case "J_to_kgf-m": return value / 9.80665; // joule to kilogram-force meter
                case "J_to_cal": return value * 0.238902; // joule to calorie
                case "cal_to_J": return value / 0.238902; // calorie to joule
            }
        }
        case "power": {
            switch (type) {
                case "hp_to_kW": return value * 0.7457; // horsepower to kilowatt
                case "kW_to_hp": return value / 0.7457; // kilowatt to horsepower
            }
        }
        case "temperature": {
            switch (type) {
                case "F_to_C": return (value - 32) / (9/5); // Fahrenheit to Celsius
                case "C_to_F": return (value * 9/5) + 32; // Celsius to Fahrenheit
            }
        }
    }
}