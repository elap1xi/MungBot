
const create = () => {
    const command = new SlashCommandBuilder()
    .setName("등급계산")
    .setDescription("내신 등급을 계산해줍니다.")
    return command.toJSON();
};

const execute = async (interaction) => {
    const modal_gc = new ModalBuilder()
    .setCustomId("modal_gc")
    .setTitle("내신 성적 등급 계산");

    const gc_input = new TextInputBuilder()
    .setCustomId("gc_input")
    .setLabel("받은 등수/인원, 받은 등수2/인원2, ...")
    .setStyle(TextInputStyle.Paragraph);

    const actionrow = new ActionRowBuilder().addComponents(gc_input);
    modal_gc.addComponents(actionrow);
    await interaction.showModal(modal_gc);
};

export { create, execute };