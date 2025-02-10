
async function AI_sort(message){
    async function sort(message) {
        let prompt = `
            1. 유저가 급식에 관해 질문한다면 "1"을 리턴 ("식단","급식"을 물어봄).
            2. 유저가 현재 이 봇의 버전에 관해 질문한다면 "2"를 리턴.
            3. 유저가 한강의 수온에 관해 질문한다면 "3"를 리턴.
            4. 유저가 날씨가 어떤지에 관해 질문한다면 "4"를 리턴.
            5. 유저가 뉴스기사를 궁금해하면 "7"을 리턴.
            6. 유저가 멜론차트(음원 차트 정보)와 관해 질문한다면 "8"을 리턴.
            7. 유저가 특정한 비행계획을 짜달라고 하면 "9"를 리턴.
            x. 위의 모든것을 만족하지 않는다면 0을 리턴.
            xx. 위의 것을 중복으로 질문한다면, 가장 먼저 나온것을 우선시함.
        `;
        
        let openai_comp = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: prompt  },
                { role: "user", content: [
                    { "type": "text", "text": message }
                ]},
            ],
        });

        return openai_comp.choices[0].message.content;
    }
    return await sort(message);
}

export { AI_sort as default };