import { Events } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";

import { ExtendedClient } from "../../Configs/client";
import { Rulebook } from "../../BGG/Model/ruleBookModel";


export default function onRuleBookModal(client: ExtendedClient) {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isModalSubmit() || interaction.customId !== "ruleBookModal") return;
        if (interaction.customId === "ruleBookModal") {
            const filePath = path.resolve(__dirname, "../../Data/offChartBGs.json");
            
            const data: Rulebook = {
                id: interaction.fields.getTextInputValue("boardGameName").includes(" ") ? 
                    interaction.fields.getTextInputValue("boardGameName").trim().replace(/\s+/g, "-").toLocaleLowerCase() : //true
                    interaction.fields.getTextInputValue("boardGameName").toLocaleLowerCase(), //false

                name: interaction.fields.getTextInputValue("boardGameName"),
                lowName: interaction.fields.getTextInputValue("boardGameName").toLowerCase(),
                link: interaction.fields.getTextInputValue("rulebookLink"),
                language: interaction.fields.getTextInputValue("language")
            };

            const fileData = JSON.parse(await readFile(filePath, "utf-8"));
            fileData.BoardGames.push(data);
            await writeFile(filePath, JSON.stringify(fileData, null, 2));

            await interaction.reply({ content: "Rulebook added successfully!", ephemeral: true });
        }

    });
}