import { EmbedBuilder } from "discord.js";
import decrypt from "./dechiper";
import languageFile from "../../../Data/languages.json";


export interface Rulebook {
    id: string;
    name: string;
    lowName: string;
    link: string;
    language: string;
}

export async function createRulebookEmbed({ id, name, link, language }: Rulebook) {

    language = (languageFile.Languages as Record<string, string>)[language] || language;

    const embed = new EmbedBuilder()
        .setTitle(name)
        .addFields({ name: "Language", value: language || "-" })
        .setFooter({ text: `ID: ${id}` });

    if (!link.includes("http"))link = await decrypt(link, name);

    if (!link.includes("http") && link.includes(".pdf")){
        link = `https://${link.trim()}`;
    }
    
    if (link) {
        embed.setURL(link);
    }

    return embed;
}