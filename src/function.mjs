
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const num = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15 };
const month_Num = { 'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12 };
  
export async function contentRequest(content) {
    return await AI.AI_sort(content);
}

/**
 * 문자열의 모든 영문표기 숫자를 아라비아숫자 표기로 변환
 * @param {string} text 
 */
export function convertToArabicNumber(text) {
  const words = text.split(' ');
  const convertedWords = words.map(word => {
    if (num[word]) {
      return num[word].toString();
    }
    return word;
  });
  return convertedWords.join(' ');
}

export function contentRequest_Regex(content) {
  let regexKey_convert = /How\smany\s/gm;
  if(content.match(regexKey_convert)){
    return 7;
  }
}

/**
 * @param {string} content 문장(영어) 
 * @param {string} content_kr 문장(한글)
 * @returns 문장 내의 날짜 관련 단어를 검사하여 현재로부터의 상대적인 일수 차를 반환
 */
export function Check_Date_gap(content, content_kr) {
  if (this.CheckIndex(content, "TOMORROW")) {
    if (this.CheckIndex(content, "THE DAY AFTER TOMORROW")) {
      return 2;
    } else {
      return 1;
    }
  } else if (this.CheckIndex(content, "YESTERDAY")) {
    if (this.CheckIndex(content, "THE DAY BEFORE YESTERDAY")) {
      return -2;
    } else {
      return -1;
    }
  } else if (this.CheckIndex(content, "NEXT WEEK")) {
    if (this.CheckIndex(content_kr, "다다음주")) {
      if (content_kr.indexOf('다다다음주') === -1) {
        return 14;
      } else {
        return 21;
      }
    } else {
      return 7;
    }
  } else if (this.CheckIndex(content, "IN A DAY")) {
    return 1;
  } else if (this.CheckIndex(content, "17")) {
    var dok = String(content.match(/in+\s+\w+\s+days/g));
    dok = dok.replace(/in /gi, '');
    dok = dok.replace(/ days/gi, '');
    dok = dok.replace(/\./gi, '');
    if (num[dok] === undefined) {
      return Number(dok);
    } else {
      return num[dok];
    }
  } else if (this.CheckIndex(content, "17")) {
    dok = String(content.match(/in+\s+\w+\s+days./g));
    dok = dok.replace(/in /gi, '');
    dok = dok.replace(/ days/gi, '');
    dok = dok.replace(/\./gi, '');
    if (num[dok] === undefined) {
      return Number(dok);
    } else {
      return num[dok];
    }
  } else if (this.CheckIndex(content, "DAYS AGO")) {
    dok = String(content.match(/\w+\s+days/g));
    dok = dok.replace(/ days/gi, '');
    dok = dok.replace(/\./gi, '');
    if (num[dok] === undefined) {
      return -Number(dok);
    } else {
      return -Number(num[dok]);
    }
  } else if (this.CheckIndex(content, "18")) {
    dok = String(content.match(/\w+\s+days/g));
    dok = dok.replace(/ days/gi, '');
    dok = dok.replace(/ later/gi, '');
    dok = dok.replace(/\./gi, '');
    if (num[dok] === undefined) {
      return Number(dok);
    } else {
      return num[dok];
    }
  } else if (this.CheckIndex(content, "LAST WEEK")) {
    return -7;
  }
  else {
    return 0;
  }
}

/**
 * @param {string} content 확인할 문장
 * @param {string} dex 존재 여부 판단할 문자 (예외는 숫자로 직접 표기)
 * @returns {boolean} 문장 내 단어 존재 여부 판단
 */
export function CheckIndex(content, dex) {
  if (dex == "10") {
    var pos = content.indexOf('급식');
    if (pos === -1) { return false; }
    else { return true; }
  } else if (dex == "17") {
    var pos = (content.toUpperCase()).indexOf("IN");
    if (pos === -1) { return false; }
    else {
      var ps = (content.toUpperCase()).indexOf("DAYS");
      if (ps === -1) { return false; }
      else { return true; }
    }
  } else if (dex == "18") {
    var pos = (content.toUpperCase()).indexOf("DAYS");
    if (pos === -1) { return false; }
    else {
      var ps = (content.toUpperCase()).indexOf("LATER");
      if (ps === -1) { return false; }
      else { return true; }
    }
  // @ts-ignore
  } else if (dex == 21) {
    var pos = (content.toUpperCase()).indexOf("/");
    if (pos === -1) { return false; }
    else { return true; }
  } else {
    var pos = (content.toUpperCase()).indexOf(dex);
    if (pos === -1) { return false; }
    else { return true; }
  }
}

/**
 * @param {string} sentence 문장
 * @param {boolean} isString 월이 문자의 형태로 존재하는지 확인, false일 경우 숫자 반환
 */
export function Check_Date_gap_month(sentence, isString) {
  var dok = 0;
  var Mo = 0;
  // @ts-ignore
  for (let i = 0; i < 12; i++) {
    // @ts-ignore
    if (sentence.indexOf(month[i]) !== -1) {
      dok = dok + 1;
      // @ts-ignore
      Mo = month[i];
    }
  }
  if (dok > 0) {
    if (isString) {
      return true;
    } else {
      return month_Num[Mo];
    }
  } else {
    return false;
  }
}

/**
 * @param {Number} gap 일수 차이
 * @returns 차이나는 일수 만큼 계산해서 요청한 날짜를 반환
 */
export function CalculateDate(gap) {  // GPT-4 리팩토링
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + gap);
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();

  var lastDayOfMonth;
  if (month == 2) {
    // 2월인 경우 윤년 여부 체크
    lastDayOfMonth = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    // 4, 6, 9, 11월인 경우 30일까지
    lastDayOfMonth = 30;
  } else {
    // 나머지 달은 31일까지
    lastDayOfMonth = 31;
  }

  // 날짜가 음수인 경우 이전 달로 이동
  while (day < 1) {
    month--;
    if (month < 1) {
      year--;
      month = 12;
    }
    lastDayOfMonth = (month == 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 : 28;
    day += lastDayOfMonth;
  }

  // 날짜가 마지막 날짜를 초과하는 경우 다음 달로 이동
  while (day > lastDayOfMonth) {
    day -= lastDayOfMonth;
    month++;
    if (month > 12) {
      year++;
      month = 1;
    }
    lastDayOfMonth = (month == 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) ? 29 : 28;
  }

  var result_date = `${year} ${month} ${day}`;
  return result_date;
}

// Lunch = get
export async function school_code(school_name, neis_key) {
  async function code(value, neis_key) {
    let code = axios.get(encodeURI(`https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&KEY=${neis_key}&pSize=100&SCHUL_NM=${value}`))
      .then(res => res.data)
      .catch(error => { console.log(error); });
    return code;
  }
  // console.log(`https://open.neis.go.kr/hub/schoolInfo?Type=json&pIndex=1&KEY=${neis_key}&pSize=100&SCHUL_NM=${school_name}`);
  var json = await code(school_name, neis_key);
  let sch_code = json.schoolInfo[1].row;
  return sch_code;
}

export async function school_menu(neis_key, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, MLSV_YMD) {
  async function menu(neis_key, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, MLSV_YMD) {
    let code = axios.get(encodeURI(`https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&KEY=${neis_key}&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${MLSV_YMD}`))
      .then(res => res.data)
      .catch(error => erq(error));
    return code;
  }
  // console.log(`https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&KEY=${neis_key}&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${SD_SCHUL_CODE}&MLSV_YMD=${MLSV_YMD}`);
  var json = await menu(neis_key, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, MLSV_YMD);
  try {
    let menu_row, menu_cal;
    if ((json.mealServiceDietInfo[1].row).length > 1) {
      for (let i = 0; i < (json.mealServiceDietInfo[1].row).length; i++) {
        if (json.mealServiceDietInfo[1].row[i].MMEAL_SC_NM == '중식') {
            menu_row = json.mealServiceDietInfo[1].row[i].DDISH_NM;
            menu_cal = json.mealServiceDietInfo[1].row[i].CAL_INFO;
        }
      }
    } else {
        menu_row = json.mealServiceDietInfo[1].row[0].DDISH_NM;
        menu_cal = json.mealServiceDietInfo[1].row[0].CAL_INFO;
    }

    menu_row = String(menu_row)
      .replace(/[<br/>]/g, '-')
      .replace(/-----/gi, '\n')
      .replace(/[(.*[0-9)]/gi, '')
      .replace(/자율/gi, ' (자율)');
    return `${menu_row}$$${menu_cal}`;

  } catch {
    return json.RESULT.CODE;
  }
}

// Weather
export async function weather(url){
    async function parse(url){
        let json = axios.get(url)
          .then(res => res.data)
          .catch(error => { console.log(error); })
        return json;
    }
    let json = await parse(url);
    var data;
    try{
        data = json.response.body.items.item;
    } catch {
        return "ERR";
    }
    return data;
}

// Hangang temp
export async function han_gang_temp() {
  async function ps() {
    let json = await axios.get(`https://api.hangang.msub.kr/`)
      .then(res => res.data)
    return json;
  }
  let json = await ps();
  return json;
}

/**
 * @param {string} value 번역할 내용
 * @param {string} target 번역할 (목적)언어
 * @returns 네이버 파파고 번역 결과
 */
export async function  PAPAGO_translate(value, target) {
  async function get(value, target) {
    let json = axios.get(encodeURI(`https://playentry.org/api/expansionBlock/papago/translate/n2mt?text=${value}&target=${target}`))
      .then(res => res.data)
    return json;
  }
  let json = await get(value, target);
  let TranslatedText = String(json.translatedText);
  if (TranslatedText === 'undefined') {
    return 10001;
  } else {
    return TranslatedText;
  }
}

/**
 * @param {string} value 언어 감지할 내용
 */
export async function  Detect_language(value) {
  async function get(value) {
    let json = axios.get("https://playentry.org/api/expansionBlock/papago/dect/langs?query=" + value)
    .then(res => res.data)
    return json;
  }
  let json = await get(value);
  let origin = json.langCode;
  return origin;
}

export async function  NAVER_shopping(value, target) {
    async function get(value, target) {
        let json = axios.get(encodeURI(`https://playentry.org/api/expansionBlock/papago/translate/n2mt?text=${value}&target=${target}`))
        .then(res => res.data)
        return json;
    }
    let json = await get(value, target);
    let TranslatedText = String(json.translatedText);
    if (TranslatedText === 'undefined') {
        return 10001;
    } else {
        return TranslatedText;
    }
}

// DB 관련 함수
// Lunch Function
export async function Lunch_input(id, school_name, index) {
    await mclient.connect();
    const db = mclient.db('discord-bot');
    const usersCollection = db.collection('users');

    if (String(school_name).endsWith("고")) {
        school_name = school_name.slice(0, -1) + "고등학교";
    }
    var Lch = {
        ID: id,
        School_name: school_name,
        index: index
    }

    await usersCollection.insertOne(Lch);
    mclient.close();
}

export async function Lunch_output(id) {
    await mclient.connect();
    const db = mclient.db('discord-bot');
    const usersCollection = db.collection('users');

    let Data = await usersCollection.findOne({ ID: id });
    if(Data==null) return undefined;
    let UserSchool = Data['School_name'];
    return UserSchool;
}

export async function Lunch_output_index(id) {
    await mclient.connect();
    const db = mclient.db('discord-bot');
    const usersCollection = db.collection('users');

    let Data = await usersCollection.findOne({ ID: id });
    if(Data==null) return undefined;
    let UserSchool_index = Data['index'];
    return UserSchool_index;
}

export async function Lunch_delete(id) {
    await mclient.connect();
    const db = mclient.db('discord-bot');
    const usersCollection = db.collection('users');

    await usersCollection.deleteOne({ ID: id });
}

export function dictionary_default(value) {
  var d = {}
  d['안녕'] = '안녕하세요!';
  d['안녕?'] = '안녕하세요!'
  d['잘자'] = '좋은꿈 꾸세요! 굿나잇';
  d['시발'] = '욕은 나쁜거에요!';
  d['어쩔티비'] = '저쩔티비';
  d['안물티비'] = '안궁티비';
  d['메롱'] = '🤪';
  d['뭐해'] = '**뒹굴뒹굴..**';
  d['뭐해?'] = '**뒹굴뒹굴..**';
  d['몇살'] = '뭉이는 이제... ``3살``!!이에요!';
  d['몇살?'] = '뭉이는 이제... ``3살``!!이에요!';
  d['몇살이야?'] = '뭉이는 이제... ``2살``!!이에요!';
  d['생일'] = '뭉이 생일은... 10월 9일이에요!'
  d['짖어'] = '**왈왈!!**';
  d['시리'] = '랩빼고 다 잘해요!';
  d['빅스비'] = '그친구 시리보다 잘하는게.. 음 **랩**만 잘하는거 같아요!';
  d['크시'] = '그 친구 이상한거 많이 배웠더라구요... 그래도 마냥보단 좋아요!';
  d['으잉?'] = '뭉이 따라하는 건가요?';
  d['잘 이해하지 못했어요!'] = '뭉이 따라하는 건가요?';
  d['으에?'] = '뭉이 따라하는 거죠!?';
  d['뭉이 따라하는 건가요?'] = '따라하지 마세요!';
  d['따라하지 마세요!'] = '....에잇..!';
  d['....에잇..!'] = '.....;';
  d['.....;'] = '이제 더 없으니 그만하세요!';
  d['이제 더 없으니 그만하세요!'] = '이제 진짜 없';
  d['이제 진짜 없'] = '으에???';
  d['B737'] = 'https://img1.yna.co.kr/etc/inner/KR/2018/01/20/AKR20180120030500003_01_i_P2.jpg';
  d['b737'] = 'https://img1.yna.co.kr/etc/inner/KR/2018/01/20/AKR20180120030500003_01_i_P2.jpg';
  d['B747'] = 'https://blog.kakaocdn.net/dn/bnyTp3/btrtB9gKj5r/6G4lHRYjrEr4haPcZfBw70/img.jpg';
  d['b747'] = 'https://blog.kakaocdn.net/dn/bnyTp3/btrtB9gKj5r/6G4lHRYjrEr4haPcZfBw70/img.jpg';
  d['조랭이'] = '제가 탄생할수 있게 도와주신 분이에요!';
  d['고마워'] = '별말씀을요!';
  d['땡큐'] = '별말씀을요!';
  return d[value];
}

// Error Fucntion
export async function err_input(report_content, id) {
    await mclient.connect();
    const db = mclient.db('discord-bot-report');
    const usersCollection = db.collection('users');

    var Fst = {
        ID: id,
        content: report_content
    }

    await usersCollection.insertOne(Fst);
    mclient.close();
}

// Nothing to response
export function check_command_lt(value) {
  var command_lt = ["줘", "줘라", "주세요", "줄래", "줄래?", "줄래??", "주겠니", "주겠니?", "주겠니??", "봐", "봐봐", "볼래?", "볼래??", "봐줄래", "봐줄래?", "봐줄래??", "보겠니", "보겠니?", "보겠니??", "보렴", "보렴?", "보렴!", "보렴!!", "보ㅓ", "보ㅓ봐"];             
  function check_it(value) {
    return command_lt.indexOf(value);
  }
  if (check_it(value) == -1) {
    return false;
  } else {
    return true;
  }
}
export function random_NaN(value) {
  var nan = ["으에?", "으잉?", "잘 이해하지 못했어요!"]; 
  var nan2 = ["네?", "저 부르셨나요?", "네!"];
  if (value == 1) {
    return nan[Math.floor(nan.length * Math.random())];
  } else {
    return nan2[Math.floor(nan2.length * Math.random())];
  }
}
