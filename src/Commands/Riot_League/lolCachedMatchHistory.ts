import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { readMatchHistory } from "../../Plugins/Riot_League/DataCache/matchHistory";
import { getUserCache } from "../../Plugins/Riot_League/DataCache/userCache";
import { createMatchContainer } from "../../Plugins/Riot_League/Model/container";
import { getMatchInfo } from "../../Plugins/Riot_League/getMatchInfo";

export default {
    data: new SlashCommandBuilder().setName("lol-cached-history").setDescription("Get cached League of Legends match history")
       .addStringOption(option => {
            option.setName("summoner_name")
                .setDescription("Summoner name")
                .setRequired(true);
            const choices: string[] = getUserCache();

            if (choices.length > 0) {
                option.addChoices(
                    ...choices.map((summonerName: string) =>
                        ({ name: summonerName, value: summonerName }))
                );
            }
            return option;
        
        }),
    async execute(interaction: ChatInputCommandInteraction) {
        const summonerName = interaction.options.getString("summoner_name", true);
        const matchHistory = readMatchHistory(summonerName);
        console.log(matchHistory);
        let firstCommit = true;

        for (const match of matchHistory) {
            const matchData = await getMatchInfo({ gameId: match.gameId,
                                                   region: match.region, 
                                                   summonerName: summonerName 
                                                });
            
            const matchInfo = matchData.info;
            const matchParticipants = matchData.participants;

            const matchContainer = await createMatchContainer(matchInfo, matchParticipants, match.region, summonerName);
            for (const container of matchContainer) {
                if (firstCommit) {
                    firstCommit = false;
                    await interaction.reply({ content: "Match History for " + summonerName});
                    await interaction.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 });
                } else {
                    await interaction.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 });
                }
            }
        }
    }
};