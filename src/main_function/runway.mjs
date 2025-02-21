
async function rwy_info_(message, ICAO, type, debug){
    try{
        const URL_ADB = `https://airportdb.io/api/v1/airport/${ICAO}?apiToken=${privateKey.AirportDB_Key}`;
        const URL_AVWX = `https://avwx.rest/api/metar/${ICAO}`;
        var json_avwx = await axios.get(URL_AVWX, {
            headers:{
                'Authorization':privateKey.AVWX_key
            }
        })
        .then(res => res.data);

        var Wind_dir = json_avwx.wind_direction.value;
        var Wind_spd = json_avwx.wind_speed.value;
        
        var json_ADB = await axios.get(URL_ADB)
        .then(res => res.data)
        
        var RWY_num=[], RWY_dir=[]; 
        var RWY_le=[], RWY_he=[];
        var Runway_length = json_ADB.runways.length;
        for(let i=0; i<Runway_length; i++){
        // Runway Number
            let RWYNUM_le = json_ADB.runways[i].le_ident;
            let RWYNUM_he = json_ADB.runways[i].he_ident;
            RWY_num.push(RWYNUM_le);
            RWY_num.push(RWYNUM_he);
            RWY_le.push(RWYNUM_le);
            RWY_he.push(RWYNUM_he);
        // Runway Heading
            let RWYHDG_le = json_ADB.runways[i].le_heading_degT;
            var RWYHDG_he = json_ADB.runways[i].he_heading_degT;
            if(RWYHDG_le==''){
                RWYNUM_le = RWYNUM_le.replace(/[A-Za-z]/g, ''); // Remove Alphabet
                if (RWYNUM_le.startsWith('0')) {
                    RWYNUM_le = RWYNUM_le.substring(1) * 10;
                } else {
                    RWYNUM_le = RWYNUM_le * 10;
                }
                RWYHDG_le = RWYNUM_le;
            }
            if(RWYHDG_he==''){
                RWYNUM_he = RWYNUM_he.replace(/[A-Za-z]/g, '');
                if (RWYNUM_he.startsWith('0')) {
                    RWYNUM_he = RWYNUM_he.substring(1) * 10;
                } else {
                    RWYNUM_he = RWYNUM_he * 10;
                }
                RWYHDG_he = RWYNUM_he;
            }
            RWY_dir.push(RWYHDG_le);
            RWY_dir.push(RWYHDG_he);
            // End
        }
        
        var Result = [];
        var Result_simple = [];
        for(let l=0; l<RWY_num.length; l++){
            var Runway_direction = RWY_dir[l];
            var Cross_wind = (((Math.sin((Wind_dir - Runway_direction) * Math.PI / 180))*Wind_spd));
            var Head_wind = (((Math.cos((Wind_dir - Runway_direction) * Math.PI / 180))*Wind_spd));
        // Crosswind Calculate
            if(Cross_wind>0){ 
                var crs_dir = 'Right';
                Cross_wind = Math.round(Cross_wind); }
            else if(Cross_wind<0){ 
                var crs_dir = 'Left';
                Cross_wind = Math.round(Cross_wind); }
            else{ 
                var crs_dir = " ";
                Cross_wind = Math.round(Cross_wind); }
            
            if(Cross_wind>15){
                var crosswind_status = '(Caution)'
            } else {
                crosswind_status = '';
            }

        // Runway Group
            if((l+1)%2==0){
                var GR_rwy = RWY_le[((l+1)/2)-1];
            } else {
                var GR_rwy = RWY_he[((l+2)/2)-1]
            }

        // Head(Tail)wind Calculate
            if(Head_wind>0){
                if(crosswind_status=='(Caution)'){
                    var wnd_type = '🟡 Headwind';
                } else {
                    var wnd_type = '🟢 Headwind';
                }
                Head_wind = Math.round(Head_wind);  
                var Result_text = `**Runway** : ${RWY_num[l]} (${wnd_type}/${Math.abs(Head_wind)}kts)\n**Crosswind** : ${Math.abs(Cross_wind)}kts / from ${crs_dir} ${crosswind_status}\n**Inverted Mark** : ${GR_rwy} (Tail Wind)\n`;
                var Result_text_simple = `__${RWY_num[l]}__(${Math.abs(Head_wind)}kts)`;
                Result_simple.push(Result_text_simple);
                Result.push(Result_text);
            }
            else if(Head_wind<0){
                var wnd_type = '⚪ Tailwind'
                Head_wind =  Math.round(Head_wind);
                // NOT SHOW
            }
            else{
                if(crosswind_status=='(Caution)'){
                    var wnd_type = '🟡 Crosswind';
                } else {
                    var wnd_type = ' ';
                }
                Head_wind = Math.round(Head_wind);  
                var Result_text = `Runway : ${RWY_num[l]}(${wnd_type}/${Math.abs(Head_wind)}kts)\nCrosswind : ${Math.abs(Cross_wind)}kts / from ${crs_dir} ${crosswind_status}\nInverted Mark : ${GR_rwy}\n`;
                var Result_text_simple = `__${RWY_num[l]}__/(${Math.abs(Head_wind)}kts)`;
                Result_simple.push(Result_text_simple);
                Result.push(Result_text);
            }
        }
        var result_txt;
        if(type=="Normal") result_txt = String(Result.join('\n'));
        else if(type=="Simple") result_txt = String(Result_simple.join('\n'));
        else return "M2-NO_TYPE";

        const rwy_embds = new EmbedBuilder()
            .setColor(0xffffff).setTitle(`${ICAO} Runway Info`)
            .setDescription(result_txt)
            .setTimestamp()
            .setFooter({ text: `Source : AVWX, AirporstDB` })
        if(debug) return 200;
        await message.reply({
            embeds: [rwy_embds],
            allowedMentions: { repliedUser: false }
        });
        return 200;
    } catch {
        return 'M2';
    }
}

export { rwy_info_ as default };