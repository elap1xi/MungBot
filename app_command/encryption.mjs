import { createRequire } from "module";
const require = createRequire(import.meta.url);

const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

fs.writeFileSync('secret.key', key);
fs.writeFileSync('iv.key', iv);

const data = fs.readFileSync('./data/config/config.json');
const cipher = crypto.createCipheriv(algorithm, key, iv);
const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

fs.writeFileSync('./data/config/config.json.enc', encrypted);
console.log("success");
