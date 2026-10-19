import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import { getRulebooks } from "../../BGG/Get/rulebooks";
import { createRulebookEmbed } from "../../BGG/Model/ruleBookModel";

export default {
    data: new SlashCommandBuilder()
        .setName("boardgamedesc")
        .setDescription("Get the description of a board game")
        .addStringOption(option =>
            option.setName("board_game_name")
                .setDescription("The name of the board game")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
       const boardGameName = interaction.options.getString("board_game_name", true);
       const rulebooks = await getRulebooks(boardGameName);
       const embeds = rulebooks.map(createRulebookEmbed);
        await interaction.reply({ embeds });
    }
};