
/**
 * @param {string} message 
 * @param {string} content 
 * @param {string} author 
 * @returns 
 */
async function lunch_(message, content, author){
    content = content.replace(prefix, "");
    content = content.replace(/의+\s/gi," "); content = content.replace(/그리고/gi," ");

    content = content.replace(/여고/gi, "여자고");	//Exception-1
    const contentArr = content.split(" ");
    const contentLeng = contentArr.length;
    const DTE_utc = new Date();
    const DTE = new Date(DTE_utc.getTime() + (9 * 60 * 60 * 1000));

    // MM/DD, 슬래시 꼴의 날짜를 MM (DD)th의 형태로 번형
    const matchSlash_form = content.match(/(\d+)\/(\d+)/g);
    if (matchSlash_form) {
        let text_arr = (matchSlash_form[0]).split("/");
        let monthSlash_form = month[text_arr[0]-1];
        let daySlash_form = (text_arr[1])==1 ? "1st" : (text_arr[1])==2 ? "2nd" : (text_arr[1])==3 ? "3rd" : `${text_arr[1]}th`;
        let replacementString = `${monthSlash_form} ${daySlash_form}`;
        content = content.replace(/(\d+)\/(\d+)/g, replacementString);
    }

    // 학교 감지
    var school_name;
    for (let i = 0; i < contentLeng; i++) {
        var contentArr_Dok = contentArr[i];
        if (contentArr_Dok.endsWith("초") || contentArr_Dok.endsWith("고")) {
            contentArr_Dok = contentArr_Dok + '등학교';
        } else if (contentArr_Dok.endsWith("중")) {
            contentArr_Dok = contentArr_Dok + '학교';
        } else {
            contentArr_Dok = false;	// 감지된 학교 X
        }
        // 영어로 번역한 후, 학교명이라고 잘못 감지된 단어 ex. 그리고(and) 필터링
        if (contentArr_Dok !== false) {
            let Translated_SCH_name = String(await SubFunction.PAPAGO_translate(contentArr_Dok, 'en'));
            let Tag_Arr = tagger.tagSentence(Translated_SCH_name);
            let leng = Tag_Arr.length;
            for (i = 0; i < leng; i++) {
                var val = Tag_Arr[i].value;
                var pos = Tag_Arr[i].pos;
                if (pos == 'NN' || pos == 'NNS' || pos == 'NNP' || pos == 'NNPS' || pos == '.' || pos == 'POS') {
                    school_name = contentArr_Dok;
                }
            }
        }
    }

    var index_check_NUM=0;
    /**
     * DB에서 가져온 학교 인덱스 값
     */
    var sch_index=0;
    if (school_name === undefined) {
        var sch_name_DIR = await SubFunction.Lunch_output(author);	// DB에서 학교명 빼옴
        if (sch_name_DIR === undefined) {
            await message.reply({
                content: "`/학교등록`으로 학교를 등록해주세요!",
                allowedMentions: { repliedUser: false }
            });
            return;
        } else {
            school_name = String(sch_name_DIR);
            sch_index = await SubFunction.Lunch_output_index(author);
            index_check_NUM += 1;	// 0일경우 학교 등록 요청
        }
    }
    // End -- (Detect School)

    // Get Date
    var Translated_CONTENT = String(await SubFunction.PAPAGO_translate(content, 'en'));
    Translated_CONTENT = Translated_CONTENT.replace(/Julie/g,"July");	// 7월이 Julie 라고 번역되는 경우 수정
    var Tag_Arr = tagger.tagSentence(Translated_CONTENT);
    let TagLeng = Tag_Arr.length;
    var Day_ARR = [];
    for (let i = 0; i < TagLeng; i++) {
        val = Tag_Arr[i].value;
        pos = Tag_Arr[i].pos;
        if (pos == 'JJ') {	// 품사가 날짜를 나타내면 숫자만 추출해서 배열에 push
            var dy = val.replace(/st/gi, ''); dy = dy.replace(/nd/gi, ''); dy = dy.replace(/rd/gi, ''); dy = dy.replace(/th/gi, '');
            Day_ARR.push(dy);
        }
    }

    // 상대적인 일수 차이 계산
    Detected_day = String(Day_ARR.join(' '));
    var Date_calc = await SubFunction.Check_Date_gap(Translated_CONTENT, content);
    if (Date_calc == 0) {
        if (SubFunction.Check_Date_gap_month(Translated_CONTENT, true)) {
            var Year = String(DTE.getFullYear());
            var Detected_month = String(SubFunction.Check_Date_gap_month(Translated_CONTENT, false));
            var Daterl = `${Year} ${Detected_month} ${Detected_day}`;
        } else {
            var Year = String(DTE.getFullYear());
            var Detected_month = String(DTE.getMonth() + 1);
            var Detected_day = String(DTE.getDate());
            var Daterl = `${Year} ${Detected_month} ${Detected_day}`;
        }
    } else {
        var Daterl = await SubFunction.CalculateDate(Date_calc);
        var Year = (Daterl.split(" "))[0];
        var Detected_month = (Daterl.split(" "))[1];
        var Detected_day = (Daterl.split(" "))[2];
    }

    /**
     * @param {*} value 
     * @returns ex. 2 => 02
    */
    function Adjust(value){
        if (value.length == 1) {
            return `0${value}`;
        } else {
            return value;
        }
    }
    var Date_frmt = `${Year}/${Detected_month}/${Detected_day}`;	// 디스코드 임베드용
    Detected_month = Adjust(Detected_month);
    Detected_day = Adjust(Detected_day);
    var Date_url = `${Year}${Detected_month}${Detected_day}`;	// API 요청용

    // 주말 여부 체크
    var PLA = new Date(`${Year}-${Detected_month}-${Detected_day}`);
    if (PLA.getDay() == 0 || PLA.getDay() == 6) {
        const lch = new EmbedBuilder()
        .setColor(0xffffff).setTitle(`주말엔 급식정보가 없어요!`)
        .setDescription(`${Date_frmt} (은) 주말이에요!`)
        await message.reply({ 
            embeds: [lch],
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    // End -- (Detect Date)

    // Get School Code
    var ps_json = await SubFunction.school_code(school_name, privateKey.neis_key);
    var ps_json_leng = ps_json.length;	// 학교명이 겹치는 경우 2이상
    var code_arr = [];
    for (let i in ps_json){
        code_arr.push(`${ps_json[i].ATPT_OFCDC_SC_CODE}@@${ps_json[i].SD_SCHUL_CODE}`);
    }
    // var code_str = String(code_arr);	// 학교명이 겹치는 경우

    // Function
    async function res(school_name, menu, date) {
        var lch_Arr = menu.split("$$");
        var lch_menu = lch_Arr[0];
        var lch_cal = lch_Arr[1];
        const lch = new EmbedBuilder()
            .setColor(0xffffff).setTitle(`${school_name} 급식`)
            .setDescription(`${lch_menu}`)
            .setFooter({ text: `식단 날짜 : ${date} | 총 칼로리 : ${lch_cal}` })
        await message.reply({ 
            embeds: [lch],
            allowedMentions: { repliedUser: false }
        });
    }

    async function res_nah(school_name, date_frmt) {
        const lch_nah = new EmbedBuilder()
        .setColor(0xffffff)
        .setTitle(`급식 정보를 찾을 수 없어요!`)
        .setDescription("급식이 나이스에 등록되어있지 않거나\n오류가 발생했을수도 있어요 👀")
        .setTimestamp()
        .setFooter({ text: `만약 제가 날짜, 학교 등을 잘못 감지한것 같다면 /오류신고 로 알려주세요! || \n<감지된 학교 : ${school_name} / 날짜 : ${date_frmt}>` })
        await message.reply({ 
            embeds: [lch_nah],
            allowedMentions: { repliedUser: false }
        });
    }

    /**
     * @param {Number} index 학교 인덱스값
     * @returns 디스코드 임베드 전송 (반환값 없음)
     */
    async function lch___(index){
        var ATPT_OFCDC_SC_CODE = ps_json[index].ATPT_OFCDC_SC_CODE;
        var SD_SCHUL_CODE = ps_json[index].SD_SCHUL_CODE;
        var lch_menu = await SubFunction.school_menu(privateKey.neis_key, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, Date_url).catch(error => {
            res_nah(school_name, Date_frmt);
            return "INFO-0100";
        });
        if (lch_menu === "INFO-200") {
            res_nah(school_name, Date_frmt);
            return;
        } else if (lch_menu === "INFO-0100") {
            return;
        } else {
            res(school_name, lch_menu, Date_frmt);
            return;
        }
    }
    
    try{
        if (ps_json_leng > 1) {	// 학교명이 중복되는 경우
            if (index_check_NUM == 1) {	// DB에 저장되어 있는 경우
                lch___(sch_index);
            }

            else {
                var city_arr = [];
                for (let i = 0; ps_json_leng > i; i++) {
                    city_arr.push(`${i + 1}. **${ps_json[i].LCTN_SC_NM}**`);
                }
                city_arr = city_arr.join("\n")

                const cty = new EmbedBuilder()
                    .setColor(0xffffff).setTitle(`어느지역의 ${school_name} 인지 알려주세요!`)
                    .addFields(
                        { name: "목록", value: city_arr, inline: true },
                    )
                    .setFooter({ text: '반응이 없을경우, 이 메세지는 1분후에 자동 삭제될거에요.' });
                const msg = await message.channel.send({ embeds: [cty], fetchReply: true });

                // Event_Reaction Clicked handler funtion
                async function handleCollect_01(reaction, user) {
                    if (reaction.emoji.name === '1️⃣') {
                        await msg.delete();
                        lch___(0);
                    } else if (reaction.emoji.name === '2️⃣') {
                        await msg.delete()
                        lch___(1);
                    }
                }

                async function handleCollect_012(reaction, user) {
                    if (reaction.emoji.name === '1️⃣') {
                        await msg.delete();
                        lch___(0);
                    } else if (reaction.emoji.name === '2️⃣') {
                        await msg.delete()
                        lch___(1);
                    } else if (reaction.emoji.name === '3️⃣') {
                        await msg.delete()
                        lch___(2);
                    }
                }

                // Get Reaction and Response
                if (ps_json_leng == 2) {
                    await msg.react('1️⃣').then(() => msg.react('2️⃣'));
                    const collector = msg.createReactionCollector({ max: 1, time: 60000 });

                    collector.on('collect', handleCollect_01);

                    collector.on('end', async collected => {
                        if (!msg.delete) {
                            await msg.delete()
                            // @ts-ignore
                            message.channel.send("시간이 초과되었습니다.");
                        }
                        return;
                    });
                }

                else if (ps_json_leng == 3) {
                    await msg.react('1️⃣').then(() => msg.react('2️⃣')).then(() => msg.react('3️⃣'));
                    const collector = msg.createReactionCollector({ max: 1, time: 60000 });

                    collector.on('collect', handleCollect_012);

                    collector.on('end', async collected => {
                        if (!msg.delete) {
                            await msg.delete()
                            // @ts-ignore
                            message.channel.send("시간이 초과되었습니다.");
                        }
                        return;
                    });
                }
            }
        }

        if (ps_json_leng == 1) { // 일반적인 경우
            lch___(0);
        }
    } catch(error) {
        webhookclient_Error.send({
            content: "Lunch module Unknown Err : " + error.stack
        });
        return 'M1';
    }

}

export { lunch_ as default };
