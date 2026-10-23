import { SlashCommandBuilder } from "discord.js";
import type { CommandInteraction } from "discord.js";

import { ruleBookModal } from "./Modal/ruleBookModal";

export default {
    data: new SlashCommandBuilder()
        .setName("post-rulebook")
        .setDescription("Post the rulebooks of a board game"),

    async execute(interaction: CommandInteraction) {
        await interaction.showModal(ruleBookModal);
        await interaction.followUp({ content: "Please fill out the rulebook.", 
                                     ephemeral: true
        });
    },
};