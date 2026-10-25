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
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) {
            throw new Error(`Riot API ${response.status}: ${JSON.stringify(data)}`);
        }
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch match history: ${error}`);
    }
}
