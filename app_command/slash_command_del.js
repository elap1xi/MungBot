import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { REST, Routes } from 'discord.js';
const config = require('../data/config/config.json');
import env from '../data/config/conf.mjs';

const clientId = config.status == "online" ? config.clientId : config.clientId_sub;
const Token = config.status == "online" ? env.token1 : env.token_test1;

const rest = new REST({ version: '10' }).setToken(Token);

// for guild-based commands
// rest.put(Routes.applicationGuildCommands(clntid, config.guildId), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);