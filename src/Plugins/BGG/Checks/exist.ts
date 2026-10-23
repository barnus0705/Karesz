import type { Rulebook } from "../Model/ruleBookModel";


interface FileData {
    BoardGames: Rulebook[];
}
export function existingBoardGame(FileData: FileData, boardGameName: string){
    return FileData.BoardGames.find((bg: { name: string }) => bg.name.toLocaleLowerCase() === boardGameName.toLocaleLowerCase()) || false;
};