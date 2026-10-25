
export async function getVersionForCDN(version: string): Promise<string> {
    const sourceParts = version.split('.');
    const major = sourceParts[0] + '.' + sourceParts[1];
    const response = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`);
    const result = await response.json();
    return result.find((v: string) => v.startsWith(major));
}