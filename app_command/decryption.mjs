import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const algorithm = 'aes-256-cbc';
const keyPath = path.join(__dirname, '../data/security/secret.key');
const ivPath = path.join(__dirname, '../data/security/iv.key');
const encConfigPath = path.join(__dirname, '../data/config/config.json.enc');
const configPath = path.join(__dirname, '../data/config/config.json');

export function decryptConfig() {
    const key = fs.readFileSync(keyPath);
    const iv = fs.readFileSync(ivPath);
    const encryptedData = fs.readFileSync(encConfigPath);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    fs.writeFileSync(configPath, decrypted);
    console.log('Config decrypted successfully.');
}
decryptConfig();
export function cleanupConfig() {
    if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
        console.log('Temporary config file deleted.');
    }
}