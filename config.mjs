// use require of cjs module
import { createRequire } from "module";
global.require = createRequire(import.meta.url);

// configuration
const privateKey = require('./data/security/private.json');
const config = require('./data/config/config.json');
global.privateKey = privateKey;
global.config = config;
global.pkg = require('./package.json');

// import module
global.axios = require('axios');
import fs from 'fs';
global.fs = fs;
global.ytdl = require("@distube/ytdl-core");
global.cron = require("cron");
global.cheerio = require("cheerio");
global.path = require("path");

import posTagger from 'wink-pos-tagger';
global.tagger = new posTagger();

// file path
import { fileURLToPath } from 'url';
import { dirname } from 'path';
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);

// Data - MongoDB, NodeCache
const { MongoClient } = require('mongodb');
const NodeCache = require('node-cache');
global.mclient = new MongoClient(`mongodb+srv://${privateKey.MongoDBID}:${privateKey.MongoDBKEY}@data.nfhlde4.mongodb.net/?retryWrites=true&w=majority&appName=data`);
global.BotCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
global.BotCache_info = new NodeCache({ stdTTL: 100, checkperiod: 120 });
global.BotCache_news = new NodeCache({ stdTTL: 100, checkperiod: 120 });

// Discord module
import {
    Client, GatewayIntentBits, ActivityType,
    SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, 
    TextInputBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, WebhookClient, MessageType
} from "discord.js";

// Discord Voice module
import {
    joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus
} from "@discordjs/voice";

global.Client = Client;
global.GatewayIntentBits = GatewayIntentBits;
global.ActivityType = ActivityType;

global.SlashCommandBuilder = SlashCommandBuilder;
global.EmbedBuilder = EmbedBuilder;
global.ActionRowBuilder = ActionRowBuilder;
global.ModalBuilder = ModalBuilder;
global.StringSelectMenuBuilder = StringSelectMenuBuilder;
global.StringSelectMenuOptionBuilder = StringSelectMenuOptionBuilder;

global.TextInputBuilder = TextInputBuilder;
global.TextInputStyle = TextInputStyle;
global.ButtonBuilder = ButtonBuilder;
global.ButtonStyle = ButtonStyle;
global.WebhookClient = WebhookClient; 
global.MessageType = MessageType;

global.joinVoiceChannel = joinVoiceChannel; 
global.createAudioPlayer = createAudioPlayer;
global.createAudioResource = createAudioResource;
global.AudioPlayerStatus = AudioPlayerStatus;

// GPT api
import OpenAI from "openai";
global.openai = new OpenAI({ apiKey: privateKey.openai });

// webhook
global.webhookclient_deploy = new WebhookClient({ url: privateKey.log_deploy });
global.webhookclient_Error = new WebhookClient({ url: privateKey.log_error });
global.webhookclient_gen0 = new WebhookClient({ url: privateKey.log_gen });
global.webhookclient_K1 = new WebhookClient({ url: privateKey.log_viewchannel_k1 });
global.webhookclient_K2 = new WebhookClient({ url: privateKey.log_viewchannel_k2 });
global.webhookclient_K3 = new WebhookClient({ url: privateKey.log_viewchannel_k3 });
global.webhookclient_voice_k = new WebhookClient({ url: privateKey.log_voicejoin_k });

// import File
import * as Function from './src/ExportFunction.mjs';
import * as SubFunction from './src/function.mjs';
import * as AI from './src/main_function/AI/aiExport.mjs';
import * as errorHandler from './src/sub_function/errorHandler.mjs';
import * as Location from './src/sub_function/location.mjs';
import scrap_info from './src/sub_function/info_scrapper.mjs';

global.Function = Function;
global.SubFunction = SubFunction;
global.AI = AI;
global.errorHandler = errorHandler;
global.Location = Location;
global.scrap_info = scrap_info;

// environment
import env from './data/config/conf.mjs';
global.env = env;

// variable
global.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Status_CONFIG = {
    main: {
        prefix: privateKey.prefix_main,
        deploy_log: privateKey.log_main_id,
        Version: pkg.version,
        Token: env.token1,
        prefix_rwy: '!rw',
        prefix_simbrief: '!fp'
    },
    test: {
        prefix: privateKey.prefix_test,
        deploy_log: privateKey.log_test_id,
        Version: pkg.version + ' (beta)',
        Token: env.token_test1,
        prefix_rwy: '!!rw',
        prefix_simbrief: '!!fp'
    },
    test2: {
        prefix: privateKey.prefix_test2,
        deploy_log: privateKey.log_test_id,
        Version: pkg.version + ' (alpha)',
        Token: env.token_test2,
        prefix_rwy: '!!!rw',
        prefix_simbrief: '!!!fp'
    }
}

const cStatus = config.status;
const SC = Status_CONFIG[cStatus];

global.prefix = SC.prefix;
global.deploy_log = SC.deploy_log;
global.Version = SC.Version;
global.Token = SC.Token;
global.prefix_rwy = SC.prefix_rwy;
global.prefix_simbrief = SC.prefix_simbrief;

global.prefix_lch = config.status == 'test' ? 'ㄱㅅㅌㅅㅌ' : 'ㄱㅅ';
global.prefix_lch2 = config.status == 'test' ? 'ㄳㅌㅅㅌ' : 'ㄳ';
global.prefix_lch3 = config.status == 'test' ? 'ㄴㅇ ㄱㅅㅌㅅㅌ' : 'ㄴㅇ ㄱㅅ';
global.prefix_lch4 = config.status == 'test' ? 'ㄴㅇ ㄳㅌㅅㅌ' : 'ㄴㅇ ㄳ';
global.prefix_lch5 = config.status == 'test' ? 'ㄴㅇㄱㅅㅌㅅㅌ' : 'ㄴㅇㄱㅅ';
global.prefix_lch6 = config.status == 'test' ? 'ㄴㅇㄳㅌㅅㅌ' : 'ㄴㅇㄳ';

// Music Panel Button Components - TESTING ON SERVER
const m_player = new ButtonBuilder()
    .setCustomId('m_player')
    .setLabel('🎧 재생')
    .setStyle(ButtonStyle.Success)
const m_pause = new ButtonBuilder()
    .setCustomId('m_pause')
    .setLabel('🎵 일시정지')
    .setStyle(ButtonStyle.Primary)
const m_stop = new ButtonBuilder()
    .setCustomId('m_stop')
    .setLabel('⛔ 정지')
    .setStyle(ButtonStyle.Danger)
const m_skip = new ButtonBuilder()
    .setCustomId('m_skip')
    .setLabel('🎶 스킵')
    .setStyle(ButtonStyle.Primary)
const m_search = new ButtonBuilder()
    .setCustomId('m_search')
    .setLabel('🔗 음악 검색')
    .setStyle(ButtonStyle.Secondary)
const m_queue = new ButtonBuilder()
    .setCustomId('m_queue')
    .setLabel('📑 대기열')
    .setStyle(ButtonStyle.Secondary)

let row1 = new ActionRowBuilder()
.addComponents(m_player, m_pause, m_skip, m_stop)

let row2 = new ActionRowBuilder()
.addComponents(m_queue, m_search)

global.MusicComponents_row1 = row1;
global.MusicComponents_row2 = row2;

const Music_embed_default = new EmbedBuilder()
.setTitle("뭉이 - 음악패널")
.setColor(0xffffff)
.setDescription(`현재 재생중인 음악이 없어요\n이 기능은 현재 베타기능이에요.`)
.setFooter({ text: '🎧 음악 기다리는중', iconURL: 'https://cdn.discordapp.com/avatars/896317141329006622/f640361a3b7722b9c4add0fa1888d26d.webp?size=80'})

global.Music_embed_default = Music_embed_default;