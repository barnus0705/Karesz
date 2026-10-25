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



    const Titles = [
        `🔵 Blue Team | Kills: ${info.teamAkills} Deaths: ${info.teamBkills}`,
        `🔴 Red Team | Kills: ${info.teamBkills} Deaths: ${info.teamAkills}`
    ]
    const GameDate = [
        `Game Date: ${new Date(info.gameStartTimestamp).toLocaleString()}\nDuration: ${Math.floor(info.gameDuration/60)}m ${info.gameDuration%60}s`,
    ];

    const Footer = [
        `GameMode: ${info.gameMode} \t GameID: ${info.matchId}`,
    ];

    const GREEN = 0x1f8b4c;
    const RED = 0xff0000;
    const hasRequestUser = (team: Participant[]) => team.some(player => player.riotIdGameName === summonerName);
    const userInA = hasRequestUser(aTeam);

    const aWon = userInA ? info.winningTeam === true : info.winningTeam === false;
    const winnerA = () => (aWon ? GREEN : RED);
    const winnerB = () => (aWon ? RED : GREEN);

    const ContainerA = new ContainerBuilder()  
    addStyle(ContainerA, winnerA());
    addTitleRow(ContainerA, Titles[0], 3);
    addTitleRow(ContainerA, GameDate[0], 0);
    addSpacer(ContainerA);
    addSection(ContainerA, aTeam, info.gameVersion, region);
    addTitleRow(ContainerA, Footer[0], 0);
    
    const ContainerB = new ContainerBuilder();
    addStyle(ContainerB, winnerB());
    addTitleRow(ContainerB, Titles[1], 3);
    addTitleRow(ContainerB, GameDate[0], 0);
    addSpacer(ContainerB);
    addSection(ContainerB, bTeam, info.gameVersion, region);
    addTitleRow(ContainerB, Footer[0], 0);




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

function addTitleRow(container: ContainerBuilder, text: string, headerLevel: number) {
    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`${''.padStart(headerLevel, '#')} ${text}`));
    return container;
}

function addSection(container: ContainerBuilder, Players: Participant[], gameVersion: string, region: string) {
    const Roles: Record<string, string> = {
       TOP: 'TOP',
       JUNGLE: 'JUNGLE',
       MIDDLE: 'MID',
       BOTTOM: 'ADC',
       UTILITY: 'SUPPORT',
       undefined: 'ARAM'
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
                    `## [${player.riotIdGameName}#${player.riotIdTagline}](https://op.gg/lol/summoners/${region}/${encodeURIComponent(player.riotIdGameName)}-${encodeURIComponent(player.riotIdTagline)}) \n${Roles[player.individualPosition]}`,
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
