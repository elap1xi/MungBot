
const once = true;
const name = 'ready';

async function execute(client) {
	let date = new Date();
	console.log('Bot Ready');
	console.log(`Logged in as ${client.user.tag}`);
	console.log('==========================================');
    client.channels.cache.get(deploy_log).send(`Logged in _ ${Version}`+ "\n``(" + date + ")``");
	client.user.setActivity(`${prefix}`, { type: ActivityType.Listening });
}

export { once, name, execute };