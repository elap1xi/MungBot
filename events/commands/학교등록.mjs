const create = () => {
	const command = new SlashCommandBuilder()
    .setName('학교등록')
    .setDescription('학교등록!')
	return command.toJSON();
};

const execute = async (interaction) => {
	const author = interaction.user.id;
    let data = await SubFunction.Lunch_output(author);
	if(data!==undefined){
		const lch_pkl = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle(`${data} (가) 이미 ${interaction.user.username} 님에게 등록되어져 있네요!`)
			.setDescription("학교를 변경하고 싶으신가요?")
			
		const lch_pkl_BTN = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
			.setCustomId('BTN_confirm_lch_pkl_BTN')
			.setLabel('네!')
			.setStyle(ButtonStyle.Success),
		)
		.addComponents(
			new ButtonBuilder()
			.setCustomId('BTN_dismiss_lch_pkl_BTN')
			.setLabel('아니요!')
			.setStyle(ButtonStyle.Secondary),
		)
		await interaction.reply({ embeds : [lch_pkl], components : [lch_pkl_BTN], fetchReply: true, ephemeral: true });
	} else {
		const sch_reg = new ModalBuilder()
		.setCustomId("sch_reg")
		.setTitle("Register School");
	
		const sch_input = new TextInputBuilder()
		.setCustomId("sch_input")
		.setLabel(`현재 다니고 있는 학교를 알려주세요!`)
		.setMinLength(2)
		.setStyle(TextInputStyle.Paragraph);
		const actionrow = new ActionRowBuilder().addComponents(sch_input);
		sch_reg.addComponents(actionrow);
		await interaction.showModal(sch_reg);
	}
};

export { create, execute };