import { readFile } from "fs/promises";

import type { Rulebook } from "../Model/ruleBookModel";

type BoardGame = {
    name: string;
};

export async function getRulebooks(boardGameName: string) {
    const boardGameNameLower = boardGameName.toLocaleLowerCase();
    let namesIncludesSearch = false;
    const response = await fetch(`https://api.rule-book.org/games?search=${boardGameName}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Rulebook request failed: ${response.status}`);
    }

    
    let data = await response.json();

    data = data.results.map( (game: Rulebook) => {
        game.lowName = game.name.toLowerCase();
        return game;
    });

    console.log(data);
    namesIncludesSearch = data.some((game: Rulebook) => 
                                     game.lowName.includes(boardGameNameLower));

    data = data.filter((game: Rulebook) => game.lowName.includes(boardGameNameLower));
    console.log(data);
    if (!namesIncludesSearch) {
        const fileContent = await readFile("./src/Data/offChartBGs.json", "utf-8");
        const jsonData = JSON.parse(fileContent);
        
        if(jsonData.BoardGames.some((game: BoardGame) => game.name.toLowerCase() === boardGameNameLower)){
            return jsonData.BoardGames.filter((game: BoardGame) => game.name.toLowerCase() === boardGameNameLower);
        }else{
            return [{
                id: -1,
                name: `${boardGameName} Not Found`, 
                link: "",
                language: ""
            }];
        }
    }else{
        return data ?? [];
    }
    
}