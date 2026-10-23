import { createCipheriv, randomBytes } from "crypto";
import { Enviroment } from "../../../Configs/enviroment";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import encryptKeys from "../../../Data/encryptKeys.json";

export default async function encrypt(text: string, name: string) {
    const filePath = path.resolve(__dirname, "../../../Data/encryptKeys.json");
    const config = {
        iv: randomBytes(12),
        key: randomBytes(Enviroment.RANDOM_BYTES),
        algorithm: "aes-256-gcm" as const
    }

    const chipher  = createCipheriv(config.algorithm, config.key, config.iv);
    const encrypted = Buffer.concat([chipher.update(text, "utf-8"), chipher.final()]);
    const result = `${config.iv.toString("hex")}:${chipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`

    
    const encryptedLink = encryptKeys.Links.find((link: { key: string, name: string }) => link.name === name);
    if(!encryptedLink) {
        const data = JSON.parse(await readFile(filePath, "utf-8"));
        data.Links.push({ key: config.key.toString("hex"), name: name });
        await writeFile(filePath, JSON.stringify(data, null, 2));
    }

    return result;
}
