

export async function error(message, type){
    let embed = new EmbedBuilder()
    .setTitle("죄송해요, 메세지를 처리하는 도중 에러가 발생했어요!")
    .setColor('#ffcc80')
    .setTimestamp();
    await message.reply({ 
        embeds: [embed], allowedMentions: { repliedUser: false } 
    });
    return;
}

export async function log_Error(error){
    webhookclient_Error.send({
        content: error
    });
}