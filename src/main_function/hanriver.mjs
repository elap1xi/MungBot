
async function han_gang_rvr_(message, debug){
    try {
        var json = await SubFunction.han_gang_temp();
        var temp = json.temp!=='점검중' ? `${json.temperature} ℃` : json.temperature;

        const hgbed = new EmbedBuilder()
        .setColor(0x007ACC)
        .setTitle(`한강 수온 (측정시각 : ${json.time})`)
        .setDescription(`현재수온 : ${temp}`)
        .setTimestamp()
        .setFooter({ text: `station : ${json.location} | status : ${json.status}` });
        if(debug) return 200;
        message.channel.reply({ 
            embeds: [hgbed],
            allowedMentions: { repliedUser: false }
        }); return 200;
    } catch(error) {
        webhookclient_Error.send({
            content: '**Rv.Han Temp ERROR**\n```'+error.stack+'```'
        });
        return 'M3';
    }
}

export { han_gang_rvr_ as default };