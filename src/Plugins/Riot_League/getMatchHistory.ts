import { Enviroment } from '../../Configs/enviroment';


export async function getMatchHistory(
    { puuid, region, count }: { puuid: string; region: string, count: number }
): Promise<string[]> {
    const requestURL = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${Enviroment.RIOT_API_KEY}`;
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
