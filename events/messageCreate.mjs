const once = false;
const name = 'messageCreate';

async function execute(message) {
    const client = message.client;
    const content = message.content;
    const author = message.author.id;

    Function.logger(message);
    if (!config.allowReplyWithBot && message.author.bot) return;
    if (config.replyWithAdminOnly && author=='602721036852527104') return;

    var contentArr = content.split(" ");
    var leng = contentArr.length;
    var pre = contentArr[0];
    var command_1 = contentArr[1];
    var command_2 = contentArr[2];

    try {
        // Runway Info Handle
        if (content.startsWith(prefix_rwy)) {
            await message.channel.sendTyping();
            let icao = ((content.replace(prefix_rwy, "")).replace(/\s/g, "")).toUpperCase();
            await Function.rwy_info(message, icao, "Normal");
            return;
        }

        // Simbrief Info Handle
        if (content.startsWith(prefix_simbrief)) {
            await message.channel.sendTyping();
            let user = content.replace(prefix_simbrief, "");
            await Function.SimBrief(message, user);
            return;
        }

        // 메세지 처리
        async function reconstructChat(message, client) {
            let chatlog = [];
            let myTurn = true;
        
            const a = async (msg) => {
                const reply = await msg.fetchReference();
                const isBotMessage = reply.author.id === client.user.id;
                
                let repliedContent = reply.content;
                if(reply.embeds[0]!==undefined){
                    let embedContents = JSON.stringify(reply.embeds, null, 2);
                    repliedContent += `\n\n[Embed Data]\n${embedContents}`;
                }

                if (!myTurn && isBotMessage) throw new Error("Invalid user turn");
                if (myTurn && !isBotMessage) throw new Error("Invalid assistant turn");
        
                chatlog = [{ role: myTurn ? "assistant" : "user", content: repliedContent }, ...chatlog];
        
                myTurn = !myTurn;
                if (reply.type === MessageType.Reply) {
                    await a(reply);
                } else if (isBotMessage) {
                    throw new Error("Invalid end turn");
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

            let chatlog = [{ role: "user", content: content }];

            try {
                const previousChat = await reconstructChat(message, client);
                chatlog = [...previousChat, ...chatlog];

                await AI.AI_default(message, chatlog);
                return;

            } catch (err) {
                await message.reply({
                    content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                    allowedMentions: { repliedUser: false }
                });
            }

        }

        // prefix detect
        if (pre.startsWith(prefix)) {
            await message.channel.sendTyping();
            let RTN_value = await SubFunction.contentRequest(content);

            if (RTN_value == '1') {   // School Lunch Menu
                await Function.lunch(message, content, author);
                return;
            }

            else if (RTN_value == '2') {  // Current Version
                message.reply({
                    content: '현재 버전은 `' + Version + '`이에요!',
                    allowedMentions: { repliedUser: false }
                }); return;
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

            else if (RTN_value == '9') {    // plan simbrief - beta
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
                        // Music Controller - testing on server
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
                                }); return;
                            }

                            message.reply({
                                content: '채널이 생성되었어요 #🎧ㆍ뭉이음악채널',
                                allowedMentions: { repliedUser: false }
                            }); return;
                        }

                        // Ping
                        else if (command_1 == "핑") {
                            message.reply({
                                content: `ping : ${Date.now() - message.createdTimestamp}ms / API : ${Math.round(client.ws.ping)}`,
                                allowedMentions: { repliedUser: false }
                            }); return;
                        }

                        // else if (command_1 == "정리") {
                        //     let amount = command_2;
                        //     let messages = await message.channel.messages.fetch({ limit: Number(amount) + 1 });
                        //     await message.channel.bulkDelete(messages);
                        //     await message.reply({
                        //         content: `최근 ${amount}개의 메시지가 삭제되었습니다.`,
                        //         allowedMentions: { repliedUser: false }
                        //     }); return;
                        // }

                        // Choice
                        else if (command_1 == "골라") {
                            contentArr = content.split(" ");
                            if (SubFunction.check_command_lt(command_2)) {
                                var result_choice = (contentArr.slice(3, leng))[Math.floor((contentArr.slice(3, leng)).length * Math.random())];
                            } else {
                                result_choice = (contentArr.slice(2, leng))[Math.floor((contentArr.slice(2, leng)).length * Math.random())];
                            }
                            message.reply({
                                content: result_choice,
                                allowedMentions: { repliedUser: false }
                            }); return;
                        }

                        // Papago Translate
                        else if (command_1 == "번역" || contentArr[leng - 1] == "번역") {
                            var query;
                            if (command_1 == "번역") query = (contentArr.slice(2, leng)).join(" ");
                            else query = (contentArr.slice(1, leng - 1)).join(" ");

                            async function rep(text, origin, target) {
                                const papago_embed = new EmbedBuilder()
                                    .setColor(0x1eda69)
                                    .setTitle('Papago Translate ( ' + origin + ' -> ' + target + ' )')
                                    .addFields(
                                        { name: "번역할 내용", value: '``' + query + '``', inline: true },
                                        { name: "변역 결과", value: '``' + text + '``', inline: true }
                                    )
                                    .setFooter({ text: '번역 제공 및 언어감지 : 국내산 앵무새 | Papago ⓒ NAVER Corp ' });
                                message.reply({ 
                                    embeds: [papago_embed],
                                    allowedMentions: { repliedUser: false }
                                }); return;
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
                            }).catch(error => {
                                errorHandler.log_Error('**Papago Translate ERROR**\n```' + error.stack + '```');
                            });

                        }

                        // 도움말
                        else if (command_1 == "도움말") {
                            await Send_EMBD.help(message, 1);
                            return;
                        } 
                        
                        else {
                            try { // Ai Response
                                if(config.callBotwithMentionOnly) return;
                                let content = content.trim();
                                let msg_attachments = [];
                                if (message.attachments.size > 0) {
                                    message.attachments.forEach((attachment) => {
                                        if (attachment.contentType && attachment.contentType.startsWith("image/")) {
                                            msg_attachments.push({ type: "image_url", image_url: { url: attachment.url }, });
                                        }
                                    });
                                }

                                let chatlog = [
                                    { role: "user", content: [ { type: "text", text: content }, ...msg_attachments,]
                                        .filter((item) => item.text || item.image_url),
                                    },
                                ];

                                try {
                                    const previousChat = await reconstructChat(message, client);
                                    chatlog = [...previousChat, ...chatlog];
                        
                                    await AI.AI_default(message, chatlog);
                                    return;
                                } catch (err) {
                                    await message.reply({
                                        content: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                                        allowedMentions: { repliedUser: false }
                                    });
                                }
                            } catch (error) {
                                webhookclient_Error.send({
                                    content: '**AI Error**\n```' + error.stack + '```'
                                });
                                message.reply({
                                    content: SubFunction.random_NaN(1),
                                    allowedMentions: { repliedUser: false }
                                });
                            }
                        }

                    } else {
                        message.reply({
                            content: SubFunction.dictionary_default(command_2),
                            allowedMentions: { repliedUser: false }
                        });
                    }
                } else {
                    message.reply({
                        content: SubFunction.dictionary_default(command_1),
                        allowedMentions: { repliedUser: false }
                    });
                }
            }
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