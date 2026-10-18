import { Client, Collection } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

interface Command {
    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export class ExtendedClient extends Client {
    commands = new Collection<string, Command>(); 
}

