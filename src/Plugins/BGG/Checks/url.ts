import type { Interaction } from "discord.js";
import encrypt from "../Model/chipher";



export async function isValidUrl(url: string, boardGameName: string, interaction: Interaction): Promise<string | undefined>  {
    const urlLogic = [".pdf"].every(substring => url.includes(substring));
    if(urlLogic){ 
        url = await encrypt(url, boardGameName);
        return url;
    }else{
        if (interaction.isRepliable()) {
            interaction.reply({ content: "Invalid url. Please provide a valid HTTP PDF url.", ephemeral: true });
        }
        return;
    }
}
