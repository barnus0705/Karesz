import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import type { Rulebook } from "../../Plugins/BGG/Model/ruleBookModel";

import { getRulebooks } from "../../Plugins/BGG/Get/ruleBooks";
import { createRulebookEmbed } from "../../Plugins/BGG/Model/ruleBookModel";

export default {
    data: new SlashCommandBuilder()
        .setName("bg-rulebooks")
        .setDescription("Get the rulebooks of a board game")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("The name of the board game")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
       const boardGameName = interaction.options.getString("name", true);
       const rulebooks = await getRulebooks(boardGameName);
       const embeds = await Promise.all(
           rulebooks.map((rulebook: Rulebook) => createRulebookEmbed(rulebook))
       );

        // Discord allows at most 10 embeds per message
        for (let i = 0; i < embeds.length; i += 10) {
            const batch = embeds.slice(i, i + 10);

            if (i === 0) {
                await interaction.reply({ embeds: batch });
            } else {
                await interaction.followUp({ embeds: batch });
            }
        }
    }
};