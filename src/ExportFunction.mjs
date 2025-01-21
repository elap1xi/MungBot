import han_gang_rvr_ from './main_function/hanriver.mjs';
import lunch_ from './main_function/lunch.mjs';
// import lunch_ from './main_function/lunch_new.mjs';
import rwy_info_ from './main_function/runway.mjs';
import weather_ from './main_function/weather.mjs';
import SimBrief_ from './sub_function/simbrief.mjs';
import News_ from './main_function/news.mjs';
import logger_ from './sub_function/logger.mjs';

export async function lunch(message,content,author){
    await lunch_(message, content, author);
}

export async function rwy_info(ICAO, AVWX_key, AirportDB_Key, type){
    return await rwy_info_(ICAO, AVWX_key, AirportDB_Key, type);
}

export async function han_gang_rvr(message){
    await han_gang_rvr_(message);
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

export async function logger(message){
    await logger_(message);
}