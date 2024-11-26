
const create = () => {
	const command = new SlashCommandBuilder()
		.setName('오류신고')
		.setDescription('오류신고!')
	return command.toJSON();
}

const execute = async (interaction) => {
	const modal_err = new ModalBuilder()
	.setCustomId("modal_err")
	.setTitle("Reprot Error");

	const report_input = new TextInputBuilder()
	.setCustomId("report_input")
	.setLabel(`어떤 문제가 발생하였는지 알려주세요!`)
	.setMinLength(10)
	.setStyle(TextInputStyle.Paragraph);
	
	const actionrow = new ActionRowBuilder().addComponents(report_input);
	modal_err.addComponents(actionrow);
	await interaction.showModal(modal_err);
}

export { create, execute };