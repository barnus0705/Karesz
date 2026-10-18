"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLoader = CommandLoader;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function CommandLoader(Client) {
    const commands = [];
    const commandFolders = fs_1.default.readdirSync(__dirname, { withFileTypes: true })
        .filter(folder => folder.isDirectory());
    for (const folder of commandFolders) {
        const commandPath = path_1.default.join(__dirname, folder.name);
        const commandFiles = fs_1.default.readdirSync(commandPath, { withFileTypes: true })
            .filter(file => file.isFile());
        for (const file of commandFiles) {
            const commandFilePath = path_1.default.join(commandPath, file.name);
            const command = require(commandFilePath);
            if (command && command.default) {
                Client.commands.set(command.default.data.name, command.default);
                commands.push(command.default.data.toJSON());
            }
            else {
                console.warn(`Command at ${commandFilePath} is missing a default export.`);
            }
        }
    }
}
