"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder().setName("userinfo").setDescription("Replies with user information!"),
    async execute(interaction) {
        const user = interaction.user;
        await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
    }
};
