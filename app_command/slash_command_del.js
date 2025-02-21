import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { REST, Routes } from 'discord.js';
const config = require('../data/config/config.json');
const privateKey = require('../data/security/private.json');
import env from '../data/config/conf.mjs';

const clientId = config.status == "main" ? privateKey.clientId : privateKey.clientId_sub;
const Token = config.status == "main" ? env.token1 : env.token_test1;

const rest = new REST({ version: '10' }).setToken(Token);

// for guild-based commands
// rest.put(Routes.applicationGuildCommands(clntid, privateKey.guildId), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);