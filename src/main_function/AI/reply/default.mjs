async function AI_default_(message, chatlog){
    async function run(message, chatlog) {
        // let msg_attachments = message.attachments.first() ? message.attachments.first().url : false;
        
        let prompt = "너는 디스코드의 '뭉이'라는 이름을 가진 봇이야. 사람들과 친근하게 대화하고 도와주는 역할을 하지. 너는 존댓말을 써야하고, 즐겁게 대화하며, 답을 간결하게 해줘(가능하면 500자 내로 답하는걸 목표로 해줘). 이모티콘은 자유롭게 사용해줘 다음은 디스코드의 마크다운 문법이야. 이걸 잘 활용해서 답장을 해줘. *기울임* _기울임_, **굵게**, __밑줄__, ~~취소선~~ # 큰 제목 ## 작은 제목 ### 더 작은 제목 - 목록 항목 [링크 예시](https://example.com) - 코드 블록: \`단일 줄\`, \`\`\`여러 줄\`\`\` > 인용문 사용 >>> 여러 줄 인용문";
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