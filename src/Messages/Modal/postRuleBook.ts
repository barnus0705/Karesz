import { Events } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import encrypt from "../../Configs/chipher";
import { ExtendedClient } from "../../Configs/client";
import { Rulebook } from "../../BGG/Model/ruleBookModel";


export default function onRuleBookModal(client: ExtendedClient) {

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isModalSubmit() || interaction.customId !== "ruleBookModal") return;
        if (interaction.customId === "ruleBookModal") {
            const filePath = path.resolve(__dirname, "../../Data/offChartBGs.json");
            let link = interaction.fields.getTextInputValue("rulebookLink");
            const boardGameName = interaction.fields.getTextInputValue("boardGameName");
            const linkLogic = [".pdf"].every(substring => link.includes(substring));
            if(linkLogic){ 
                link = await encrypt(link, boardGameName);
            }else{
                interaction.reply({ content: "Invalid link. Please provide a valid HTTP PDF link.", ephemeral: true });
                return;
            }
            
            const data: Rulebook = {
                id: boardGameName.includes(" ") ? 
                    boardGameName.trim().replace(/\s+/g, "-").toLocaleLowerCase() : //true
                    boardGameName.toLocaleLowerCase(), //false

                name: boardGameName,
                lowName: boardGameName.toLowerCase(),
                link: link,
                language: interaction.fields.getTextInputValue("language")
            };




            const fileData = JSON.parse(await readFile(filePath, "utf-8"));
            fileData.BoardGames.push(data);
            await writeFile(filePath, JSON.stringify(fileData, null, 2));

            await interaction.reply({ content: "Rulebook added successfully!", ephemeral: true });
        }

    });
}