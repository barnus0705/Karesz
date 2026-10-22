import { createDecipheriv } from "crypto";
import path from "path";
import { readFile } from "fs/promises";

export default async function decrypt(text: string, name: string) {
    const filePath = path.resolve(__dirname, "../../Data/encryptKeys.json");
    const Encryptdata = JSON.parse(await readFile(filePath, "utf-8"));

    const encryptKey = Encryptdata.Links.find((item: { name: string; key: string }) => item.name === name);
    if (!encryptKey) throw new Error("Encryption key not found for the given name.");


    const [ iv, authTag, encrypted ] = text.split(":");
    const decipher = createDecipheriv("aes-256-gcm", Buffer.from(encryptKey.key, "hex"), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, "hex")), decipher.final()]);
    return decrypted.toString("utf-8");
}