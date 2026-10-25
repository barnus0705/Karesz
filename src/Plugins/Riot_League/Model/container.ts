import { getVersionForCDN } from '../getVersionForCDN';
import {

    ContainerBuilder,
    TextDisplayBuilder,
    ThumbnailBuilder,

} from 'discord.js';

import type { MatchInformations, Participant } from '../../../Plugins/Riot_League/getMatchInfo';

export async function createMatchContainer(info: MatchInformations, participants: Participant[], region: string, summonerName: string) {
    info.gameVersion = await getVersionForCDN(info.gameVersion || '');
    
    const aTeam = participants.slice(0, participants.length / 2);
    const bTeam = participants.slice(participants.length / 2);



    const Titles =[
        `🔵 Blue Team \t ${info.matchId}`,
        `🔴 Red Team \t ${info.matchId}`
    ]

    const getColor = (won: boolean) => (won ? 0x1f8b4c : 0xff0000);
    const winnerA = aTeam.some(player => player.riotIdGameName === summonerName) && info.winningTeam === true;
    const winnerB = bTeam.some(player => player.riotIdGameName === summonerName) && info.winningTeam === true;
    const ContainerA = new ContainerBuilder()  
    addStyle(ContainerA, getColor(winnerA));
    addTitleRow(ContainerA, Titles[0]);
    addSpacer(ContainerA);
    addSection(ContainerA, aTeam, info.gameVersion, region);
    
    const ContainerB = new ContainerBuilder();
    addStyle(ContainerB, getColor(winnerB));
    addTitleRow(ContainerB, Titles[1]);
    addSpacer(ContainerB);
    addSection(ContainerB, bTeam, info.gameVersion, region);




    return [ContainerA, ContainerB];
}


function addStyle(container: ContainerBuilder, color: number) {
    container.setAccentColor(color);
    return container;
}

function addSpacer(container: ContainerBuilder) {
    container.addSeparatorComponents();
    return container;
}

function addTitleRow(container: ContainerBuilder, text: string) {
    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`## ${text}`));
    return container;
}

function addSection(container: ContainerBuilder, Players: Participant[], gameVersion: string, region: string) {
    const Roles: Record<string, string> = {
       TOP: 'TOP',
       JUNGLE: 'JUNGLE',
       MIDDLE: 'MID',
       BOTTOM: 'ADC',
       UTILITY: 'SUPPORT'
    };

    Players.map((player) => {
        const championUrl = `https://ddragon.leagueoflegends.com/cdn/${gameVersion}/img/champion/${player.championName}.png`;
        console.log(championUrl);
        const KDALenghts: Record<string, number> = {
            K: Math.round(String(player.kills).length/2)+2,
            D: Math.round(String(player.deaths).length/2)+2,
            A: Math.round(String(player.assists).length/2)+2,
            COMBINED: String(`${player.kills}  /  ${player.deaths}  /  ${player.assists} `).length,
            LIMIT: 25
        }
        console.log(KDALenghts);

        container.addSectionComponents((section) =>
            section.addTextDisplayComponents(
                new TextDisplayBuilder().setContent([
                    `### [${player.riotIdGameName}#${player.riotIdTagline}](https://op.gg/lol/summoners/${region}/${encodeURIComponent(player.riotIdGameName)}-${encodeURIComponent(player.riotIdTagline)}) \n${Roles[String(player.individualPosition)]}`,
                    `${player.kills}  /  ${player.deaths}  /  ${player.assists} ${String("").padEnd(KDALenghts.LIMIT - KDALenghts.COMBINED, ' ')} KDA: ${player.KDA.toFixed(2)}`,
                    '\u200b'
                ].join('\r\n')),
            )
            .setThumbnailAccessory(
                new ThumbnailBuilder().setURL(championUrl)
            ));
    });
    return container;
}
