import lunch_ from './main_function/lunch.mjs';
import rwy_info_ from './main_function/runway.mjs';
import han_gang_rvr_ from './main_function/hanriver.mjs';
import weather_ from './main_function/weather.mjs';
import SimBrief_ from './main_function/simbrief.mjs';
import News_ from './main_function/news.mjs';
import logger_ from './sub_function/logger.mjs';

export async function lunch(message,content,author){
    await lunch_(message, content, author);
}

export async function rwy_info(message, ICAO, type, debug){
    await rwy_info_(message, ICAO, type, debug);
}

export async function han_gang_rvr(message, debug){
    await han_gang_rvr_(message, debug);
}

export async function weather(message){
    await weather_(message);
}

export async function SimBrief(message, user){
    await SimBrief_(message, user);
}

export async function News(message){
    await News_(message);
}

// Logger
export async function logger(message){
    await logger_(message);
}

// Debugger
export async function module_debug(){
    const modules = [
        // () => lunch_(message, content, author),
        () => rwy_info_('', 'RKSI', 'Normal', true),
        () => han_gang_rvr_('', true),
        // () => weather_(''),
        // () => SimBrief_('',''),
        // () => News_('')
    ];

    for (const module of modules) {
        const result = await module();
        if (result !== 200) {
            await webhookclient_deploy.send({
                content: `Error code : ${result}`
            });
            throw new Error(`Error in module: ${result}`);
        }
    }

    console.log("Success: All modules returned 200");
    return "Success";

}