
const create = () => {
    const command = new SlashCommandBuilder()
    .setName("번역")
    .setDescription("파파고 번역을 해드려요")
    .addStringOption(option =>
        option.setName("contents")
            .setDescription("contents to translate")
            .setRequired(true))
    return command.toJSON();
};

const execute = (interaction) => {
    var query = interaction.options.getString("contents");
    async function reply() {
        async function rep(json) {
            const papago_embed = new EmbedBuilder()
                .setColor(0x1eda69)
                .setTitle('Papago Translate ( '+String(json.srcLangType.toUpperCase())+' -> '+String(json.tarLangType.toUpperCase())+' )')
                .addFields(
                    { name: "번역할 내용", value: '``'+query+'``', inline: true },
                    { name: "변역 결과", value: '``'+String(json.translatedText)+'``', inline: true }
                )
                .setFooter({text: '번역 제공 및 언어감지 : 국내산 앵무새 | Papago ⓒ NAVER Corp '});
            await interaction.reply({ embeds: [papago_embed]});
        }

        async function errc(error) {
            await interaction.reply("에러가 발생했어요! ``" + error + "``");
        }

        axios.get("https://playentry.org/api/expansionBlock/papago/dect/langs", {
            params: {
                query: query
            }
        })
        .then(res => detect(res.data))
        .catch(err => erq(err));

        function detect(json) {
            let target;
            if(json.langCode=="ko"){
                target = "en";
            } else {
                target = "ko";
            }
            axios.get("https://playentry.org/api/expansionBlock/papago/translate/n2mt", {
                params: {
                    text: query,
                    target: target
                }
            })
            .then(res => rep(res.data))
            .catch(err => errc(err));
        }
    }
    reply();
};

export { create, execute };