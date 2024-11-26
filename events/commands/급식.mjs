
const create = () => {
	const command = new SlashCommandBuilder()
    .setName('급식')
    .setDescription('provide lunch menu of school')
    .addStringOption(option =>
        option.setName("school")
            .setDescription("school-name")
            .setRequired(true))
	return command.toJSON();
}

const execute = async (interaction) => {
	var school_name = interaction.options.getString("school");
	var dayLabel = new Date().getDay();
	if (dayLabel=="0" || dayLabel=="6"){
		await interaction.reply("주말은 급식정보가 없어요!");
	} else {
		async function reply() {
			async function res(json) {
				const lch = new EmbedBuilder()
				.setColor(0xffffff)
				.setTitle(`${school_name} 급식`)
				.addFields(
					{ name: "목록", value: json.menu[0].lunch.join("\n"), inline: true },
				)
				await interaction.reply({ embeds: [lch]});
			}
			
			async function errc(error) {
				await interaction.reply("에러가 발생했어요! ``" + error + "``");
			}
	
			axios.get("https://schoolmenukr.ml/code/api", {
				params: {
					q: school_name
				}
			})
			.then(res => bop(res.data))
			.catch(err => erq(err));
			
			function bop(json) {
				let grade = "elementary";
				if(school_name.endsWith("고") || school_name.endsWith("고등학교")) grade="high";
				else if(school_name.endsWith("중") || school_name.endsWith("중학교")) grade="middle";
				axios.get(`https://schoolmenukr.ml/code/api/${grade}/${json.school_infos[0].code}`, {
					params: {
						date: new Date().getDate(),
					}
				})
				.then(res => res(res.data))
				.catch(err => errc(err));
			}
		}
		reply();
	}
};

export { create, execute };