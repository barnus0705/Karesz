import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

interface MatchHistoryInstances {
    [name: string]: {
        puuid: string;
        region: string;
        matchHistory: string[];
    };
}
type SaveMatchHistoryParams = {
    puuid: string;
    region: string;
    matchHistory: string[];
};

export function saveMatchHistory( name: string, { puuid, region, matchHistory }: SaveMatchHistoryParams ) {
    const filePath = path.resolve(__dirname, '../../../Data/matchHistoryInstances.json');
    const fileData = readFileSync(filePath, 'utf-8');
    const saveMatchHistory: MatchHistoryInstances = JSON.parse(fileData);

    saveMatchHistory[name] = {
        puuid,
        region,
        matchHistory
    };
    writeFileSync(filePath, JSON.stringify(saveMatchHistory, null, 2));

}
export function readMatchHistory(name: string) {
    const filePath = path.resolve(__dirname, '../../../Data/matchHistoryInstances.json');
    const fileData = readFileSync(filePath, 'utf-8');
    const matchHistoryInstances = JSON.parse(fileData);
    return matchHistoryInstances[name]?.matchHistory || [];
}
