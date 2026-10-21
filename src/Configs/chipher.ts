import { createCipheriv, randomBytes } from "crypto";
import { Enviroment } from "./enviroment";
import path from "path";
import { readFile, writeFile } from "fs/promises";

export default async function encrypt(text: string, name: string) {
    const filePath = path.resolve(__dirname, "../Data/encryptKeys.json");
    const config = {
        iv: randomBytes(12),
        key: randomBytes(Enviroment.RANDOM_BYTES),
        algorithm: "aes-256-gcm" as const
    }

    const chipher  = createCipheriv(config.algorithm, config.key, config.iv);
    const encrypted = Buffer.concat([chipher.update(text, "utf-8"), chipher.final()]);
    const result = `${config.iv.toString("hex")}:${chipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`

    const data = JSON.parse(await readFile(filePath, "utf-8"));
    data.Links.push({ id: data.Links.length - 1, key: config.key.toString("hex"), name: name });
    await writeFile(filePath, JSON.stringify(data, null, 2));

    return result;
}
