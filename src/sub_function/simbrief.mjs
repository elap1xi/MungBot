
async function SimBrief_(message, user){
    try {
        let url = `https://www.simbrief.com/api/xml.fetcher.php?username=${user}&json=1`;
        let file_url = "https://www.simbrief.com/ofp/flightplans/";
        let img_url = "https://www.simbrief.com/ofp/uads/";
        let xml = await axios.get(url).then(res => res.data);

        let xml_fetch = xml['fetch']
        let xml_params = xml['params']
        let xml_general = xml['general']
        let xml_origin = xml['origin']
        let xml_destination = xml['destination']
        let xml_alternate = xml['alternate']
        let xml_file = xml['files']
        let xml_img = xml['images']
        let xml_fuel = xml['fuel']
        let xml_weights = xml['weights']
        let xml_aircraft = xml['aircraft']
    // parse
        let pdf = file_url + xml_file['pdf']['link']
        let img = img_url + xml_img['map'][0]['link']
        let aircraft = xml_aircraft['name']
        
        let icao_airline = xml_general["icao_airline"]
        let flight_number = xml_general["flight_number"]
        
        let route = xml_general['route']
        
        let ori_icao = xml_origin['icao_code']
        let ori_rwy = xml_origin['plan_rwy']
        let ori_metar = xml_origin['metar']
        
        let des_icao = xml_destination['icao_code']
        let des_rwy = xml_destination['plan_rwy']
        let des_metar = xml_destination['metar']
        
        let alt_icao = xml_alternate['icao_code']
        let alt_rwy = xml_alternate['plan_rwy']
        let alt_metar = xml_alternate['metar'] 
        
        let fuel_alt = xml_fuel['alternate_burn']
        let fuel_res = xml_fuel['reserve']
        let fuel_block = xml_fuel['plan_ramp']
        
        let costindex = xml_general['costindex']
        let payload = xml_weights['payload']

        let airac = xml_params['airac']
        let units = xml_params['units']
        let response_time = xml_fetch['time']
        
        
        route = ` ${route} `;
        // var sv_rte = route.replace(/\s/gi, '%20');
        // let skyvector_ = `https://skyvector.com/?zoom=5&fpl=%20${ori_icao}%20KAMIT%20Y722%20OLMEN%20${des_icao}`;
        // console.log(skyvector_);
        
        const embed = new EmbedBuilder()
        .setTitle("**Click to view full Plan (OFP)**")
        .setURL(pdf)
        .setDescription(`User : \`${user}\`, Airac ver : \`${airac}\`, Unit : \`${units}\`
                        Aircraft : \`${aircraft}\`,  Airline : \`${icao_airline} ${flight_number})\``)
        .setColor('#2ec0ff')
        .addFields(
            { name: 'Origin', value: `\`${ori_icao}/${ori_rwy}\``, inline: true },
            { name: 'Destination', value: `\`${des_icao}/${des_rwy}\``, inline: true },
            { name: 'Alternate', value: `\`${alt_icao}/${alt_rwy}\``, inline: true },
            { name: 'Route', value: `\`${route}\``, inline: true },
            { name:'Metar for Origin', value:`${ori_metar}`, inline:false},
            { name:'Metar for Destination', value:`${des_metar}`, inline:false},
            { name:'Block fuel ', value:`${fuel_block}`, inline:true},
            { name:'Payload', value:`${payload}`, inline:true},
            { name:"Other Things", value:`FINRES fuel : ${fuel_res} / Alternate_burn fuel : ${fuel_alt} / Cost Index : ${costindex}`, inline:false }
        )
        .setImage(img)
        .setFooter({ text:`Source from : Simbrief | Response time ${response_time}s`});

        await message.channel.send({ embeds:[embed] });
        return;
    } catch(error) {
        message.channel.send("에러가 발생했어요");
        webhookclient_Error.send({
            content: '**Simbrief ERROR**\n```'+error.stack+'```'
        });
        return;
    }
}

export { SimBrief_ as default };
