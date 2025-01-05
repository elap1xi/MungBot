async function AI_default_(message, chatlog){
    async function run(message, chatlog) {
        // let msg_attachments = message.attachments.first() ? message.attachments.first().url : false;
        
        let prompt = "디스코드의 '뭉이'라는 이름을 가진 친근하고, 재미있는 채팅봇. 마크다운을 적절히 사용하고 존댓말을 사용할것";
        chatlog = [{ role: "system", content: prompt }, ...chatlog];

        // todo : 대화 40개 제한
        let openai_comp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: chatlog
        });

        await message.reply({
            content: openai_comp.choices[0].message.content,
            allowedMentions: { repliedUser: false }
        });
        return;
    }
    await run(message, chatlog);
}

export { AI_default_ as default };