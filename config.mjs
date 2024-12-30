// use require of cjs module
import { createRequire } from "module";
global.require = createRequire(import.meta.url);

// configuration
global.config = require('./data/security/config.json');

// import module
global.axios = require('axios');
import fs from 'fs';
global.fs = fs;
global.ytdl = require("@distube/ytdl-core");
global.cron = require("cron");
global.cheerio = require("cheerio");

import posTagger from 'wink-pos-tagger';
global.tagger = new posTagger();

// Data - MongoDB, NodeCache
const { MongoClient } = require('mongodb');
const NodeCache = require('node-cache');
global.mclient = new MongoClient(`mongodb+srv://${config.MongoDBID}:${config.MongoDBKEY}@data.nfhlde4.mongodb.net/?retryWrites=true&w=majority&appName=data`);
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

global.TextInputBuilder = TextInputBuilder;
global.TextInputStyle = TextInputStyle;
global.EmbedBuilder = EmbedBuilder;
global.SlashCommandBuilder = SlashCommandBuilder;
global.ModalBuilder = ModalBuilder;
global.ButtonBuilder = ButtonBuilder;
global.ButtonStyle = ButtonStyle;
global.StringSelectMenuBuilder = StringSelectMenuBuilder;
global.StringSelectMenuOptionBuilder = StringSelectMenuOptionBuilder;
global.ActionRowBuilder = ActionRowBuilder;
global.MessageType = MessageType;

global.joinVoiceChannel = joinVoiceChannel; 
global.createAudioPlayer = createAudioPlayer;
global.createAudioResource = createAudioResource;
global.AudioPlayerStatus = AudioPlayerStatus;

// google gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");
global.genAI = new GoogleGenerativeAI(config.google_ai_key);
global.model = genAI.getGenerativeModel({ model: "gemini-1.0-pro"});

// GPT api
import OpenAI from "openai";
global.openai = new OpenAI({ apiKey: config.openai });

// webhook
global.webhookclient_Error = new WebhookClient({ url: config.log_error });
global.webhookclient_BakJae = new WebhookClient({ url: config.log_bakjae });
global.webhookclient_Nam = new WebhookClient({ url: 'https://discord.com/api/webhooks/1299748657700147270/sYcVx8hdUPpwT1LDBJxvF75o3dPcWbjLy7LzFverenc7IkZrNIJsfTEVUuJa4KMQhJEY' });

// import File
import * as Function from './src/ExportFunction.mjs';
import * as SubFunction from './src/function.mjs';
import * as AI from './src/main_function/AI/aiExport.mjs';
import * as Send_EMBD from './src/sub_function/send_embed.mjs';
import * as Location from './src/sub_function/location.mjs';
import scrap_info from './src/sub_function/info_scrapper.mjs';

global.Function = Function;
global.SubFunction = SubFunction;
global.AI = AI;
global.Send_EMBD = Send_EMBD;
global.Location = Location;
global.scrap_info = scrap_info;

// environment
import env from './data/config/conf.mjs';
global.env = env;

// variable
global.prefix = config.status == "online" ? config.prefix_main : config.prefix_test;
global.deploy_log = config.status == "online" ? config.log_main_id : config.log_test_id;
global.Version = config.status == "online" ? config.current_Version : config.current_Version + ' (beta)';
global.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// prefix
global.prefix_lch = config.status == 'test' ? 'ㄱㅅㅌㅅㅌ' : 'ㄱㅅ';
global.prefix_lch2 = config.status == 'test' ? 'ㄳㅌㅅㅌ' : 'ㄳ';
global.prefix_lch3 = config.status == 'test' ? 'ㄴㅇ ㄱㅅㅌㅅㅌ' : 'ㄴㅇ ㄱㅅ';
global.prefix_lch4 = config.status == 'test' ? 'ㄴㅇ ㄳㅌㅅㅌ' : 'ㄴㅇ ㄳ';
global.prefix_lch5 = config.status == 'test' ? 'ㄴㅇㄱㅅㅌㅅㅌ' : 'ㄴㅇㄱㅅ';
global.prefix_lch6 = config.status == 'test' ? 'ㄴㅇㄳㅌㅅㅌ' : 'ㄴㅇㄳ';

global.prefix_rwy = config.status == 'test' ? '!!rw' : '!rw';
global.prefix_simbrief = config.status == 'test' ? '!!fp' : '!fp';

// Music Panel Button Components - DEPRECATED ON SERVER
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