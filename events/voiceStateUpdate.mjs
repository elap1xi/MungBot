
const once = false;
const name = 'voiceStateUpdate';

async function execute(oldState, newState) {
    if(config.status == "test") return;
    if(newState.guild.id !== "1226196255605002292") return;

	if (!oldState.channel && newState.channel) {
        webhookclient_voice_k.send({
            content: `${newState.member.user.tag} joined voice channel : ${newState.channel.name} - ${Date.now()}`
        });
    }
    
    if (oldState.channel && !newState.channel) {
        webhookclient_voice_k.send({
            content: `${oldState.member.user.tag} left voice channel : ${oldState.channel.name} - ${Date.now()}`
        });
    }
}

export { once, name, execute };