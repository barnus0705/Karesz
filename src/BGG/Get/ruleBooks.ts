

export async function getRulebooks(boardGameName: string) {
    const response = await fetch(`https://api.rule-book.org/games?search=${boardGameName}`, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Rulebook request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.results ?? [];
}