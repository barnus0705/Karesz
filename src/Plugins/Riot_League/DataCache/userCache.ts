import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

const cacheFilePath = path.resolve(__dirname, '../../../Data/cachedRiotUsers.json');
const cachedUser = JSON.parse(readFileSync(cacheFilePath, 'utf-8'));

export function saveUserCache(summonerName: string): void {

    if (cachedUser.Users.find((user: { summonerName: string }) => user.summonerName === summonerName)) return;

    cachedUser.Users.push({ summonerName });
    writeFileSync(cacheFilePath, JSON.stringify(cachedUser, null, 2), 'utf-8');
}
export function getUserCache() {
    return cachedUser || "none";
}