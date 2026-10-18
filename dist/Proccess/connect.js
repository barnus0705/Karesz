"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectClient;
/* Discord.JS */
const discord_js_1 = require("discord.js");
/* Scratch Code */
const enviroment_1 = require("../Configs/enviroment");
const commandLoader_1 = require("../Commands/commandLoader");
const messageReciever_1 = require("../Messages/messageReciever");
/* Class extension */
const client_1 = require("../Configs/client"); // Command type is added to the class
const client = new client_1.ExtendedClient({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
function connectClient() {
    if (!enviroment_1.Enviroment.BOT_TOKEN) {
        throw new Error("DISCORD_TOKEN is missing. Add it to the .env file.");
    }
    client.once(discord_js_1.Events.ClientReady, (readyClient) => {
        console.log(`Logged in as ${readyClient.user.tag}`);
    });
    client.commands = new discord_js_1.Collection();
    /*
    Commands will be loaded here.
    */
    (0, commandLoader_1.CommandLoader)(client);
    /*
    Message receiver will be set up here.
    */
    (0, messageReciever_1.MessageReciever)(client);
    /*
    Discord client login.
    */
    client.login(enviroment_1.Enviroment.BOT_TOKEN);
}
