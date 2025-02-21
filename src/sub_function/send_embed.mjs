
/**
 * 에러
 */
export async function error(message){
    let embed = new EmbedBuilder()
    .setTitle("에러가 발생했어요 :(")
    .setColor('#ffcc80')
    .setTimestamp();
    await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
}