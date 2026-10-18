import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { REST, Routes } from "discord.js";
import { Enviroment } from "./Configs/enviroment";

const rest = new REST().setToken(Enviroment.BOT_TOKEN as string);
const commands = [];
const commandDirectory = path.join(__dirname, "Commands");
const commandFolders = fs.readdirSync(commandDirectory, { withFileTypes: true })
                            .filter(folder => folder.isDirectory());

(async () => {
    try {
        for (const folder of commandFolders) {
            const commandPath = path.join(commandDirectory, folder.name);
            const commandFiles = fs.readdirSync(commandPath, { withFileTypes: true })
                                   .filter(file => file.isFile());
            for (const file of commandFiles) {
                const commandFilePath = path.join(commandPath, file.name);
                const command = await import(pathToFileURL(commandFilePath).href);

                const commandData = command?.default?.data;
                if (commandData && typeof commandData.toJSON === "function") {
                    commands.push(commandData.toJSON());
                } else {
                    console.warn(`Command at ${commandFilePath} is missing default-exported data with toJSON().`);
                }
            }
        }

        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Routes.applicationGuildCommands(
                Enviroment.CLIENT_ID as string,
                Enviroment.GUILD_ID as string
            ),
            {
                body: commands
            }).then(() => {
                console.log(`Successfully Loaded application (/) commands Amount: ${commands.length}.`);
            });
    } catch (error) {
        console.error(error);
    }
})();