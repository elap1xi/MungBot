import './config.mjs';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageReactions
	]
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.mjs'));
for (const file of eventFiles) {
	const event = await import(`#events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

let get_info = new cron.CronJob('0 30 * * * *',() => scrap_info());
if(config.enableCronjob) get_info.start();

client.login(Token);