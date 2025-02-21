import '../config.mjs';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fs from 'node:fs';
import { REST, Routes } from 'discord.js'; 
import env from '../data/config/conf.mjs';
const config = require('../data/config/config.json');
const privateKey = require('../data/security/private.json');
const clientid = config.status == "main" ? privateKey.clientId : privateKey.clientId_sub;
const Token = config.status == "main" ? env.token1 : env.token_test1;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./events/commands').filter(file => file.endsWith('.mjs'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = await import(`../events/commands/${file}`);
	console.log('- '+file);
	commands.push(command.create());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(Token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set

			// LOCAL
			// const data = await rest.put(
			// 	Routes.applicationGuildCommands(clientid, guildId),
			// 	{ body: commands },
			// );
			
			// GLOBAL
			const data = await rest.put(
				Routes.applicationCommands(clientid),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
			
		} catch (error) {
		console.error(error);
	}
})();