import { EmbedBuilder } from "discord.js";
import decrypt from "../../Configs/dechiper";

export interface Rulebook {
    id: string;
    name: string;
    lowName: string;
    link: string;
    language: string;
}

export async function createRulebookEmbed({ id, name, link, language }: Rulebook) {
    const embed = new EmbedBuilder()
        .setTitle(name)
        .addFields({ name: "Language", value: language || "-" })
        .setFooter({ text: `ID: ${id}` });

    if (!link.includes("http"))link = await decrypt(link, name);

    if (!link.includes("http") && link.includes(".pdf")){
        console.log(`Link does not include http, prepending https://${link}`);
        link = `https://${link.trim()}`;
    }
    
    if (link) {
        embed.setURL(link);
    }

    return embed;
}