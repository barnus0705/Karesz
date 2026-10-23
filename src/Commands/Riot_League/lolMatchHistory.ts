import { getRiotPUUID } from '../../Plugins/Riot_League/getUserPUUID';
import { getMatchHistory } from '../../Plugins/Riot_League/getMatchHistory';
import { saveMatchHistory } from '../../Plugins/Riot_League/DataCache/matchHistory';
import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { saveUserCache, getUserCache } from '../../Plugins/Riot_League/DataCache/userCache';



export default {
     
    data: new SlashCommandBuilder().setName("lol-history").setDescription("League of Legends match history")
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
        })
        .addStringOption(option => 
            option.setName("summoner_tag")
                .setDescription("Summoner tag")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("region")
                .setDescription("Region")
                .setRequired(true)
                .addChoices(
                    { name: 'NA', value: 'america' },
                    { name: 'EUW', value: 'europe' },
                    { name: 'EUNE', value: 'europe' },
                    { name: 'KR', value: 'korea' }
                )
        ),
                
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const values = {
            summonerName: interaction.options.getString("summoner_name", true),
            summonerTag: interaction.options.getString("summoner_tag", true).toLocaleUpperCase(),
            region: interaction.options.getString("region", true).toLocaleLowerCase()
        };
        const summonerURI = encodeURIComponent(values.summonerName).toString();
        const puuidResponse = await getRiotPUUID({ summonerName: summonerURI, summonerTag: values.summonerTag, region: values.region, puuid: "" });
        const matchHistoryData: string[] = await getMatchHistory({ puuid: puuidResponse.puuid, region: values.region });
        saveMatchHistory(values.summonerName, { puuid: puuidResponse.puuid, region: values.region, matchHistory: matchHistoryData });
        saveUserCache(values.summonerName);

        await interaction.editReply(
            matchHistoryData.length > 0
                ? `Match History: ${matchHistoryData.join(', ')}`
                : 'No match history found.'
        );
    }
};