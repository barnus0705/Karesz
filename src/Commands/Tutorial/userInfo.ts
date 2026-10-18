import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("userinfo").setDescription("Replies with user information!"),
        async execute(interaction: any) {
        const user = interaction.user;
        await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
    }
};