const once = false;
const name = 'interactionCreate';

const guildVoiceData = {};

async function execute(interaction) {
    // console.log(`\n[Command Created : ${interaction.commandName}]`);
    // console.log(`[interaction.customId : ${interaction.customId}]`);
    const command = interaction.commandName;
    const client = interaction.client;

    if (!command) {
        // Command Handle
        try {
            const author = interaction.user.id;
            const guildId = interaction.guildId;

            // Music Interaction - DEPRECATED ON SERVER
            const guild = client.guilds.cache.get(interaction.guildId)
            const member = guild.members.cache.get(interaction.member.user.id);
            const voiceChannel = member.voice.channel;

            if (!guildVoiceData[guildId]) {
                guildVoiceData[guildId] = {
                    queue: [],
                    player: null,
                    connection: null,
                    isPause: false,
                    isFirst: true
                };
            }

            const guildQueue = guildVoiceData[guildId].queue;
            const guildPlayer = guildVoiceData[guildId].player;
            let guildConnection = guildVoiceData[guildId].connection;
            var isPause = guildVoiceData[guildId].isPause;
            var isFirst = guildVoiceData[guildId].isFirst;

            // 곡 재생 함수
            async function playNext(interaction, guildId) {
                if (guildQueue.length === 0) {
                    await interaction.editReply({
                        embeds: [Music_embed_default],
                        components: [MusicComponents_row1, MusicComponents_row2],
                    });
                    guildConnection.disconnect(); // 큐가 비면 연결 종료
                    guildVoiceData[guildId].connection = null; // 연결 상태 초기화
                    return;
                }

                const url = guildQueue[0]; // 큐의 첫 번째 곡
                const stream = ytdl(url, {
                    filter: format =>
                        format.audioQuality === "AUDIO_QUALITY_MEDIUM" &&
                        format.hasVideo === false &&
                        format.hasAudio === true &&
                        format.container === "mp4",
                    highWaterMark: 1 << 25,
                    liveBuffer: 1 << 25,
                    requestOptions: {
                        maxRedirections: 5
                    }
                });

                const info = await ytdl.getBasicInfo(url);
                let Title = info.player_response.videoDetails.title;
                let thumbnailArr = info.player_response.videoDetails.thumbnail.thumbnails;
                let Thumbnail_Image = thumbnailArr[thumbnailArr.length-1].url;

                guildVoiceData[guildId].player = createAudioPlayer();
                const resource = createAudioResource(stream);

                guildVoiceData[guildId].player.play(resource);
                guildConnection.subscribe(guildVoiceData[guildId].player);

                const Music_embed_inplay = new EmbedBuilder()
                .setTitle(Title)
                .setURL(url)
                .setColor(0xffffff)
                .setImage(Thumbnail_Image)
                .setTimestamp()
                .setFooter({ text: '뭉이 - 음악패널 | 🎧 현재 음악 재생중', iconURL: 'https://cdn.discordapp.com/avatars/896317141329006622/f640361a3b7722b9c4add0fa1888d26d.webp?size=80'})
                
                if(isFirst){
                    isFirst = false;
                    await interaction.update({
                        embeds: [Music_embed_inplay],
                        components: [MusicComponents_row1, MusicComponents_row2],
                    });
                } else {
                    await interaction.editReply({
                        embeds: [Music_embed_inplay],
                        components: [MusicComponents_row1, MusicComponents_row2],
                    });
                }

                guildVoiceData[guildId].player.on(AudioPlayerStatus.Idle, () => {
                    guildQueue.shift();
                    playNext(interaction, guildId);
                });

                guildVoiceData[guildId].player.on('error', error => {
                    console.log(error);
                    console.error(`플레이어 오류: ${error.message}`);
                    guildQueue.shift();
                    playNext(interaction, guildId);
                });
            }

            if (interaction.customId === 'm_player') {
                if (guildPlayer && isPause){
                    guildPlayer.unpause();
                    guildVoiceData[guildId].isPause = false;
                    await interaction.reply({
                        content: "음악이 재개되었어요",
                        ephemeral: true
                    });
                    return;
                } else {
                    const modal = new ModalBuilder()
                        .setCustomId('msearch_modal')
                        .setTitle('음악 링크');
                    const m_search = new TextInputBuilder()
                        .setCustomId('MusicPanel_search')
                        .setLabel("재생할 음악의 유튜브 링크를 입력해주세요")
                        .setStyle(TextInputStyle.Short);
                    const row1 = new ActionRowBuilder()
                        .addComponents(m_search);
                    modal.addComponents(row1);
                    await interaction.showModal(modal);
                }
            }
            if (interaction.customId === 'm_pause') {
                if(guildPlayer && !isPause){
                    guildPlayer.pause();
                    guildVoiceData[guildId].isPause = true;
                    await interaction.reply({
                        content: "음악이 일시중지되었어요",
                        ephemeral: true
                    });
                    return;

                } else {
                    await interaction.reply({
                        content: "음성채널에 접속후, 음악을 튼 상태로 실행해주세요",
                        ephemeral: true
                    });
                    return;
                }
            }
            if (interaction.customId === 'm_stop') {
                if (guildPlayer) {
                    guildPlayer.stop(); // 현재 재생 중인 곡 정지
                    guildQueue.length = 0; // 큐 비우기
                    guildConnection.disconnect(); // 연결 종료
                    guildVoiceData[guildId].connection = null;

                    await interaction.update({
                        embeds: [Music_embed_default],
                        components: [MusicComponents_row1, MusicComponents_row2],
                    });
                    return;
                } else {
                    await interaction.reply({
                        content: "음성채널에 접속후, 음악을 튼 상태로 실행해주세요",
                        ephemeral: true
                    });
                    return;
                }
            }
            if (interaction.customId === 'm_skip') {
                if (guildPlayer){
                    guildPlayer.stop();
                    return;
                } else {
                    await interaction.reply({
                        content: "음성채널에 접속후, 음악을 튼 상태로 실행해주세요",
                        ephemeral: true
                    });
                    return;
                }
            }
            if (interaction.customId === 'm_search') {
                // modal
                const modal = new ModalBuilder()
                    .setCustomId('msearch_modal')
                    .setTitle('음악 링크');
                const m_search = new TextInputBuilder()
                    .setCustomId('MusicPanel_search')
                    .setLabel("재생할 음악의 유튜브 링크를 입력해주세요")
                    .setStyle(TextInputStyle.Short);
                const row1 = new ActionRowBuilder()
                    .addComponents(m_search);
                modal.addComponents(row1);
                await interaction.showModal(modal);
            }
            if (interaction.customId === 'm_queue') {
                // embed
                if(guildQueue.length==0){
                    await interaction.reply({
                        content: "대기열이 존재하지 않아요",
                        ephemeral: true
                    });
                    return;
                }
                let queueArr = [];
                let x=1;
                for (const url of guildQueue) {
                    const info = await ytdl.getBasicInfo(url);
                    queueArr.push(`${x}. [${info.player_response.videoDetails.title}](${url})`);
                    x++;
                }
                let description = queueArr.join("\n");
                const m_queue_embed = new EmbedBuilder()
                .setTitle("📑 대기열")
                .setDescription(description)
                .setTimestamp()

                await interaction.reply({
                    embeds: [m_queue_embed],
                    ephemeral: true
                });
                return;
            }

            if (interaction.customId === 'msearch_modal') {
                const music_url = interaction.fields.getTextInputValue('MusicPanel_search');
                const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
                if(!youtubeRegex.test(music_url)){
                    await interaction.reply({
                        content: "올바른 유튜브 링크를 입력해주세요",
                        ephemeral: true
                    });
                    return;
                }
                if (!voiceChannel) return interaction.reply('음성 채널에 먼저 들어가 주세요.');

                if (!guildConnection) {
                    guildConnection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: guildId,
                        adapterCreator: guild.voiceAdapterCreator,
                    });
                    guildVoiceData[guildId].connection = guildConnection; // 커넥션 업데이트
                }

                guildQueue.push(music_url);
                if (guildQueue.length === 1) { // 큐에 첫 번째 곡이 추가된 경우
                    playNext(interaction, guildId); // 다음 곡 재생
                } else {
                    await interaction.reply({
                        content: "등록되었습니다",
                        ephemeral: true
                    });
                    return;
                }
                return;
            }

            // News Handler
            if (interaction.customId == "news_press") {
                BotCache_news.set('NEWS_PRESS', interaction.values[0]);
                const select_area = new StringSelectMenuBuilder()
                    .setCustomId('news_area')
                    .setPlaceholder('분야를 선택해 주세요!')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('주요뉴스')
                            .setValue('주요뉴스'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('정치')
                            .setValue('정치'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('경제')
                            .setValue('경제'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('사회')
                            .setValue('사회'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('생활')
                            .setValue('생활'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('세계')
                            .setValue('세계'),
                    );

                const row_area = new ActionRowBuilder()
                    .addComponents(select_area);
                await interaction.update({
                    content: `${interaction.values[0]} 뉴스에서 어떤 분야를 찾으시나요?`,
                    components: [row_area]
                });
            }

            if (interaction.customId == "news_area") {
                let News_press = BotCache_news.get('NEWS_PRESS');
                let News_area = interaction.values[0];

                /**
                 * Crawling Naver News
                 * @param {String} url 
                 * @param {Boolean} isMain true : Main News / false : Sub News
                */
                // * @param {String} type p1 : page1 (0~5) / p2 : page2 (5~10) ------ deprecated
                async function get_News(url, isMain) {
                    const getHTML = async () => {
                        return await axios.get(url, {
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
                            }
                        });
                    };

                    await getHTML()
                        .then(async (html) => {
                            const $ = cheerio.load(html.data);

                            let $bodyli
                            if (isMain) {
                                $bodyli = $('div.press_edit_news._nudge_wrap._CURATION_CARD ul li.press_edit_news_item.as_thumb');
                            } else {
                                $bodyli = $('div.press_edit_news ul li.press_edit_news_item.as_thumb');
                            }

                            const News_arr = [];
                            $bodyli.each((i, element) => {
                                const title = $(element).find('a span.press_edit_news_text span.press_edit_news_title').text().trim();
                                const link = $(element).find('a').attr('href');
                                let News_ = `${i + 1}. [${title}](${link})`;
                                News_arr.push(News_);
                            });
                            // let News = type=="p1" ? News_arr.slice(0,5) : News_arr.slice(5,10); ------ deprecated
                            let News = News_arr.slice(0, 6);

                            let result_txt = String(News.join('\n'));
                            const Embed_News = new EmbedBuilder()
                                .setTitle(`${News_press} 뉴스 (${News_area})`)
                                .setURL(url)
                                .setColor(0x0085CD)
                                .setDescription(result_txt)
                                .setTimestamp()
                                .setFooter({ text: `Source : Naver` })
                            await interaction.update({
                                content: '',
                                embeds: [Embed_News],
                                components: []
                            });

                        })
                        .catch(error => {
                            let ERROR_EMBED = new EmbedBuilder()
                                .setTitle("에러가 발생했어요 :(\n제한시간이 지났을수도 있어요. 다시 시도해주세요")
                                .setColor('#ffcc80')
                                .setTimestamp();
                            interaction.update({
                                content: '',
                                components: [],
                                embeds: [ERROR_EMBED]
                            });
                            webhookclient_Error.send({
                                content: '**NEWS INFO ERROR**\n```' + error.stack + '```'
                            });
                            return;
                        });
                }


                let NEWS_PRESS_DICT = {
                    'KBS': '056',
                    'MBC': '214',
                    '연합': '001',
                    'JTBC': '437',
                    'YTN': '052',
                    '중앙일보': '025'
                }

                let NEWS_AREA_DICT = {
                    '주요뉴스': '',
                    '정치': '?sid=100',
                    '경제': '?sid=101',
                    '사회': '?sid=102',
                    '생활': '?sid=103',
                    '세계': '?sid=104'
                }
                const url = `https://media.naver.com/press/${NEWS_PRESS_DICT[News_press]}${NEWS_AREA_DICT[News_area]}`;
                const isMain = News_area == "주요뉴스" ? true : false;
                await get_News(url, isMain);
                BotCache_news.del('NEWS_PRESS');
            }

            // Error Report Handler
            if (interaction.customId === 'modal_err') {
                const report_input = interaction.fields.getTextInputValue('report_input');
                SubFunction.err_input(report_input, author);
                await interaction.reply({ content: '오류가 정상적으로 등록됬어요!', ephemeral: true });
                return;
            }

            // School Register
            if (interaction.customId == 'BTN_confirm_lch_pkl_BTN') {
                SubFunction.Lunch_delete(author);
                const lch_change = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle(`등록된 학교가 삭제되었어요!`)
                    .setDescription('이제 다시 ``/학교등록`` 으로 학교를 등록해 주세요')
                await interaction.update({ embeds: [lch_change], fetchReply: true, components: [], ephemeral: true });
                return;

            } else if (interaction.customId == 'BTN_dismiss_lch_pkl_BTN') {
                const lch_cancel = new EmbedBuilder()
                    .setColor(0xff7575)
                    .setTitle(`학교 등록이 취소되었어요!`)
                await interaction.update({ embeds: [lch_cancel], components: [], fetchReply: true, ephemeral: true });
                return;
            }
            /**
             * @todo ps_json_leng에 따라 자동으로 버튼 생성
             */
            if (interaction.customId === 'sch_reg') {
                /**학교명 */
                const sch_input = interaction.fields.getTextInputValue('sch_input');
                try {
                    const school_code_jsn = await SubFunction.school_code(sch_input, config.neis_key);   // school code (json)
                    BotCache.set('LUNCH_INPUT_fO221', sch_input);
                    /**중복되는 학교 갯수 */
                    let ps_json_leng = school_code_jsn.length;

                    if (ps_json_leng > 1) {
                        var city_arr = [];
                        for (let i = 0; ps_json_leng > i; i++) {
                            city_arr.push(`${i + 1}. **${school_code_jsn[i].LCTN_SC_NM}**`);
                        }
                        let city_str = city_arr.join("\n")
                        var cty = new EmbedBuilder()
                            .setColor(0xffffff).setTitle(`어느지역의 ${sch_input} 인지 알려주세요!`)
                            .addFields(
                                { name: "목록", value: city_str, inline: true },
                            )

                        if (ps_json_leng == 2) {
                            const BTN_lch_2 = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_1')
                                        .setLabel('[ 1 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_2')
                                        .setLabel('[ 2 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                            await interaction.reply({ embeds: [cty], components: [BTN_lch_2], fetchReply: true, ephemeral: true });

                        } else if (ps_json_leng == 3) {
                            const BTN_lch_3 = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_3')
                                        .setLabel('[ 1 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_4')
                                        .setLabel('[ 2 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_5')
                                        .setLabel('[ 3 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                            await interaction.reply({ embeds: [cty], components: [BTN_lch_3], fetchReply: true, ephemeral: true });

                        } else if (ps_json_leng == 4) {
                            const BTN_lch_4 = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_6')
                                        .setLabel('[ 1 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_7')
                                        .setLabel('[ 2 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_8')
                                        .setLabel('[ 3 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId('BTN_lch_9')
                                        .setLabel('[ 4 ]')
                                        .setStyle(ButtonStyle.Secondary),
                                )
                            await interaction.reply({ embeds: [cty], components: [BTN_lch_4], fetchReply: true, ephemeral: true });
                        }
                    } else {
                        BotCache.flushAll();
                        var sch_SCHUL_NM = String(school_code_jsn[0].SCHUL_NM);
                        var sch_ORG_RDNDA = String(school_code_jsn[0].ORG_RDNDA);
                        SubFunction.Lunch_input(author, sch_SCHUL_NM, 0);

                        const LCH_reg = new EmbedBuilder()
                            .setColor(0xffffff)
                            .setTitle("이 학교가 맞나요?")
                            .setDescription(sch_ORG_RDNDA);

                        const BTN_lch = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('BTN_confirm')
                                    .setLabel('맞아요!')
                                    .setStyle(ButtonStyle.Success),
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('BTN_dismiss')
                                    .setLabel('아니에요!')
                                    .setStyle(ButtonStyle.Secondary),
                            )
                        await interaction.reply({ embeds: [LCH_reg], components: [BTN_lch], fetchReply: true, ephemeral: true });
                    }
                } catch {
                    const LCH_ERR = new EmbedBuilder()
                        .setColor(0xdc495d)
                        .setTitle("에러가 발생했어요!")
                        .setDescription("학교명을 올바르게 기입했는지 확인해주세요 (대학교 X)");
                    await interaction.reply({ embeds: [LCH_ERR], fetchReply: true, ephemeral: true });
                    return;
                }

            }

            if (interaction.customId == 'BTN_lch_1' || interaction.customId == 'BTN_lch_3' || interaction.customId == 'BTN_lch_6') {
                var sch_input = BotCache.get('LUNCH_INPUT_fO221')
                BotCache.flushAll();
                try {
                    var ps_json = await SubFunction.school_code(sch_input, config.neis_key);
                    var sch_SCHUL_NM = String(ps_json[0].SCHUL_NM);
                    var sch_ORG_RDNDA = String(ps_json[0].ORG_RDNDA);
                } catch {
                    const LCH_ERR = new EmbedBuilder()
                        .setColor(0xdc495d)
                        .setTitle("에러가 발생했어요!")
                        .setDescription(".");
                    await interaction.update({ embeds: [LCH_ERR], fetchReply: true, ephemeral: true });
                    return;
                }
                SubFunction.Lunch_input(author, sch_SCHUL_NM, 0)

                const LCH_reg = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle("이 학교가 맞나요?")
                    .setDescription(sch_ORG_RDNDA);

                const BTN_lch = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_confirm')
                            .setLabel('맞아요!')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_dismiss')
                            .setLabel('아니에요!')
                            .setStyle(ButtonStyle.Secondary),
                    )
                await interaction.update({ embeds: [LCH_reg], components: [BTN_lch], fetchReply: true, ephemeral: true });
            } else if (interaction.customId == 'BTN_lch_2' || interaction.customId == 'BTN_lch_4' || interaction.customId == 'BTN_lch_7') {
                var sch_input = BotCache.get('LUNCH_INPUT_fO221');
                BotCache.flushAll();
                var ps_json = await SubFunction.school_code(sch_input, config.neis_key);
                var sch_SCHUL_NM = String(ps_json[1].SCHUL_NM);
                var sch_ORG_RDNDA = String(ps_json[1].ORG_RDNDA);
                SubFunction.Lunch_input(author, sch_SCHUL_NM, 1);

                const LCH_reg = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle("이 학교가 맞나요?")
                    .setDescription(sch_ORG_RDNDA);

                const BTN_lch = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_confirm')
                            .setLabel('맞아요!')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_dismiss')
                            .setLabel('아니에요!')
                            .setStyle(ButtonStyle.Secondary),
                    )
                await interaction.update({ embeds: [LCH_reg], components: [BTN_lch], fetchReply: true, ephemeral: true });
            } else if (interaction.customId == 'BTN_lch_5' || interaction.customId == 'BTN_lch_8') {
                var sch_input = BotCache.get('LUNCH_INPUT_fO221');
                BotCache.flushAll();
                var ps_json = await SubFunction.school_code(sch_input, config.neis_key);
                var sch_SCHUL_NM = String(ps_json[2].SCHUL_NM);
                var sch_ORG_RDNDA = String(ps_json[2].ORG_RDNDA);
                SubFunction.Lunch_input(author, sch_SCHUL_NM, 2);

                const LCH_reg = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle("이 학교가 맞나요?")
                    .setDescription(sch_ORG_RDNDA);

                const BTN_lch = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_confirm')
                            .setLabel('맞아요!')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_dismiss')
                            .setLabel('아니에요!')
                            .setStyle(ButtonStyle.Secondary),
                    )
                await interaction.update({ embeds: [LCH_reg], components: [BTN_lch], fetchReply: true, ephemeral: true });
            } else if (interaction.customId == 'BTN_lch_9') {
                var sch_input = BotCache.get('LUNCH_INPUT_fO221');
                BotCache.flushAll();
                var ps_json = await SubFunction.school_code(sch_input, config.neis_key);
                var sch_SCHUL_NM = String(ps_json[3].SCHUL_NM);
                var sch_ORG_RDNDA = String(ps_json[3].ORG_RDNDA);
                SubFunction.Lunch_input(author, sch_SCHUL_NM, 3);

                const LCH_reg = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle("이 학교가 맞나요?")
                    .setDescription(sch_ORG_RDNDA);

                const BTN_lch = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_confirm')
                            .setLabel('맞아요!')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('BTN_dismiss')
                            .setLabel('아니에요!')
                            .setStyle(ButtonStyle.Secondary),
                    )
                await interaction.update({ embeds: [LCH_reg], components: [BTN_lch], fetchReply: true, ephemeral: true });
            }

            // School register confirm
            if (interaction.customId == 'BTN_confirm') {
                console.log('[ School Data has changed ]');
                const LCH_SUC = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle("학교가 정상적으로 등록되었어요!")
                    .setDescription(":)");
                await interaction.update({ embeds: [LCH_SUC], fetchReply: true, components: [], ephemeral: true });
            } else if (interaction.customId == 'BTN_dismiss') {
                SubFunction.Lunch_delete(author);
                const lch_cancel = new EmbedBuilder()
                    .setColor(0xff7575)
                    .setTitle(`학교 등록이 취소되었어요!`)
                await interaction.update({ embeds: [lch_cancel], fetchReply: true, components: [], ephemeral: true });
                return;
            }

            // Grade Calculation
            if (interaction.customId === 'modal_gc') {
                const gc_input = interaction.fields.getTextInputValue('gc_input');
                function get(content) {
                    var content_arr = (content.replace(/\s/gi, "")).split(",");
                    var grade_arr = [];
                    for (let index in content_arr) {
                        var arr = content_arr[index];
                        var percentage = Math.floor(Number(arr.split("/")[0]) / Number(arr.split("/")[1]) * 100);
                        function calc(percentage) {
                            if (percentage < 4) { return 1; }
                            else if (percentage < 11) { return 2; }
                            else if (percentage < 23) { return 3; }
                            else if (percentage < 40) { return 4; }
                            else if (percentage < 60) { return 5; }
                            else if (percentage < 77) { return 6; }
                            else if (percentage < 89) { return 7; }
                            else if (percentage < 96) { return 8; }
                            else if (percentage < 100) { return 9; }
                        }
                        grade_arr.push(calc(percentage));
                    }
                    return grade_arr.join(", ");
                }
                let grade = get(gc_input);
                await interaction.reply({ content: grade, ephemeral: true })
            }
        } catch (error) {
            webhookclient_Error.send({
                content: '**Interaction Handler ERROR**\n```' + error.stack + '```'
            });
        }
    } else {
        try {
            (await import(`#commands/${interaction.commandName}`)).execute(interaction);
        } catch (error) {
            webhookclient_Error.send({
                content: '**Interaction Handler ERROR**\n' + `Error executing ${interaction.commandName}\n` + '```' + error.stack + '```'
            });
            console.error(`Error executing ${interaction.commandName}`);
        }
    }
}

export { once, name, execute };