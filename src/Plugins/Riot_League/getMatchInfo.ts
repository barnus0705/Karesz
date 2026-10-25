import { Enviroment } from '../../Configs/enviroment';

interface MatchInfo {
    gameId: string;
    region: string;
    summonerName: string;
}
export interface Participant {
    riotIdGameName: string;
    riotIdTagline: string;
    championName: string;
    championId: number;
    individualPosition: string;
    deaths: number;
    kills: number;
    assists: number;
    KDA: number;
}

export interface MatchInformations {
    matchId: string;
    region: string;
    gameMode: string;
    gameDuration: number;
    gameStartTimestamp: number;
    gameVersion: string;
    teamAkills: number;
    teamBkills: number;
    winningTeam: boolean;
}

export interface MatchStructure {
    info: MatchInformations;
    participants: Participant[];
    
}
export async function getMatchInfo({ gameId, region, summonerName }: MatchInfo): Promise<MatchStructure>{

    const requestURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/${gameId}?api_key=${Enviroment.RIOT_API_KEY}`;
    const response = await fetch(requestURL);
    if (!response.ok) {
        throw new Error(`Failed to fetch match info: ${response.statusText}`);
    }
    const matchInfo = await response.json();

    const aTeamKills = matchInfo.info.participants
                      .filter((participant: { teamId: number }) => participant.teamId === 100)
                      .reduce((total: number, participant: { kills: number }) => total + participant.kills, 0);
    
    
    const bTeamKills = matchInfo.info.participants
                    .filter((participant: { teamId: number }) => participant.teamId === 200)
                    .reduce((total: number, participant: { kills: number }) => total + participant.kills, 0);
    
    
    const winningTeam = matchInfo.info.participants.find(
        (participant: {  riotIdGameName: string, win: boolean }) => summonerName === participant.riotIdGameName)?.win;
    
    const matchStructure: MatchStructure = {
        info: {
            matchId: matchInfo.info.gameId,
            region: matchInfo.info.platformId,
            gameMode: matchInfo.info.gameMode,
            gameDuration: matchInfo.info.gameDuration,
            gameStartTimestamp: matchInfo.info.gameStartTimestamp,
            gameVersion: matchInfo.info.gameVersion,
            teamAkills: aTeamKills,
            teamBkills: bTeamKills,
            winningTeam: winningTeam,
        },
        participants: matchInfo.info.participants.map((participant: Participant) => ({
            riotIdGameName: participant.riotIdGameName,
            riotIdTagline: participant.riotIdTagline,
            championName: participant.championName,
            championId: participant.championId,
            individualPosition: participant.individualPosition,
            deaths: participant.deaths,
            kills: participant.kills,
            assists: participant.assists,
            KDA: participant.deaths === 0 ? participant.kills + participant.assists :
                                            (participant.kills + participant.assists) / participant.deaths,
        })),
    };

    return matchStructure;



}
