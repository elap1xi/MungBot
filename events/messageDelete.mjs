
const once = false;
const name = 'messageDelete';

async function execute(message) {
    // if(message.guildId=="1226196255605002292" || message.guildId=="861212897208172545"){
    //     if(message.content!=="" && message.author.id!=="416558463163039745"){
    //         const detecter = new EmbedBuilder()
    //         .setColor(0xffffff)
    //         .setTitle(`**${message.author.username}** 님이 메세지를 삭제하셨어요!`)
    //         .setDescription(`삭제된 메세지 : \n\n\`${message.content}\``)
    //         .setTimestamp()
    //         .setFooter({ text: '뭉이' })
    //         await message.channel.send({
    //             embeds: [detecter]
    //         });
    //     }

    //     if (message.attachments.size > 0) {
    //         message.attachments.forEach(async attachment => {
    //             await message.channel.send({
    //                 content: `> ${message.author.username}님이 삭제하신 사진이에요!`
    //             })
    //         })
    //     }
    // }
    return;
}

export { once, name, execute };