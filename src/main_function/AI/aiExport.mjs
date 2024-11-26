import AI_sort_ from './sortai.mjs';
import AI_default_ from './reply/default.mjs';
import AI_melonchart_ from './reply/melonchart.mjs';
// import AI_exchange_ from './reply/exchange.mjs';

export async function AI_sort(content){
    return await AI_sort_(content);
}

export async function AI_default(message){
    await AI_default_(message);
}

export async function AI_melonchart(message){
    await AI_melonchart_(message); 
}

// export async function AI_exchange(message){
//     await AI_exchange_(message);
// }