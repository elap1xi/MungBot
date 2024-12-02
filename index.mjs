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

// get information for reply
let get_info = new cron.CronJob('0 10 * * * *',() => scrap_info());
get_info.start();

const Token = config.status == "online" ? env.token1 : env.token_test1;
client.login(Token);