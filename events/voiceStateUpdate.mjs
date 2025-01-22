
const once = false;
const name = 'voiceStateUpdate';

async function execute(oldState, newState) {
    if(config.status == "test") return;
    if(newState.guild.id !== "1226196255605002292") return;

    let date = new Date();
    let dateOption = { timeZone: 'Asia/Seoul', hour12: false };
	if (!oldState.channel && newState.channel) {
        webhookclient_voice_k.send({
            content: `> \`\`${newState.member.user.tag}\`\` joined voice channel : **${newState.channel.name}** _ ${date.toLocaleString('ko-KR', dateOption)}`
        });
    }
    
    if (oldState.channel && !newState.channel) {
        webhookclient_voice_k.send({
            content: `> \`\`${oldState.member.user.tag}\`\` left voice channel : **${oldState.channel.name}** _ ${date.toLocaleString('ko-KR', dateOption)}`
        });
    }
}

export { once, name, execute };