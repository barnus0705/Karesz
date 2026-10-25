import {readFileSync} from 'fs';
import path from 'path';

const cacheFilePath = path.resolve(__dirname, '../../../Data/matchHistoryInstances.json');
const cachedUser = JSON.parse(readFileSync(cacheFilePath, 'utf-8'));

export function getUserCache(): string[] {
    return Object.keys(cachedUser) || [];
}