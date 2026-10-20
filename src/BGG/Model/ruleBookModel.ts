import { EmbedBuilder } from "discord.js";

export interface Rulebook {
    id: string;
    name: string;
    lowName: string;
    link: string;
    language: string;
}

export function createRulebookEmbed({ id, name, link, language }: Rulebook) {
    const embed = new EmbedBuilder()
        .setTitle(name)
        .addFields({ name: "Language", value: language || "-" })
        .setFooter({ text: `ID: ${id}` });

    if (link) {
        embed.setURL(link);
        if (link.includes(".gif")){
            embed.setImage(link);
        }
    }

    return embed;
}