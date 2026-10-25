import { Enviroment } from '../../Configs/enviroment';


interface UserPUUIDRequest {
    puuid: string;
    summonerName: string;
    summonerTag: string;
    region: string;
}

export async function getRiotPUUID(
    { summonerName, summonerTag, region }: UserPUUIDRequest):
     Promise<UserPUUIDRequest> {

        if (!region) {
            throw new Error('Missing Riot routing region');
        }
        const requestURL = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${summonerTag}?api_key=${Enviroment.RIOT_API_KEY}`;
        console.log(requestURL);
        try{
            const response = await fetch(requestURL,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            
            return await response.json();



        }catch(error){
            throw new Error(`Failed to fetch PUUID: ${error}`);
        }

    


}