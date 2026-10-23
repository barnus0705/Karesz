import { Events } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { ExtendedClient } from "../../../Configs/client";
import type { Rulebook } from "../Model/ruleBookModel";
import { createRulebookEmbed } from "../Model/ruleBookModel";
import { isValidUrl } from "../Checks/url";
import { existingBoardGame } from "../Checks/exist";


export default function onRuleBookModal(client: ExtendedClient) {

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isModalSubmit() || interaction.customId !== "ruleBookModal") return;
        if (interaction.customId === "ruleBookModal") {
            const filePath = path.resolve(__dirname, "../../../Data/offChartBGs.json");
            let link: string | undefined = interaction.fields.getTextInputValue("rulebookLink");
            const boardGameName = interaction.fields.getTextInputValue("boardGameName");
            link = await isValidUrl(link, boardGameName, interaction);
            if (!link) return;
            
            const data: Rulebook = {
                id: boardGameName.includes(" ") ? 
                    boardGameName.trim().replace(/\s+/g, "-").toLocaleLowerCase() : //true
                    boardGameName.toLocaleLowerCase(), //false

                name: boardGameName,
                lowName: boardGameName.toLowerCase(),
                link: link,
                language: interaction.fields.getStringSelectValues("language")[0]
            };

            const fileData = JSON.parse(await readFile(filePath, "utf-8"));
            const existingBG = existingBoardGame(fileData, boardGameName);
            if (existingBG) {
                await interaction.reply({ content: "Rulebook already exists.", embeds: [await createRulebookEmbed(existingBG)] });
                return;
            }

            fileData.BoardGames.push(data);
            await writeFile(filePath, JSON.stringify(fileData, null, 2));

            await interaction.reply({ content: "Rulebook added successfully!", ephemeral: true });
        }

    });
}