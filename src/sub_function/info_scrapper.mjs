const melon_url = "https://smu.melon.com/chart/index.htm";

async function scrap_info(){
    await mclient.connect();
    const db = mclient.db('discord-bot_cache');
    const cacheCollection = db.collection('users');

    /**
     * @param {Number} gap 
     * @returns date of (current date + gap)
     */
    function dte(gap){
        let date = new Date();
        date.setDate(date.getDate()+gap);
        
        let m = String(date.getMonth()+1);
        let d = String(date.getDate());
    
        let Year = String(date.getFullYear());
        let Month = m.length==1 ? `0${m}` : m;
        let Day = d.length==1 ? `0${d}` : d;
        return `${Year}${Month}${Day}`;
    }

    // 환율 api
    async function get(date){
        let json = await axios.get(encodeURI(`https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=fvB2uusIc7kvwjbc4CtIoWAuex9ujTpd&searchdate=${date}&data=AP01`))
        .then(res => res.data);
        return json;
    }

    // Back up
    let userData_mlOLD = await cacheCollection.findOne({ ID: 'M' });
    // let userData_exOLD = await cacheCollection.findOne({ ID: 'E' });
    BotCache_info.set('MELONCHART_OLD', userData_mlOLD['value']);
    // BotCache_info.set('EXCHANGE_OLD', userData_exOLD['value']);

    BotCache_info.set('MELONCHART_NEW', '\n');
    // BotCache_info.set('EXCHANGE_NEW', '\n');

    await cacheCollection.deleteOne({ ID: 'M' });
    // await cacheCollection.deleteOne({ ID: 'E' });

    // 멜론 차트 정보
    async function melon_chart(){
        try{
            const res = await axios.get(melon_url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
                }
            });
            const $ = cheerio.load(res.data);
            $("tbody tr").each((i, e) => {
                let data = `${i+1}위 : ${$(e).find(".ellipsis.rank01").text().trim()} - ${$(e).find(".ellipsis.rank02 .checkEllipsis").text().trim()}`;
                BotCache_info.set('MELONCHART_NEW', `${BotCache_info.get('MELONCHART_NEW')}${data}\n`);
                // fs.appendFileSync('data/common/cache/melon_chart.txt', data+'\n', 'utf8');
            });
            let chart_check = BotCache_info.get('MELONCHART_NEW');
            if(chart_check=="\n" || chart_check==null){
                let melondata = {
                    ID: 'M',
                    value: BotCache_info.get('MELONCHART_OLD')
                };
                await cacheCollection.insertOne(melondata);
                // webhookclient_Error.send({
                //     content: '**Melon Chart - (Failed with Type A)**'
                // });
                return;
            } else {
                let melondata = {
                    ID: 'M',
                    value: BotCache_info.get('MELONCHART_NEW')
                };
                await cacheCollection.insertOne(melondata);
            }
        } catch(error) {
            let melondata = {
                ID: 'M',
                value: BotCache_info.get('MELONCHART_OLD')
            };
            await cacheCollection.insertOne(melondata);
            webhookclient_Error.send({
                content: '**Error (INFO_Scrapper) - Melon Chart**\n```'+error.stack+'```'
            });
            return;
        }
    }
    
    // 환율 정보
    async function exchange(){
        try{
            let json = await get(dte(0));
            if(json[0]==undefined){
                json = await get(dte(-1));
                if(json[0]==undefined){
                    json = await get(dte(-2));
                    if(json[0]==undefined) json = await get(dte(-3))
                }
            }
            
            for (let i of json){
                let value = Number(i['deal_bas_r'].replace(/,/gi,''));
                let data = `{'unit':${i['cur_unit']},'value':${i['cur_unit'] == 'JPY(100)' || i['cur_unit'] == 'IDR(100)' ? 1/value/100 : 1/value },'name':${i['cur_nm']}},`;
                BotCache_info.set('EXCHANGE_NEW', `"${BotCache_info.get('EXCHANGE_NEW')}${data}\n"`);
            }
            let exchange_check = BotCache_info.get('EXCHANGE_NEW');
            console.log(exchange_check);
            if(exchange_check=="\n"){
                let exchangedata = {
                    ID: 'E',
                    value: BotCache_info.get('EXCHANGE_OLD')
                };
                await cacheCollection.insertOne(exchangedata);
                webhookclient_Error.send({
                    content: '**Exchange Info - (Failed with Type A)**'
                });
            } else {
                let exchangedata = {
                    ID: 'E',
                    value: BotCache_info.get('EXCHANGE_NEW')
                };
                await cacheCollection.insertOne(exchangedata);
            }
        } catch(error) {
            let exchangedata = {
                ID: 'E',
                value: BotCache_info.get('EXCHANGE_OLD')
            };
            await cacheCollection.insertOne(exchangedata);
            webhookclient_Error.send({
                content: '**Error (INFO_Scrapper) - Exchange Info**\n```'+error.stack+'```'
            });
        }
    }
    await melon_chart();
    // await exchange();
}

export { scrap_info as default };