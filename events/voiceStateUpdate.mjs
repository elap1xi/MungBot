
const once = false;
const name = 'voiceStateUpdate';

async function execute(oldState, newState) {
    if(newState.guild.id !== "1226196255605002292") return;

	if (!oldState.channel && newState.channel) {
        webhookclient_voice_k.send({
            content: `${newState.member.user.tag} joined voice channel : ${newState.channel.name}`
        });
    }
    
    if (oldState.channel && !newState.channel) {
        webhookclient_voice_k.send({
            content: `${newState.member.user.tag} left voice channel : ${newState.channel.name}`
        });
    }
}

export { once, name, execute };