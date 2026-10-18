import { Events } from "discord.js";
import { ExtendedClient } from "../Configs/client";

export function MessageReciever(Client: ExtendedClient) {
    Client.on(Events.InteractionCreate, async (message) => {
        if (!message.isChatInputCommand()) return;

        const command = Client.commands.get(message.commandName);

        if (!command){
            console.log("Command not found");
            return;
        };

        try{
            await command.execute(message);
        } catch (error) {
            console.error(error);
            if (message.replied || message.deferred) {
                await message.followUp({ content: "There was an error while executing this command!", ephemeral: true });
            } else {
                await message.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        }
    });
}


