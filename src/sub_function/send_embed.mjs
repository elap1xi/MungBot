
export async function help(message){
    let embed = new EmbedBuilder()
    .setTitle("뭉이 도움말")
    .setDescription("> 1. 급식 질문\n```\"뭉이야 OO고 급식 알려줘\"```\n문장에 `학교이름`,`날짜`를 입력하고 급식을 물어보면\n해당 질문에 맞는 급식을 제공해 드릴게요.\n\n> 2. 날씨 질문\n```\"뭉이야 서울 날씨 알려줘\"```\n문장에 `지역명`을 입력하고 날씨를 물어보시면\n해당 지역의 날씨 예보를 알려드릴게요.\n특정 건물이나 도로명 등은 답변드릴수 없어요!\n\n> 3. 번역 질문\n```\"뭉이야 번역 <내용>\"```\n`<내용>`에다가 번역하실 내용을 쓰시면 말그래도 번역을 해드려요.\n영어는 한국어로, 한국어는 영어로 자동 번역 이에요\n\n> 4. 뉴스기사\n```\"뭉이야 뉴스\"```\n위의 질문들중에 포함되지 않는 질문을 하시면\n자동으로 GPT-4o Mini 인공지능이 답변을 해줄거에요!\n\n> 특수 질문\n`!rw <icao>` : 해당 공항의 활주로 바람 정보를 제공해드려요\n`!fp <Simbrief_id>` : 해당 id의 가장 최근의 비행 계획 정보를 알려드려요\n\n> **아래는 슬래시 명령어(/) 목록이에요!**")
    .addFields(
        {
            name: "/학교등록",
            value: "급식을 요청할 **학교를 미리 등록**해 놓을 수 있어요!\n학교 이름을 말하지 않고 \"뭉이야 급식\"만 말해도 제가 알아서 알려드릴게요!",
            inline: false
        },
        {
            name: "/급식",
            value: "말씀하신 학교의 현재 **급식**을 알려드려요",
            inline: false
        },
        {
            name: "/번역",
            value: "말씀하신 문장을 번역해 드려요!\n만약 **한글**을 치시면 **영어**로,\n**영어**로 치시면 **한글**로 번역해 드릴게요",
            inline: false
        },
        {
            name: "/쇼핑",
            value: "말씀하신 상품을 **네이버 쇼핑**에서 찾아 보여드려요!",
            inline: false
        },
        {
            name: "/qrcode",
            value: "링크를 보내주시면, 그 링크로 **QR코드**를 만들어서 보내드릴게요 :)",
            inline: false
        },
        {
            name: "/aircraftinfo",
            value: "**항공기 제원**을 알려드려요!\n참고로, 현재 제가 알고 있는 항공기는\nB737, B757, B767, B777 이에요",
            inline: false
        },
        {
            name: "/오류신고",
            value: "만약 계속해서 **오류**가 발생한다면 여기로 신고해 주세요!",
            inline: false
        },
    )
    .setColor("#dbdbdb")
    .setFooter({
        text: `뭉이 | v${Version}`,
    }).setTimestamp();
    await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    return;
}

/**
 * 에러
 */
export async function error(message){
    let embed = new EmbedBuilder()
    .setTitle("에러가 발생했어요 :(")
    .setColor('#ffcc80')
    .setTimestamp();
    await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
}