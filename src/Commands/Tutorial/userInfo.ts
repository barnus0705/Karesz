import { SlashCommandBuilder } from "discord.js";
import type { CommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("userinfo").setDescription("Replies with user information!"),
        async execute(interaction: CommandInteraction) {
        const user = interaction.user;
        await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
    }
};