const once = false;
const name = 'messageCreate';

// const guildVoiceData = {};

var silencio = false;
var stupefy = false;
async function execute(message) {
    if (message.author.bot) return;

    const client = message.client;
    const content = (message.content);
    const author = message.author.id;
    var contentArr = content.split(" ");
    var leng = contentArr.length;
    var pre = contentArr[0];
    var command_1 = contentArr[1];
    var command_2 = contentArr[2];

    if (!pre.startsWith(prefix) && silencio) return;

    try {
        if (stupefy && author != '602721036852527104') return;

        // Lunch Handle
        async function lunch_reply(message, content, author) {
            try {
                await Function.lunch(message, content, author);
                return;
            } catch (error) {
                await Send_EMBD.error(message);
                webhookclient_Error.send({
                    content: '**Lunch ERROR**\n```' + error.stack + '```'
                });
                return;
            }
        }

        if (content == prefix_lch || content == prefix_lch2 || content == prefix_lch3 || content == prefix_lch4 || content == prefix_lch5 || content == prefix_lch6) {
            await message.channel.sendTyping();
            lunch_reply(message, content, author);
        }

        // Runway Info Handle
        if (content.startsWith(prefix_rwy)) {
            await message.channel.sendTyping();
            const icao = ((content.replace(prefix_rwy, "")).replace(/\s/g, "")).toUpperCase();
            try {
                let Result = await Function.rwy_info(icao, config.AVWX_key, config.AirportDB_Key, "Normal");
                let result_txt = String(Result.join('\n'));
                const rwy_embds = new EmbedBuilder()
                    .setColor(0xffffff).setTitle(`${icao} Runway Info`)
                    .setDescription(result_txt)
                    .setTimestamp()
                    .setFooter({ text: `Source : AVWX, AirporstDB` })
                await message.channel.send({ embeds: [rwy_embds] });
                return;
            } catch (error) {
                await Send_EMBD.error(message);
                webhookclient_Error.send({
                    content: '**Runway INFO ERROR**\n```' + error.stack + '```'
                });
                return;
            }
        }

        // Simbrief Info Handle
        if (content.startsWith(prefix_simbrief)) {
            await message.channel.sendTyping();
            let user = content.replace(prefix_simbrief, "");
            await Function.SimBrief(message, user);
            return;
        }

        if (message.channelId == "1313522205614805033" && config.status == "online") {
            const clearCacheFolder = () => {
                const folderPath = 'cache/attachment/';
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                } else {
                    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
                        if (err) {
                            console.error('Error clearing folder:', err);
                        }
                        fs.mkdirSync(folderPath, { recursive: true });
                    });
                }
            
            };

            const download_image = async (url, name) => {
                const response = await axios({
                    url,
                    responseType: 'stream',
                });
                return new Promise((resolve, reject) => {
                    response.data
                        .pipe(fs.createWriteStream(name))
                        .on('finish', resolve)
                        .on('error', reject);
                });
            };
        
            const sendLogToWebhook = async (content, files) => {
                const fileAttachments = files.map(file => ({ attachment: file }));
                await webhookclient_K1.send({
                    username: message.author.globalName == null ? message.author.username : message.author.globalName,
                    avatarURL: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=80`,
                    content,
                    files: fileAttachments,
                });
            };
        
            if (message.attachments.size > 0 || message.content.trim()) {
                try{
                    clearCacheFolder();
                    const attachments = message.attachments;
                    const downloadedFiles = [];
            
                    for (const attachment of attachments.values()) {
                        const filename = `cache/attachment/${message.channelId}${Date.now()}_image.png`;
                        await download_image(attachment.url, filename);
                        downloadedFiles.push(filename);
                    }
                    await sendLogToWebhook(message.content, downloadedFiles);
    
                    downloadedFiles.forEach(file => {
                        fs.unlink(file, (err) => {
                            if (err) console.error(`Failed to delete file: ${file}`, err);
                        });
                    });
                } catch (error) {
                    webhookclient_Error.send({
                        content: '**Viewer only Channel webhook ERROR**\n```' + error.stack + '```'
                    });
                }
            }
        }
        

        // 메세지 처리
        async function reconstructChat(message, client) {
            let chatlog = [];
            let myTurn = true;
        
            const a = async (msg) => {
                const reply = await msg.fetchReference();
                const isBotMessage = reply.author.id === client.user.id;
        
                if (!myTurn && isBotMessage) throw new Error("Invalid user turn: Bot's turn in user role.");
                if (myTurn && !isBotMessage) throw new Error("Invalid assistant turn: User's turn in bot role.");
        
                chatlog = [{ role: myTurn ? "assistant" : "user", content: reply.content }, ...chatlog];
        
                myTurn = !myTurn;
        
                if (reply.type === MessageType.Reply) {
                    await a(reply);
                } else if (isBotMessage) {
                    throw new Error("Invalid end turn: Bot message is the last.");
                }
            };
        
            if (message.type === MessageType.Reply) {
                try {
                    await a(message);
                } catch (err) {
                    console.error("Error reconstructing chat:", err);
                    throw new Error("Failed to reconstruct chat.");
                }
            }
        
            return chatlog;
        }
        
        if (message.mentions.users.has(client.user.id) && !message.author.bot){
            await message.channel.sendTyping();

            let chatlog = [{ role: "user", content: message.content }];

            try {
                const previousChat = await reconstructChat(message, client);
                chatlog = [...previousChat, ...chatlog];

                await AI.AI_default(message, chatlog);
                return;

            } catch (err) {
                console.error("Error handling AI response:", err);
                await message.reply({
                    content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                    allowedMentions: { repliedUser: false }
                });
            }

        }

        // prefix detect
        if (pre.startsWith(prefix)) {
            await message.channel.sendTyping();
            if (silencio && author != '602721036852527104') {
                return;
            }

            let RTN_value = await SubFunction.contentRequest(content);

            if (RTN_value == '1') {   // School Lunch Menu
                lunch_reply(message, content, author);
                return;
            }

            else if (RTN_value == '2') {  // Current Version
                message.channel.send('현재 버전은 `' + Version + '`이에요!');
                return;
            }

            else if (RTN_value == '3') {   // Rv.Han Temperature
                await Function.han_gang_rvr(message);
                return;
            }

            else if (RTN_value == '4') {   // Weather Info
                await Function.weather(message);
                return;
            }

            else if (RTN_value == '7') {   // News
                await Function.News(message);
                return;
            }

            else if (RTN_value == '8') {    // Melon Chart
                await AI.AI_melonchart(message);
                return;
            }

            else if (RTN_value == '9') {    // 
                await AI.AI_brief(message);
                return;
            }

            // Check message
            else if (command_1 === undefined) {
                message.channel.send(SubFunction.random_NaN(2));
                return;
            } else {
                if (SubFunction.dictionary_default(command_1) === undefined) {
                    if (SubFunction.dictionary_default(command_2) === undefined) {
                        // Music Controller - deprecated on server
                        if (command_1 == "셋업") {
                            const guild = message.guild;
                            const channelName = '🎧ㆍ뭉이음악채널';

                            let existingChannel = guild.channels.cache.find(ch => ch.name === channelName);
                            if (!existingChannel) {
                                existingChannel = await guild.channels.create({
                                    name: channelName,
                                    type: 0 // text channel
                                });

                                await existingChannel.send({
                                    embeds: [Music_embed_default], 
                                    components: [MusicComponents_row1, MusicComponents_row2],
                                });

                            } else {
                                message.reply({
                                    content: '#🎧ㆍ뭉이음악채널 이 이미 존재해요',
                                    allowedMentions: { repliedUser: false }
                                });
                                return;
                            }

                            message.reply({
                                content: '채널이 생성되었어요 #🎧ㆍ뭉이음악채널',
                                allowedMentions: { repliedUser: false }
                            });
                            return;
                        }

                        // Ping
                        if (command_1 == "핑") {
                            message.channel.send(`ping : ${Date.now() - message.createdTimestamp}ms / API : ${Math.round(client.ws.ping)}`)
                        }

                        else if (command_1 == "정리") {
                            let amount = command_2;
                            let messages = await message.channel.messages.fetch({ limit: Number(amount) + 1 });
                            await message.channel.bulkDelete(messages);
                            await message.channel.send(`최근 ${amount}개의 메시지가 삭제되었습니다.`);
                        }

                        // Choice
                        else if (command_1 == "골라") {
                            contentArr = content.split(" ");
                            if (SubFunction.check_command_lt(command_2)) {
                                var result_choice = (contentArr.slice(3, leng))[Math.floor((contentArr.slice(3, leng)).length * Math.random())];
                            } else {
                                result_choice = (contentArr.slice(2, leng))[Math.floor((contentArr.slice(2, leng)).length * Math.random())];
                            }
                            message.reply(result_choice);
                        } else if (command_1.startsWith("골라") && (command_1.split("")).length !== 2) {
                            result_choice = (contentArr.slice(3, leng))[Math.floor((contentArr.slice(3, leng)).length * Math.random())];
                            message.reply(result_choice);
                        }

                        // Papago Translate
                        else if (command_1 == "번역" || contentArr[leng - 1] == "번역") {
                            var query;
                            if (command_1 == "번역") {
                                query = (contentArr.slice(2, leng)).join(" ");
                            } else {
                                query = (contentArr.slice(1, leng - 1)).join(" ");
                            }

                            async function rep(text, origin, target) {
                                const papago_embed = new EmbedBuilder()
                                    .setColor(0x1eda69)
                                    .setTitle('Papago Translate ( ' + origin + ' -> ' + target + ' )')
                                    .addFields(
                                        { name: "번역할 내용", value: '``' + query + '``', inline: true },
                                        { name: "변역 결과", value: '``' + text + '``', inline: true }
                                    )
                                    .setFooter({ text: '번역 제공 및 언어감지 : 국내산 앵무새 | Papago ⓒ NAVER Corp ' });
                                message.channel.send({ embeds: [papago_embed] });
                            }

                            async function errc(error) {
                                await Send_EMBD.error(message);
                                webhookclient_Error.send({
                                    content: '**Papago Translate ERROR**\n```' + error.stack + '```'
                                });
                            }

                            axios.get("https://playentry.org/api/expansionBlock/papago/dect/langs?query=" + query)
                                .then(res => res.data)
                                .then(json => {
                                    let origin = json.langCode;
                                    let target = origin == "ko" ? "en" : "ko";
                                    var text;
                                    async function get() {
                                        if (json.langCode == "ko") {
                                            text = await SubFunction.PAPAGO_translate(query, "en");
                                            rep(text, origin, target);
                                        } else {
                                            text = await SubFunction.PAPAGO_translate(query, "ko");
                                            rep(text, origin, target);
                                        }
                                    }
                                    get();
                                })
                                .catch(error => errc(error));

                        }

                        // 도움말
                        else if (command_1 == "도움말") {
                            await Send_EMBD.help(message, 1);
                            return;
                        } 
                        
                        // Harry Potter Command 🪄
                        else if (command_1 == "실렌시오!") {
                            if(author=='602721036852527104'){
                                if(!silencio){ 
                                    silencio=true;
                                    message.channel.send("으읍!"); 
                                } else {
                                    //
                                }
                            } else {
                                message.channel.send("프로테고! 🪄");
                            }
                        } else if (command_1 == "피니테!") {
                            if(author=='602721036852527104'){
                                if(silencio){ 
                                    silencio = false;
                                    message.channel.send("휴우..");
                                } else {
                                    //
                                }
                            } else { return; }
                        } else if (command_1 == "스튜페파이!") {
                            if(author=='602721036852527104'){
                                if(!stupefy){ 
                                    stupefy=true;
                                    message.channel.send("..."); 
                                } else {
                                    //
                                }
                            } else {
                                message.channel.send("살비오 헥시아! 🪄");
                            }
                        } else if (command_1 == "피니테인칸타템!") {
                            if(author=='602721036852527104'){
                                if(stupefy){ 
                                    stupefy=false;
                                    message.channel.send("...으어..?"); 
                                } else {
                                    //
                                }
                            } else { return; }
                        }
                        
                        else {
                            try { // Ai Response
                                let chatlog = [{ role: "user", content: message.content }];
                                try {
                                    const previousChat = await reconstructChat(message, client);
                                    chatlog = [...previousChat, ...chatlog];
                        
                                    await AI.AI_default(message, chatlog);
                                    return;
                                } catch (err) {
                                    console.error("Error handling AI response:", err);
                                    await message.reply({
                                        content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                                        allowedMentions: { repliedUser: false }
                                    });
                                }
                            } catch (error) {
                                webhookclient_Error.send({
                                    content: '**AI ERROR**\n```' + error.stack + '```'
                                });
                                message.channel.send(SubFunction.random_NaN(1));
                            }
                        }

                    } else {
                        message.channel.send(SubFunction.dictionary_default(command_2));
                    }
                } else {
                    message.channel.send(SubFunction.dictionary_default(command_1));
                }
            }
        }

        if (pre.startsWith('뭉디야')) {
            await message.channel.sendTyping();
            message.channel.send("https://media.discordapp.net/attachments/757907911786627156/1119643411859910706/IMG_3685.jpg?width=1461&height=897");
            message.channel.send("이거 찾으시나요?\n이게 아니라면 제 이름은 뭉디 아니고 뭉이에요 뭉이!!");
        }

    } catch (error) {
        webhookclient_Error.send({
            content: '**Message Handler ERROR**\n```' + error.stack + '```'
        });
        await message.reply({ 
            content: '죄송해요, 메세지를 처리하는 도중 에러가 발생했어요! :(',
            allowedMentions: { repliedUser: false }
        });
    }
}

export { once, name, execute };