
async function han_gang_rvr_(message){
    try {
        var json = await SubFunction.han_gang_temp();
        var temp = json.temp!=='점검중' ? `${json.temp} ℃` : json.temp;

        const hgbed = new EmbedBuilder()
        .setColor(0x007ACC)
        .setTitle(`한강 수온 (측정시각 : ${json.time})`)
        .setDescription(`현재수온 : ${temp}`)
        .setTimestamp()
        .setFooter({ text: `station : ${json.station} | status : ${json.status}` });
        message.channel.send({ embeds: [hgbed] });
    } catch(error) {
        message.channel.send("통신이 원활하지 않아요 :(");
        webhookclient_Error.send({
            content: '**Lv.Han Temp ERROR**\n```'+error.stack+'```'
        });
    }
}

export { han_gang_rvr_ as default };