"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_1 = require("discord.js");
const enviroment_1 = require("./Configs/enviroment");
const rest = new discord_js_1.REST().setToken(enviroment_1.Enviroment.BOT_TOKEN);
const commands = [];
const commandDirectory = path_1.default.join(__dirname, "Commands");
const commandFolders = fs_1.default.readdirSync(commandDirectory, { withFileTypes: true })
    .filter(folder => folder.isDirectory());
for (const folder of commandFolders) {
    const commandPath = path_1.default.join(commandDirectory, folder.name);
    const commandFiles = fs_1.default.readdirSync(commandPath, { withFileTypes: true })
        .filter(file => file.isFile());
    for (const file of commandFiles) {
        const commandFilePath = path_1.default.join(commandPath, file.name);
        const command = require(commandFilePath);
        const commandData = command?.default?.data;
        if (commandData && typeof commandData.toJSON === "function") {
            commands.push(commandData.toJSON());
        }
        else {
            console.warn(`Command at ${commandFilePath} is missing a default export.`);
        }
    }
}
(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(discord_js_1.Routes.applicationGuildCommands(enviroment_1.Enviroment.CLIENT_ID, enviroment_1.Enviroment.GUILD_ID), {
            body: commands
        }).then(() => {
            console.log(`Successfully Loaded application (/) commands Amount: ${commands.length}.`);
        });
    }
    catch (error) {
        console.error(error);
    }
})();
