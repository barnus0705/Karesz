import { EmbedBuilder } from "discord.js";

interface Rulebook {
    id: string;
    name: string;
    link: string;
    language: string;
}

export function createRulebookEmbed({ id, name, link, language }: Rulebook) {
    const embed = new EmbedBuilder()
        .setTitle(name)
        .setURL(link)
        .addFields({ name: "Language", value: language })
        .setFooter({ text: `ID: ${id}` });

    return embed;
}