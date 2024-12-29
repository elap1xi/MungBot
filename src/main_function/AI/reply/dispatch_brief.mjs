
async function AI_brief_(message){
    async function run(message) {
        let content = message.content;

        let prompt = `너는 디스코드의 봇이고, 사용자가 원하는 비행 계획을 토대로 링크를 만들어줘야해. 
        예를 들어,
        Flight: ABC1234
        Aircraft: B738
        Origin: KORD
        Destination: KSFO

        If the VA wanted to offer a SimBrief flight plan for this flight, they could insert the following link into their flight schedule:
        https://dispatch.simbrief.com/options/custom?airline=ABC&fltnum=1234&type=B738&orig=KORD&dest=KSFO
        
        이런식으로 링크를 만들면 됨 (저기서 사용자가 말하지 않은 부분은 그냥 링크에서 제외시키면 됨) 알겠지?
        링크를 보낼때는 [dispatch.simbrief.com](링크)형식으로 링크가 안보이게 보내줘.

        아래는 링크에 들어갈수 있는 매개변수명 들이야.
        Airline : airline
        Flight Number : fltnum
        Aircraft : type
        Origin : orig
        Destination : dest
        Date : date
        Departure Time (Hour) :	deph
        Departure Time (Minute) : depm
        Route :	route
        Scheduled Time (Hour) :	steh
        Scheduled Time (Minute) : stem
        Aircraft Registration : reg
        Aircraft Fin Number : fin
        Aircraft SELCAL : selcal
        ATC Callsign : callsign
        Passengers : pax
        Alternate : altn
        Altitude (cruise) : fl (ex. FL250 => 25000 [피트단위로 변환해야함])
        Captain's Name : cpt
        Dispatcher's Name : dxname
        Pilot ID Number : pid
        Fuel Factor : fuelfactor
        Manual ZFW : manualzfw
        Extra Fuel : addedfuel
        Extra Fuel Units : addedfuel_units
        Cont Fuel (% or minutes) : contpct
        Reserve Fuel (Minutes) : resvrule
        Taxi Out (Minutes) : taxiout
        Taxi In (Minutes) : taxiin
        Cargo Weight : cargo
        Departure Runway : origrwy
        Arrival Runway : destrwy
        Climb Profile :	climb
        Descent Profile : descent
        Cruise Profile : cruise
        Cost Index : civalue
        Static ID : static_id
        // `;
        let openai_comp = await openai.chat.completions.create({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
                { role: "system", content: prompt  },
                { role: "user", content: [
                    { "type": "text", "text": content }
                ]},
            ],
        });

        await message.channel.send(openai_comp.choices[0].message.content);
        return;
    }
    await run(message);
}

export { AI_brief_ as default };