
/**
 * @param {string} message 
 * @param {string} content 
 * @param {string} author 
 * @returns 
 */
async function lunch_(message, content, author) {
    if (content == prefix_lch3 || content == prefix_lch4 || content == prefix_lch5 || content == prefix_lch6) content = "내일 급식";
    content = content.replace(prefix, "");

    class CustomDate {
        constructor() {
            this.lts = new Date();
            this.kst = new Date(this.lts.getTime() + (9 * 60 * 60 * 1000));
        }

        logDate() {
            console.log(`Local Time: ${this.lts}`);
            return;
        }

        adjust_format(value) {
            return value.length == 1 ? `0${value}` : value;
        }

        /**
         * @param {Number} type
         * @returns Type1 = YYYY/MM/DD || Type2 = YYYYMMDD
         */
        getDate(type) {
            let Year = String(this.kst.getUTCFullYear());
            let Month = this.adjust_format(String(this.kst.getUTCMonth() + 1));
            let Day = this.adjust_format(String(this.kst.getUTCDate()));
            return type == 1 ? `${Year}/${Month}/${Day}` : `${Year}${Month}${Day}`;
        }

        addDate(gap) {
            this.kst.setDate(this.kst.getDate() + gap);
            let Year = String(this.kst.getUTCFullYear());
            let Month = this.adjust_format(String(this.kst.getUTCMonth() + 1));
            let Day = this.adjust_format(String(this.kst.getUTCDate()));

            return `${Year}${Month}${Day}`;
        }

        checkWeekends() {
            let Day = this.kst.getDay();
            return Day == 0 || Day == 6 ? true : false;
        }

        resetDate() {
            this.kst = new Date(this.lts.getTime() + (9 * 60 * 60 * 1000));
            return;
        }
    }

    const custom_date = new CustomDate();

    let prompt_lunch = `
    해당 문장은 사용자가 특정날짜의, 특정학교의 급식을 요청하는 문장이다.
    문장을 분석하여, 학교/날짜/날짜차이 의 형식으로 리턴한다.
    1. 학교명은 반드시 끝까지. (ex. 길동여고(x) 길동여자고등학교(o))(감지되지 않으면 x 라고 표기)
    2. 사용자가 말한 날짜를 YYYY.MM.DD로 표기함. (ex. 2024.09.21) 단, 사용자의 발화에 'mm/dd', 'mm월 dd일', 'YYYY.MM.DD' 등 **정확한 날짜가 명시**되어 있는 경우에만 해당 날짜를 표기함. 명시되어 있지 않은 경우,${custom_date.getDate(1)}의 날짜를 리턴. ( ex. '이뭉아 음.. 오늘이 9월 30일인데 어제 급식이 뭐더라' : x/2024.09.30/-1)
    3. 날짜차이는 사용자의 발화에서 '저번주', '내일모레' 등의 표현을 정수로 나타냄. (ex. 내일모레 : 2, 저번주:-7, 다다음주:14, 그저께:-2)(감지되지 않으면 0으로 표기함)

        `;
    const openai_comp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: prompt_lunch },
            { role: "user", content: content, },
        ],
    });

    let ai_res = openai_comp.choices[0].message.content;
    message.channel.send(ai_res);

    let ai_res_arr = ai_res.split("/");
    let school_name = ai_res_arr[0];
    let date = ai_res_arr[1];
    let date_gap = Number(ai_res_arr[2]);

    return;
    // DB에서 가져온 학교 인덱스 값
    var index_check_NUM = 0;
    var sch_index = 0;
    if (school_name === undefined) {
        var sch_name_DIR = await SubFunction.Lunch_output(author);	// DB에서 학교명 빼옴
        if (sch_name_DIR === undefined) {
            await message.channel.send("`/학교등록`으로 학교를 등록해주세요!");
            return;
        } else {
            school_name = String(sch_name_DIR);
            sch_index = await SubFunction.Lunch_output_index(author);
            index_check_NUM += 1;	// 0일경우 학교 등록 요청
        }
    }
    // End -- (Detect School)

    var Date_frmt = `${Year}/${Detected_month}/${Detected_day}`;	// 디스코드 임베드용
    Detected_month = Adjust(Detected_month);
    Detected_day = Adjust(Detected_day);
    var Date_url = `${Year}${Detected_month}${Detected_day}`;	// API 요청용

    // 주말 여부 체크
    if (custom_date.checkWeekends()) {
        const lch = new EmbedBuilder()
            .setColor(0xffffff).setTitle(`주말엔 급식정보가 없어요!`)
            .setDescription(`${Date_frmt} (은) 주말이에요!`)
        await message.channel.send({ embeds: [lch] });
        return;
    }
    console.log(school_name, Date_url);

    // Get School Code
    var ps_json = await SubFunction.school_code(school_name, config.neis_key);
    var ps_json_leng = ps_json.length;	// 학교명이 겹치는 경우 2이상
    var code_arr = [];
    for (let i in ps_json) {
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
        await message.channel.send({ embeds: [lch] });
    }

    async function res_nah(school_name, date_frmt) {
        const lch_nah = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle(`급식 정보를 찾을 수 없어요!`)
            .setDescription("급식이 나이스에 등록되어있지 않거나\n오류가 발생했을수도 있어요 👀")
            .setTimestamp()
            .setFooter({ text: `만약 제가 날짜, 학교 등을 잘못 감지한것 같다면 /오류신고 로 알려주세요! || \n<감지된 학교 : ${school_name} / 날짜 : ${date_frmt}>` })
        await message.channel.send({ embeds: [lch_nah] });
    }

    /**
     * @param {Number} index 학교 인덱스값
     * @returns 디스코드 임베드 전송 (반환값 없음)
     */
    async function lch___(index) {
        var ATPT_OFCDC_SC_CODE = ps_json[index].ATPT_OFCDC_SC_CODE;
        var SD_SCHUL_CODE = ps_json[index].SD_SCHUL_CODE;
        var lch_menu = await SubFunction.school_menu(config.neis_key, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, Date_url).catch(error => {
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

    try {
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
    } catch (error) {
        message.channel.send("알 수 없는 에러가 발생헀어요. :(\n```(이 오류는 자동으로 신고될거에요)```");
        webhookclient_Error.send({
            content: "Lunch module Unknown Err : " + error.stack
        });
    }

}

export { lunch_ as default };
