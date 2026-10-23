import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { readMatchHistory } from "../../Plugins/Riot_League/DataCache/matchHistory";
import { saveUserCache, getUserCache } from "../../Plugins/Riot_League/DataCache/userCache";

export default {
    data: new SlashCommandBuilder().setName("lol-cached-history").setDescription("Get cached League of Legends match history")
       .addStringOption(option => {
            option.setName("summoner_name")
                .setDescription("Summoner name")
                .setRequired(true);
            const choices = getUserCache();

            if (!choices){
                return option;
            }else{
                option.addChoices(
                    choices.Users.map((user: { summonerName: string }) => 
                                            ({ name: user.summonerName, value: user.summonerName }))
                );
            }
            return option;
        
        }),
    async execute(interaction: ChatInputCommandInteraction) {
        const summonerName = interaction.options.getString("summoner_name", true);
        const matchHistory = readMatchHistory(summonerName);
        saveUserCache(summonerName); 
        await interaction.reply(`Cached Match History: ${matchHistory.join(', ')}`);
    }
};