import { Enviroment } from '../../Configs/enviroment';


export async function getMatchHistory(
    { puuid, region }: { puuid: string; region: string }
): Promise<string[]> {
    const requestURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?api_key=${Enviroment.RIOT_API_KEY}`;
    try {
        const response = await fetch(requestURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        throw new Error(`Failed to fetch match history: ${error}`);
    }
}
