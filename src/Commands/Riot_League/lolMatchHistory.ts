import { getRiotPUUID } from '../../Plugins/Riot_League/getUserPUUID';
import { getMatchHistory } from '../../Plugins/Riot_League/getMatchHistory';
import { saveMatchHistory } from '../../Plugins/Riot_League/DataCache/matchHistory';
import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { getMatchInfo } from '../../Plugins/Riot_League/getMatchInfo';
import { createMatchContainer } from '../../Plugins/Riot_League/Model/container';



export default {
     
    data: new SlashCommandBuilder().setName("lol-history").setDescription("League of Legends match history")
        .addStringOption(option => {
            option.setName("summoner_name")
                .setDescription("Summoner name")
                .setRequired(true);
            return option;
        })
        .addStringOption(option => 
            option.setName("summoner_tag")
                .setDescription("Summoner tag")
                .setRequired(true))
        .addIntegerOption(option =>  
            option.setName("number_of_matches")
                .setDescription("Number of matches to retrieve")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("region")
                .setDescription("Region")
                .setRequired(true)
                .addChoices(
                    { name: 'NA', value: 'na' },
                    { name: 'EUW', value: 'euw' },
                    { name: 'EUNE', value: 'eune' },
                    { name: 'KR', value: 'kr' }
                )
        ),
                
    async execute(interaction: ChatInputCommandInteraction) {

        const values = {
            summonerName: interaction.options.getString("summoner_name", true),
            summonerTag: interaction.options.getString("summoner_tag", true).toLocaleUpperCase(),
            region: interaction.options.getString("region", true),
            numberofMatches: interaction.options.getInteger("number_of_matches", true)
        };
        const regions: Record<string, string> = {
            'na': 'americas',
            'euw': 'europe',
            'eune': 'europe',
            'kr': 'asia'
        };
        if (!regions[values.region]) {
            await interaction.reply({ content: `Unknown region: ${values.region}`, flags: MessageFlags.Ephemeral });
            return;
        }

        
        const summonerURI = encodeURIComponent(values.summonerName).toString();
        const puuidResponse = await getRiotPUUID({ summonerName: summonerURI, summonerTag: values.summonerTag, region: regions[values.region], puuid: "" });
        console.log(puuidResponse.puuid);
        const matchHistoryData: string[] = await getMatchHistory({ puuid: puuidResponse.puuid, region: regions[values.region], count: values.numberofMatches });
        saveMatchHistory(values.summonerName, { puuid: puuidResponse.puuid, region: regions[values.region], matchHistory: matchHistoryData });
        
        let firstCommit = true;
        for (const gameId of matchHistoryData) {
            const match = await getMatchInfo({ gameId: gameId, region: regions[values.region], summonerName: values.summonerName });
            const matchInfo = match.info;
            const matchParticipants = match.participants;

            const matchContainer = await createMatchContainer(matchInfo, matchParticipants, values.region, values.summonerName);
            // Discord caps a message at 40 components, so each team goes in its own message
            for (const container of matchContainer) {
                if (firstCommit) {
                    firstCommit = false;
                    await interaction.reply({ content: "Match History for " + values.summonerName});
                    await interaction.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 });
                } else {
                    await interaction.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 });
                }
            }
        }

    }
};