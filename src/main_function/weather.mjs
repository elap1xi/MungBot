
async function weather_(message){
    let content = message.content;
    try {
        content = content.replace(`${prefix} `,"").replace(`날씨`," ");
        var location_value = await Location.get_info(content);
        if (location_value == "CANNOT_FIND") { 
            const NoLocInfo_embds = new EmbedBuilder()
            .setColor(0xffffff).setTitle(`해당 지역을 찾을 수 없습니다.`)
            .setDescription('반드시 **지역명**을 입력해주세요')
            .setTimestamp()
            .setFooter({text: `Data : 공공데이터포털`})
            await message.reply({
                embeds: [NoLocInfo_embds],
                allowedMentions: { repliedUser: false }
            });
            return;
        }
        if (location_value == "Nah"){
            // let code = await SubFunction.Location_output(author);
            let code = undefined;
            if(code==undefined){
                const NoLocInfo_embds = new EmbedBuilder()
                .setColor(0xffffff).setTitle(`해당 지역을 찾을 수 없습니다.`)
                .setDescription('반드시 **지역명**을 입력해주세요')
                .setTimestamp()
                .setFooter({text: `Data : 공공데이터포털`})
                await message.reply({
                    embeds: [NoLocInfo_embds],
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            location_value = await Location.get_info_code(code)
        }
        const loc_arr = location_value.split(" ");
        // console.log(`감지된 지역 : ${loc_arr[3]} ${loc_arr[4]} ${loc_arr[5]}\n행정구역코드 : ${loc_arr[0]} / 위치 좌표 (${loc_arr[1]}, ${loc_arr[2]})`);
        var DTE = new Date();
        var Year = String(DTE.getFullYear());
        var Month = String(DTE.getMonth()+1);
        var Day = (DTE.getDate());	
        var Hour = DTE.getHours();
        var Min = DTE.getMinutes();

        let day = Hour==0 ? String(Day-1) : String(Day);
        let hour = Hour==0 ? "23" : String(Hour-1);

        var min = Min>45 ? "00" : "30";
        var month = Month.length==1 ? `0${Month}` : Month;
        day = day.length==1 ? `0${day}` : day;
        hour = hour.length==1 ? `0${hour}` : hour;
        
        var frst_base_date = `${Year}${month}${day}`;
        var frst_base_time = `${hour}${min}`;
        var url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${privateKey.apis_data_fcst_key}&dataType=JSON&numOfRows=100&pageNo=1&base_date=${frst_base_date}&base_time=${frst_base_time}&nx=${loc_arr[1]}&ny=${loc_arr[2]}`;

        var data = await SubFunction.weather(url);
        if((String(Hour+1)).length==1){ Hour_fcst = `0${Hour+1}`; }
        else { var Hour_fcst = String(Hour+1)}

        if(Hour_fcst=='24'){ Hour_fcst = '00'; }
        var index_fcst = [];
        var T1H, RN1, SKY, UUU, VVV, REH, PTY, LGT, VEC, WSD;
        for(let para in data){
            if(data[para].fcstTime==`${Hour_fcst}00`){
                index_fcst.push(para);
                if(data[para].category=="T1H"){	T1H = data[para].fcstValue}
                if(data[para].category=="RN1"){ RN1 = data[para].fcstValue}
                if(data[para].category=="SKY"){ SKY = data[para].fcstValue}
                if(data[para].category=="UUU"){ UUU = data[para].fcstValue}
                if(data[para].category=="VVV"){ VVV = data[para].fcstValue}
                if(data[para].category=="REH"){ REH = data[para].fcstValue}
                if(data[para].category=="PTY"){ PTY = data[para].fcstValue}
                if(data[para].category=="LGT"){ LGT = data[para].fcstValue}
                if(data[para].category=="VEC"){ VEC = data[para].fcstValue}
                if(data[para].category=="WSD"){ WSD = data[para].fcstValue}
            }
        }
        // console.log("DATA : ",T1H, RN1, SKY, UUU, VVV, REH, PTY, LGT, VEC, WSD);
        if(T1H==undefined || RN1==undefined || SKY==undefined || UUU==undefined || VVV==undefined || REH==undefined || PTY==undefined || LGT==undefined || VEC==undefined || WSD==undefined){
            const WeatherErrUnknown_embds = new EmbedBuilder()
            .setColor(0xffffff).setTitle(`날씨를 가져오는데 에러가 발생했어요`)
            .setTimestamp()
            .setFooter({text: `Data : 공공데이터포털`})
            await message.reply({
                embeds: [WeatherErrUnknown_embds],
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        let Rain;
        if(RN1=='강수없음'){ Rain = '강수없음'; } 
        else { Rain = `${RN1}`; }

        let Sky;
        if(SKY==1){ Sky = '맑음'; }
        else if(SKY==3){ Sky = '구름 많음'; } 
        else if(SKY==4){ Sky = '흐림'}

        let Pty;
        if(PTY==0){ Pty = ''; } 
        else if(PTY==1){ Pty = '(비)'; }
        else if(PTY==2){ Pty = '(비/눈)'; }
        else if(PTY==3){ Pty = '(눈)'; }
        else if(PTY==5){ Pty = '(빗방울)'; }
        else if(PTY==6){ Pty = '(빗방울만 날림)'; }
        else if(PTY==7){ Pty = '(눈날림)'; }

        let Humidity = `${REH}%`;
        let Ligtening = `${LGT}kA`;
        let Wind_Direction = `${VEC}`;
        let Wind_Speed = `${WSD}m/s`;
        let loc_3;
        if(loc_arr[5]){ loc_3 = `(${loc_arr[5]})`; }
        else { loc_3 = ''; }
        let location = `${loc_arr[3]} ${loc_arr[4]} ${loc_3}`;

        async function weather_embed(location, T1H, Sky, Rain, Pty, Ligtening, Wind_Speed, Wind_Direction, Humidity, Hour_fcst){
            const weather_embd = new EmbedBuilder()
            .setColor(0xffffff).setTitle(`${location} 날씨 정보`)
            .setDescription(`기온 : ${T1H}℃ (${Sky})\n${Rain}${Pty}, 낙뢰 : ${Ligtening}\n풍속 : ${Wind_Speed} | 풍향 : ${Wind_Direction}°\n습도 : ${Humidity}`)
            .setTimestamp()
            .setFooter({text: `예보시간 : ${Number(Hour_fcst)}:00 | Data : 공공데이터포털`})
            await message.reply({
                embeds: [weather_embd],
                allowedMentions: { repliedUser: false }
            });
            return;
        }
        weather_embed(location, T1H, Sky, Rain, Pty, Ligtening, Wind_Speed, Wind_Direction, Humidity, Hour_fcst);
    } catch(error) {
        message.reply({
            content: "알 수 없는 에러가 발생했어요.",
            allowedMentions: { repliedUser: false }
        });
        webhookclient_Error.send({
            content: '**Weather INFO ERROR**\n```'+error.stack+'```'
        });
        return;
    }
}

export { weather_ as default };