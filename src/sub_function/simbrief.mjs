import { Component } from "discord.js";

async function SimBrief_(message, user){
    try {
        let url = `https://www.simbrief.com/api/xml.fetcher.php?username=${user}&json=1`;
        let file_url = "https://www.simbrief.com/ofp/flightplans/";
        let img_url = "https://www.simbrief.com/ofp/uads/";
        let xml = await axios.get(url).then(res => res.data);

        let xml_fetch = xml['fetch'];
        let xml_params = xml['params'];
        let xml_general = xml['general'];
        let xml_origin = xml['origin'];
        let xml_destination = xml['destination'];
        let xml_alternate = xml['alternate'];
        let xml_file = xml['files'];
        let xml_img = xml['images'];
        let xml_fuel = xml['fuel'];
        let xml_weights = xml['weights'];;
        let xml_aircraft = xml['aircraft'];
        let xml_skyvector = xml['links']['skyvector'];
        let xml_vatsim = xml['prefile']['vatsim']['link'];
    // parse
        let pdf = file_url + xml_file['pdf']['link'];
        let img = img_url + xml_img['map'][0]['link'];
        let aircraft = xml_aircraft['name'];
        
        let icao_airline = xml_general["icao_airline"];
        let flight_number = xml_general["flight_number"];
        
        let route = xml_general['route'];
        
        let ori_icao = xml_origin['icao_code'];
        let ori_rwy = xml_origin['plan_rwy'];
        let ori_metar = xml_origin['metar'];
        
        let des_icao = xml_destination['icao_code'];
        let des_rwy = xml_destination['plan_rwy'];
        let des_metar = xml_destination['metar'];
        
        let alt_icao = xml_alternate['icao_code'];
        let alt_rwy = xml_alternate['plan_rwy'];
        let alt_metar = xml_alternate['metar'];
        
        let fuel_alt = xml_fuel['alternate_burn'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let fuel_res = xml_fuel['reserve'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let fuel_block = xml_fuel['plan_ramp'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        let costindex = xml_general['costindex'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let payload = xml_weights['payload'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        let airac = xml_params['airac'];
        let units = xml_params['units'];
        let response_time = xml_fetch['time'];
        
        
        route = ` ${route} `;
        xml_skyvector = (await SubFunction.bitly_url(xml_skyvector))['link'];
        xml_vatsim = (await SubFunction.bitly_url(xml_vatsim))['link'];

        // metar button
        const metar_o = new ButtonBuilder()
            .setCustomId(`mtr_:${ori_icao}`)
            .setLabel(`📑 Metar for ${ori_icao}`)
            .setStyle(ButtonStyle.Secondary)
        const metar_d = new ButtonBuilder()
            .setCustomId(`mtr_:${des_icao}`)
            .setLabel(`📑 Metar for ${des_icao}`)
            .setStyle(ButtonStyle.Secondary)
        let mrow1 = new ActionRowBuilder()
        .addComponents(metar_o, metar_d)

        const skyvector = new ButtonBuilder()
            .setLabel(`Skyvector`)
            .setURL("https://skyvector.com")
            .setStyle(ButtonStyle.Link)
            .setDisabled(true)
        const vatsim = new ButtonBuilder()
            .setLabel(`📡 File in Vatsim`)
            .setURL("https://vatsim.net")
            .setStyle(ButtonStyle.Link)
            .setDisabled(true)
        let mrow2 = new ActionRowBuilder()
        .addComponents(skyvector, vatsim)
        

        const embed = new EmbedBuilder()
        .setTitle("**Click to view full Plan (OFP)**")
        .setURL(pdf)
        .setDescription(`Airline : ${icao_airline} ${flight_number}\nAircraft : ${aircraft}`)
        .setColor('#2d9cf6')
        .addFields(
            { name: 'Origin', value: `${ori_icao}/${ori_rwy}`, inline: true },
            { name: 'Destination', value: `${des_icao}/${des_rwy}`, inline: true },
            { name: 'Alternate', value: `${alt_icao}/${alt_rwy}`, inline: true },
            { name: 'Route', value: `\`\`\`${route}\`\`\``, inline: false },
            { name: 'Block Fuel ', value:`${fuel_block}`, inline:true},
            { name: 'Payload', value:`${payload}`, inline:true},
            { name: 'Other Things', value:`FINRES Fuel : **${fuel_res}** | ALTN Fuel : **${fuel_alt}** | Cost Index : **${costindex}**`, inline:false }
        )
        .setImage(img)
        .setFooter({ text:`Airac ${airac} | ${user} | unit : ${units.toUpperCase()}`});

        await message.channel.send({ 
            embeds:[embed],
            components: [mrow1, mrow2]
        });
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
