
const create = () => {
    const command = new SlashCommandBuilder()
    .setName("쇼핑")
    .setDescription("네이버 쇼핑 결과를 보여드려요")
    .addStringOption(option =>
        option.setName("shop_name")
            .setDescription("contents to shop")
            .setRequired(true))
    return command.toJSON();
}

const execute = (interaction) => {
    var query = interaction.options.getString("shop_name");
    async function reply() {
        try{
            async function reply(json) {
                let title = (json.title).replace(/<b>/gi,'').replace(/<\/b>/gi,'');
                let url = json.link;
                let url_img = json.image;
                let lprice = json.lprice;
                let hprice = json.hprice;
                let mall;
                try{ mall = json.mallName; } catch { mall = '-'; }
                lprice = lprice == '' ? "-" : lprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                hprice = hprice == '' ? "-" : hprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                const shopping_Embed = new EmbedBuilder()
                .setColor(0xffffff)
                .setTitle(title)
                .setURL(url)
                .setDescription(`${json.category1} > ${json.category2} > ${json.category3}`)
                .setThumbnail(url_img)
                .addFields(
                    { name: "최저가", value: `**${lprice}**`, inline: true },
                    { name: "최고가", value: `${hprice}`, inline: true },
                )
                .setFooter({ text: `${json.brand} | 판매처 : ${mall} | Naver API`});
                await interaction.reply({ embeds: [shopping_Embed]});
            }

            const url = `https://openapi.naver.com/v1/search/shop.json?query=`+encodeURI(query)+`&display=100&start=1&sort=sim&exclue=used:rental`;
            axios.get(url, {
                headers: {
                    'X-Naver-Client-Id' : privateKey.X_Naver_Client_Id,
                    'X-Naver-Client-Secret' : privateKey.X_Naver_Client_Secret
                }
            })
            .then(res => res.data)
            .then(data => {
                if(data.items.length==0){
                    const shopping_Embed_Nah = new EmbedBuilder()
                    .setColor(0xffbc57)
                    .setTitle('검색하신 상품이 존재하지 않습니다')
                    .setFooter({ text: `Naver API`});
                    interaction.reply({ embeds: [shopping_Embed_Nah], ephemeral: true});
                    return;
                }
                var filtered_item = [];
                for(let i=0; i<100; i++){
                    try{
                        if(data.items[i].mallName=="네이버"){
                            if((data.items[i].title).indexOf("대여")==-1){
                                if((data.items[i].brand)!==''){
                                    filtered_item.push(data.items[i]);
                                }
                            }
                        }
                    } catch {
                        filtered_item.push(data.items[0]);
                    }
                }
                if(filtered_item.length==0){
                    reply(data.items[0]);
                } else {
                    reply(filtered_item[0]);
                }
            });
        } catch(error) {
            const err_embed = new EmbedBuilder()
            .setColor(0xff5757)
            .setTitle('에러가 발생했습니다')
            .setTimestamp()
            interaction.reply({ embeds: [err_embed], ephemeral: true});
            webhookClient_Error.send({
                content: '**Naver Shopping ERROR**\n```'+error.stack+'```'
            });
        }

    }
    reply();
}

export { create, execute };