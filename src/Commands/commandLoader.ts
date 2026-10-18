import fs from "fs";
import path from "path";

import { ExtendedClient } from "../Configs/client";

export function CommandLoader(Client: ExtendedClient) {
    const commandFolders = fs.readdirSync(__dirname, { withFileTypes: true })
                            .filter(folder => folder.isDirectory());

                            
    for (const folder of commandFolders) {
        const commandPath = path.join(__dirname, folder.name);
        const commandFiles = fs.readdirSync(commandPath, { withFileTypes: true })
                               .filter(file => file.isFile());
        for (const file of commandFiles) {
            const commandFilePath = path.join(commandPath, file.name);
            const command = require(commandFilePath);

            if (command && command.default) {
                Client.commands.set(command.default.data.name, command.default);
            } else {
                console.warn(`Command at ${commandFilePath} is missing a default export.`);
            }
        }
    }
    
}