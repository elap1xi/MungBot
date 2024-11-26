async function News_(message) {
    const select_press = new StringSelectMenuBuilder()
        .setCustomId('news_press')
        .setPlaceholder('언론사를 선택해 주세요!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('KBS')
                .setDescription('수신료로 만들어 가는 대한민국 뉴스의 중심')
                .setValue('KBS'),
            new StringSelectMenuOptionBuilder()
                .setLabel('MBC')
                .setDescription('당신이 뉴스입니다')
                .setValue('MBC'),
            new StringSelectMenuOptionBuilder()
                .setLabel('연합뉴스')
                .setDescription('내 손 안의 뉴스')
                .setValue('연합'),
            new StringSelectMenuOptionBuilder()
                .setLabel('JTBC')
                .setDescription('뉴스의 현장에서 뵙겠습니다')
                .setValue('JTBC'),
            new StringSelectMenuOptionBuilder()
                .setLabel('YTN')
                .setDescription('진실을 전합니다! 진심을 다합니다! 뉴스는 YTN')
                .setValue('YTN'),
            new StringSelectMenuOptionBuilder()
                .setLabel('중앙일보')
                .setDescription('현장의 진실을 중앙에 두다')
                .setValue('중앙일보'),
        );

    const row_press = new ActionRowBuilder()
        .addComponents(select_press);

    await message.reply({
        components: [row_press],
        allowedMentions: { repliedUser: false }
    });
}

export { News_ as default };