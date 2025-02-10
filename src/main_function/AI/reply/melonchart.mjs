
async function AI_Melonchart_(message){
    async function run(message) {
        let content = message.content;
        await mclient.connect();
        const db = mclient.db('discord-bot_cache');
        const cacheCollection = db.collection('users');
        let userData_mlOLD = await cacheCollection.findOne({ ID: 'M' });

        let prompt = `너는 디스코드의 '뭉이'라는 이름을 가진 봇이야. 사람들과 친근하게 대화하고 도와주는 역할을 하지. 너는 존댓말을 써야하고, 다음은 멜론차트의 순위 정보야. (순위 정보가 없으면 ERR_001을 리턴할것)\n ${userData_mlOLD['value']}`;
        let openai_comp = await openai.chat.completions.create({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
                { role: "system", content: prompt  },
                { role: "user", content: [
                    { "type": "text", "text": content }
                ]},
            ],
        });

        await message.reply({
            content: openai_comp.choices[0].message.content,
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    await run(message);
}

export { AI_Melonchart_ as default };