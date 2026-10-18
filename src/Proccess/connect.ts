/* Discord.JS */
import { Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";

/* Scratch Code */
import { Enviroment } from "../Configs/enviroment";
import { CommandLoader } from "../Commands/commandLoader";

import { MessageReciever } from "../Messages/messageReciever";

/* Class extension */
import { ExtendedClient } from "../Configs/client"; // Command type is added to the class

const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });

export default function connectClient() {
  if (!Enviroment.BOT_TOKEN) {
    throw new Error("DISCORD_TOKEN is missing. Add it to the .env file.");
  }

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}`);
  });

  client.commands = new Collection();

/*
Commands will be loaded here.
*/
CommandLoader(client);




/*
Message receiver will be set up here.
*/
MessageReciever(client);


/*
Discord client login.
*/
  client.login(Enviroment.BOT_TOKEN);
}