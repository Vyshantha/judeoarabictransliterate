function hide() {
  document.getElementById("tooltip1").classList.remove("block");
  document.getElementById("tooltip2").classList.remove("block");
}
function show1() {
  document.getElementById("tooltip1").classList.add("block");
  var self = this;
  setTimeout(function () {
    self.hide();
  }, 3000);
}
function show2() {
  document.getElementById("tooltip2").classList.add("block");
  var self = this;
  setTimeout(function () {
    self.hide();
  }, 3000);
}

function swapTransliteration() {
  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "judeo2arabic") {
    localStorage.setItem("direction", "arabic2judeo");
    document.getElementById("textarea1").readOnly = true;
    document.getElementById('textarea2').removeAttribute('readonly');
    document.getElementById("textarea2").focus();
    document.getElementById("Arabic").classList.add("currentTab");
    document.getElementById("Judeo").classList.remove("currentTab");
  } else if (localStorage.getItem("direction") == "arabic2judeo") {
    localStorage.setItem("direction", "judeo2arabic");
    document.getElementById('textarea1').removeAttribute('readonly');
    document.getElementById("textarea2").readOnly = true;
    if (localStorage.getItem("encoding") == "Judeo")
      document.getElementById("textarea1").focus();
    document.getElementById("Arabic").classList.remove("currentTab");
    document.getElementById("Judeo").classList.add("currentTab");
  }
}

function clearFooter() {
  document.getElementsByClassName("footerOfPage")[0].style = "display:none";
}

function copyContent1() {
  navigator.clipboard.writeText(document.getElementById("textarea1").value);
}

function copyContent2() {
  navigator.clipboard.writeText(document.getElementById("textarea2").value);
}

var vocalisedText = "";

function transliterate() {
  if (document.getElementById("textarea1").value.indexOf("script>") > -1 || document.getElementById("textarea2").value.indexOf("script>") > -1) {
    document.getElementById("textarea1").value = "";
    document.getElementById("textarea2").value = "";
    document.getElementById("textarea1").innerHTML = "";
    document.getElementById("textarea2").innerHTML = "";
  }

  /* 
    Published Works - 
      Transliteration of Judeo-Arabic Texts into Arabic Script Using Recurrent Neural Networks : https://aclanthology.org/2020.wanlp-1.8.pdf
      Processing Judeo-Arabic Texts : https://www.cs.tau.ac.il/~wolf/papers/JudeoArabic.pdf 
    Transliteration used - https://en.wikipedia.org/wiki/Judeo-Arabic_dialects

    Processing Judeo-Arabic Texts : Bar et. al., this Judeo-Arabic App does BETTER  :
     It is clear that our system learned how to deal with most of the common ambiguities; however, it still confuses about whether to place hamza (the glottal stop) at the end of a word or not, and it still cannot properly predicts when to use the letter (ha) or (ta marbuta) at the end of a word. 

    Focus on Mediaeval Judeo-Arabic to be included into the App : für unser Projekt (und viele weitere Judäo-arabische Projekte an Universitäten) ist die wichtigste Variante des Judäo-Arabischen das mittelalterliche Judäo-arabisch. Somit wird das empfohlene Wörterbuch von Joshua Blau um so wichtiger.

    - NOT required Hebrew letter combination ( "־" , "׀" , "׃" , "׆" , "װ" , "ױ" , "״" , "׳" , "ﬞ" , "יִ" , "﬩" , "ײַ" , "ﬠ" , "שׁ" , "שׂ" , "שּׁ" , "שּׂ" , "אַ" , "אָ" , "אּ" , "בּ" , "גּ" , "דּ" , "הּ" , "וּ" , "זּ" , "טּ" , "יּ" , "ךּ" , "כּ" , "לּ" , "מּ" , "נּ" , "סּ" , "ףּ" , "פּ" , "צּ" , "קּ" , "רּ" , "שּ" , "תּ" , "וֹ" , "בֿ" , "כֿ" , "פֿ" ) : https://forum.glyphsapp.com/t/decompose-hebrew-accents/4293/5
      https://en.wikipedia.org/wiki/Unicode_and_HTML_for_the_Hebrew_alphabet
  */

  /* SAMPLE 
    בשם י״י אל עולם 
    כ׳נת 
    איّהא    
    אלתלמיד̇ 
    אלעזיז   ר׳  
    יוסף ש״צ ב״ר 
    יהודה 
    נ״ע
    ﭏבלאד ללקראה
  */
  
  /*  

  TODO CORRECTIONS : Shadda for double letters לל = لّ

  Problems with UNICODE > scope for improvement & new L2 for Unicode
    Arabic diakritics used in Hebrew - typing problem ta-marbuta, harakat, maddah, shadda-*

  "David sprach sich dafür aus die hebräische Komponente des Judäo-arabischen NICHT zu übersetzen, sondern einfach nur zu transliterieren und so stehen lassen.""
    a. Hebrew woerter > direkt transkibiert oder uebersetzen : أدوناي : adonay =  י״י / יהוה / ה / יי / ד
    b. Hebrew abkurzungen ? ר׳ = Rabbi ; ש״צ = https://www.halachipedia.com/index.php?title=Shaliach_Tzibur ב״ר = Ben Rabbi = Sohn von Rabbi ; נ״ע = נשמתו עדן   abkurzung
    c. BL in hebrew then should be translated or transliterated ?
    d. determine if anything needs to be fixed : https://unicode.org/L2/L2003/03299-hebrew-issues.pdf
  
  VALIDATION TEST ground truth await Arabic transliteration
    I Judeo-arabisch :
      https://www.sefaria.org/Tafsir_Rasag%2C_Genesis.1?lang=he
      https://www.biblejew.com/wp-content/uploads/2016/06/A-Sample-Chapter-Genesis.pdf 
   II Auto-correct for non-standard words in text > A Dictionary of Mediaeval Judaeo-Arabic Texts (no online only book)
  
  */

  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "judeo2arabic") {
    const judeoToArabic = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
    ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","א":"ا","ﬡ":"ا","ב":"ب","ג":"ج","גׄ":"غ","עׄ":"غ","רׄ":"غ","ג̇":"غ","ע̇":"غ","ר̇":"غ","דׄ":"ذ","ד̇":"ذ","ד":"د","ﬢ":"د","ה":"ه","ﬣ":"ه","ו":"و","וו":"و","ז":"ز","ח":"ح","זׄ":"ظ","טׄ":"ظ","ז̇":"ظ","ט̇":"ظ","ט":"ط","י":"ي","יי":"ي","חׄ":"خ","כׄ":"خ","ךׄ":"خ","ח̇":"خ","כ̇":"خ","ך̇":"خ","כ":"ك","ﬤ":"ك","ך":"ك","ל":"ل","ﬥ":"ل","מ":"م","ם":"م","ﬦ":"م","נ":"ن","ן":"ن","ס":"س","ע":"ع","ﬠ":"ع","פ":"ف","ף":"ف","פׄ":"ف","ףׄ":"ف","צׄ":"ض","ץׄ":"ض","פ̇":"ف","ף̇":"ف","צ̇":"ض","ץ̇":"ض","צ":"ص","ץ":"ص","ק":"ق","ר":"ر","ﬧ":"ر","ש":"س","ש֒":"ش","תׄ":"ث","ת̇":"ث","ת֒":"ث","ת":"ت","ﬨ":"ت","ﭏ":"ال ","₪":"﷼","שׂ":"","שׁ":"","קִ":"","":"كׄ", "ّ":"ّ"} ; 

    const consonantsWithDotAbove = ['ג','ד','ע','ר','ז','ט','ח','כ','ך','פ','ף','צ'];

    const numeralsIndo = {
        "א": "1",
        "ב": "2",
        "ג": "3",
        "ד": "4",
        "ה": "5",
        "ו": "6",
        "ז": "7",
        "ח": "8",
        "ט": "9",
        "י": "10"
      };

    const indoToArabicNumerals = {
      "0": "٠",
      "1": "١",
      "2": "٢",
      "3": "٣",
      "4": "٤",
      "5": "٥",
      "6": "٦",
      "7": "٧",
      "8": "٨",
      "9": "٩"
    }
    
    const niqqud = {" ְ  ": "", "  ְ ": "e", " ְ  ": "'", "  ֱ ": "e", " ֲ  ": "a", " ֳ  ": "o", " ִ  ": "i", " ֵ  ": "e", " ֵ  ": "ei", " ֶ  ": "e", " ֶ  ": "ei+yod", " ַ  ": "a", " ָ  ": "a", " ָ  ": "o", " ֹ  ": "o", "וֹ": "o", " ּ  ": "", "וּ": "u", 
    "  ֻ ": "u", "ײַ": "", "  ֞ ": "", "  ֜ ": "", "׳": "", "  ֿ ": "", " ّ":""};

    const typesOfWordDemarkers = [' ', '\n', ':', '؞', ';', '؛', ',', '٫' , '۔' , '.' , '٬', '؟', '!', '"', '\'', '(', ')', '[', ']', '{', '}', '/', '\\', undefined];

    const nonjoining = ["ء","ا","آ","د","ذ","ر","ز","و"];

    let resultAr = "";
    let textJud = document.getElementById("textarea1").value.toLowerCase();
    for (let u = 0; u < textJud.length; u++) {
      if (textJud[u].indexOf("\n") > -1) { // New Lines
        resultAr = resultAr + "\n";
      } else if (typesOfWordDemarkers.indexOf(textJud[u+4]) > -1 && textJud[u+3] == "ה" && textJud[u+2] == "ל" && textJud[u+1] == "ל" && textJud[u] == "א" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) {
        console.log("Texten אללה für اللّه")
        resultAr = resultAr + "اللَّه";
        u = u + 3;
      } else if (typesOfWordDemarkers.indexOf(textJud[u+4]) > -1 && textJud[u+3] == "ל" && textJud[u+2] == "ו" && textJud[u+1] == "ו" && textJud[u] == "א" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) { 
        console.log("nordafrikanischen - Texten אוול für أول")
        resultAr = (!judeoToArabic[textJud[u+5]] || (judeoToArabic[textJud[u+5]] && typesOfWordDemarkers.indexOf(judeoToArabic[textJud[u+5]]) == -1) || (judeoToArabic[textJud[u+5]] && nonjoining.indexOf(judeoToArabic[textJud[u+5]]) > -1)) ? resultAr + "أول" :  resultAr + "أولـ";
        u = u + 3;
      } else if (typesOfWordDemarkers.indexOf(textJud[u+3]) > -1 && textJud[u+2] == "ל" && textJud[u+1] == "ו" && textJud[u] == "א" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) { 
        console.log("nordafrikanischen - Texten für أول : vergleiche jedoch אול bei Saadiya Gaon")
        resultAr = resultAr + "أول"; 
        u = u + 2;
      } else if (textJud[u+2] == " " && textJud[u+1] == "ל" && textJud[u] == "א" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) { 
        console.log("irakischen - Texten der Artikel אל : seperates Wort")
        resultAr = (!judeoToArabic[textJud[u+2]] || (judeoToArabic[textJud[u+2]] && typesOfWordDemarkers.indexOf(judeoToArabic[textJud[u+2]]) == -1) || (judeoToArabic[textJud[u+2]] && nonjoining.indexOf(judeoToArabic[textJud[u+2]]) > -1)) ? resultAr + "ال" :  resultAr + "ال "; // irakischen - der Artikel oft als אל als seperates Wort z.B. אל רחמאן anstelle von الرحمن hier schreibt das judäoarabische in רחמאן auch ein Alef, wo im Arabischen gar kein Alif ist. Teilweise erscheint אל auch als Ligatur ﭏ.
        u = u + 2;
        // TODO ligature ?
      } else if (textJud[u] == "ל" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) { 
        console.log("nordafrikanischen - Texten der Artikel nur als ל geschrieben")
        resultAr = resultAr + "ال "; // nordafrikanischen - den Artikel jedoch auch oft nur als ל gesehen z.B. ליהוד "die Juden" für اليهود in der nordafrikanischen Zeitung בית ישראל 
      } else if (textJud[u] && textJud[u+1] && judeoToArabic[textJud[u] + textJud[u+1]]) {
        console.log("Double letter consonant") // include joined Article ال (al / el / il)
        resultAr = resultAr + judeoToArabic[textJud[u] + textJud[u+1]];
        u = u + 1;
      } else if (typesOfWordDemarkers.indexOf(textJud[u+1]) > -1 && textJud[u] && textJud[u] == "ה" && judeoToArabic[textJud[u]]) {
        console.log("Single letter tāʾ marbūṭa or character - ה case with suggestions")
        if (textJud[u-1] == "א") {
          resultAr = resultAr + "ءة ";
          u = u + 1;
        } else {
          resultAr = (nonjoining.indexOf(judeoToArabic[textJud[u-1]]) > -1) ? resultAr + "ة " : resultAr + "ـة ";
          u = u + 1;
        }
      } else if (typesOfWordDemarkers.indexOf(textJud[u+1]) > -1 && textJud[u] && textJud[u] == "ת") {
        console.log("Single letter tāʾ marbūṭa or character - ת case with suggestions")
        resultAr = (nonjoining.indexOf(judeoToArabic[textJud[u-1]]) > -1) ? resultAr + "ةוֹ " : resultAr + "ـةוֹ ";
      } else if (textJud[u] == "ّ" && textJud[u-1] == "י") {
        console.log("Yod followed by Shadda then alef to be included")
        resultAr = resultAr + "ّ" + "ا";
      } else if (textJud[u] == "י" && textJud[u-1] == "א") {
        console.log("alef followed by yod")
        resultAr = resultAr + "ئ";
      } else if (typesOfWordDemarkers.indexOf(textJud[u+3]) > -1 && textJud[u+2] != " " && numeralsIndo[textJud[u+2]] && textJud[u+1] != " " && numeralsIndo[textJud[u+1]] && textJud[u] && judeoToArabic[textJud[u]] && textJud[u-1] == " " && ((textJud[u-2] == "ק" && textJud[u-3] == "ר" && textJud[u-4] == "פ") || (textJud[u-2] == "ל" && textJud[u-3] == "צ" && textJud[u-4] == "פ"))) {
        let numeral = parseInt(numeralsIndo[textJud[u]])*100 + parseInt(numeralsIndo[textJud[u+1]])*10 + parseInt(numeralsIndo[textJud[u+2]]);
        console.log("3 digit number representation with letter consonant after capital or paragraph פרק or פצל ", numeral)
        resultAr = resultAr + indoToArabicNumerals[Math.floor(numeral / 100)] + indoToArabicNumerals[Math.floor(numeral % 100 / 10)] + indoToArabicNumerals[numeral % 10];
        u = u + 2;
      } else if (typesOfWordDemarkers.indexOf(textJud[u+2]) > -1 && textJud[u+1] != " " && numeralsIndo[textJud[u+1]] && textJud[u] && judeoToArabic[textJud[u]] && textJud[u-1] == " " && ((textJud[u-2] == "ק" && textJud[u-3] == "ר" && textJud[u-4] == "פ") || (textJud[u-2] == "ל" && textJud[u-3] == "צ" && textJud[u-4] == "פ"))) {
        let numeral = parseInt(numeralsIndo[textJud[u+1]]) + parseInt(numeralsIndo[textJud[u]]);
        console.log("2 digit number representation with  letter consonant after capital or paragraph פרק or פצל ", numeral )
        resultAr = resultAr + indoToArabicNumerals[Math.floor(numeral / 10)]  + indoToArabicNumerals[numeral % 10];
        u = u + 1;
      } else if (typesOfWordDemarkers.indexOf(textJud[u+1]) > -1 && textJud[u] && judeoToArabic[textJud[u]] && textJud[u-1] == " " && ((textJud[u-2] == "ק" && textJud[u-3] == "ר" && textJud[u-4] == "פ") || (textJud[u-2] == "ל" && textJud[u-3] == "צ" && textJud[u-4] == "פ"))) {
        console.log("1 digit number representation with  letter consonant after capital or paragraph פרק or פצל")
        resultAr = resultAr + indoToArabicNumerals[numeralsIndo[textJud[u]]];
      } else if (textJud[u] == "ס" && textJud[u-1] == "נ" && textJud[u-2] == "ו") {
        console.log("nicht emphatische Konsonanten und halb emphatisch selten Texte")
        resultAr = resultAr + "ص"; // in manchen Fällen werden auch emphatische Konsonanten nicht emphatisch geschrieben, oder nicht emphatische Konsonanten emphatisch z.B. ונס für ونص "und halb", dies ist jedoch eher eine seltene Ausnahme die mir bisher nur in marokkanischen Texten begegnet ist.
      } else if (textJud[u+1] == "א" && textJud[u] == "ש") {
        console.log("text having שא should be transliterated as شَاء")
        resultAr = resultAr + "شاء";
        u = u + 1;
      } else if (textJud[u] && judeoToArabic[textJud[u]]) {
        console.log("Single letter consonant or character")
        resultAr = resultAr + judeoToArabic[textJud[u]];
      }
    }
    let unprocessed = (resultAr != "") ? resultAr.split(" ") : resultAr;
    let processed = "";
    for (let i = 0; i < unprocessed.length; i++) {
      if (unprocessed[i].indexOf("غ") > -1) {
        console.log("Suggestions - גׄ case")
        processed = processed + unprocessed[i] + ' ' + unprocessed[i].replace("غ", "ج") + ' ';
      } 

      if (unprocessed[i].endsWith("וֹ")) {
        console.log("Suggestions tāʾ marbūṭa - ת cases")
        processed = processed + unprocessed[i].replace("ةוֹ", "ة").replace("ـةוֹ","ـة") + ' ' + unprocessed[i].replace("ةוֹ", "ت").replace("ـةוֹ","ـت") + ' ';
      } else if (unprocessed[i].endsWith("ة") || unprocessed[i].endsWith("ـة")) {
        console.log("Suggestions tāʾ marbūṭa - ה cases")
        processed = processed + unprocessed[i] + ' ' + unprocessed[i].replace("ة", "ه").replace("ـة","ـه") + ' ';
      } else {
        console.log("Un processed word");
        processed = processed + unprocessed[i] + ' ';
      }
      /* 
        multiple form 'alef' ending
        1. שא = شَاء : אלמא = الْمَاء
        2. וסמא = وَسَمَّى
        3. פלמא = فَلَمَّا  
        
        multiple form 'yod' ending
        1. מצ̇י = مَضَى
        2. עלי = عَلَى

        Other unusual patterns
         סמאהא ?

      */
      
      /* if (unprocessed[i].indexOf("لل") > -1) { // Shadda for -ll-
        processed = processed + unprocessed[i].replace("لل","لّ") + ' ';
      }  */
      /*
        וסמא אללה אוקאת אלנור נהארא ואוקאת אלט̇לאם סמאהא לילא ולמא מצ̇י מן אלליל ואלנהאר יום ואחד 
        وَسَمَّى اللَّه ُ أوْقَات النُّور نَهَارا وأوْقَات الظَّلام لَيْلاً وَلَمَّا مَضَى مِن اللَّيل والنَهَار يَوْم واحِد 
      */
      
    }
    // Clean-up extra 'kashida' / 'tatweel''
    processed = processed.replaceAll("\u0640","");
    resultAr = processed;

    document.getElementById("textarea2").value = resultAr;
    document.getElementById("textarea2").innerHTML = resultAr;
  }
}

function vocalised() {
  if (localStorage.getItem("vocalised") == 'NO' || localStorage.getItem("vocalised") == null || localStorage.getItem("vocalised") == undefined) {
    localStorage.setItem("vocalised","YES");
    document.getElementById("vocalised").classList.add('vocalised');
    document.getElementById("vocalised").classList.remove('nonvocalised');
    document.getElementById("vocalised").title = "Vocalised Text in Arabic";
    document.getElementById("textarea2").value = vocalisedText;
  } else if (localStorage.getItem("vocalised") == 'YES') {
    localStorage.setItem("vocalised","NO");
    document.getElementById("vocalised").classList.add('nonvocalised');
    document.getElementById("vocalised").classList.remove('vocalised');
    document.getElementById("vocalised").title = "Non-vocalised Text in Arabic";
    vocalisedText = document.getElementById("textarea2").value;
    document.getElementById("textarea2").value = document.getElementById("textarea2").value.replaceAll("\uFE70","").replaceAll("\uFE71","").replaceAll("\uFE72","").replaceAll("\uFE74","").replaceAll("\u08F0","").replaceAll("\u08F1","").replaceAll("\u08F2","").replaceAll("\u064C","").replaceAll("\u064D","").replaceAll("\u064B","").replaceAll("\u064E","").replaceAll("\u0618","").replaceAll("\uFE76","").replaceAll("\uFE77","").replaceAll("\u064F","").replaceAll("\u0619","").replaceAll("\uFE78","").replaceAll("\uFE79","").replaceAll("\u0650","").replaceAll("\uFE7A","").replaceAll("\uFE7B","").replaceAll("\u061A","").replaceAll("\uFE7E","").replaceAll("\u0652","").replaceAll("\uFC5E","").replaceAll("\uFC60","").replaceAll("\uFC61","").replaceAll("\uFC62","").replaceAll("\uFC63","").replaceAll("\uFCF2","").replaceAll("\uFCF3","").replaceAll("\uFCF4","").replaceAll("\uFC5F","").replaceAll("\u0651","").replaceAll("\uFE7D","").replaceAll("\uFE7C","").replaceAll("\u0670","");
  }
}

function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}

function openTab(evt, localeName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(localeName).style.display = "block";
  evt.currentTarget.className += " active";
  localStorage.setItem("encoding", localeName);
  transliterate();
}

function loadRashi() {
  document.getElementById("Judeo").classList.remove("textSerifHebrew");
  document.getElementById("Judeo").classList.add("textRashi");
  document.getElementById("textarea1").style.fontFamily = "Noto Rashi Hebrew";
}

function loadSerifHebrew() {
  document.getElementById("Judeo").classList.remove("textRashi");
  document.getElementById("Judeo").classList.add("textSerifHebrew");
  document.getElementById("textarea1").style.fontFamily = "Noto Serif Hebrew";
}

function loadNaskh() {
  document.getElementById("Arabic").classList.remove("textNastaliq");
  document.getElementById("Arabic").classList.remove("textKufi");
  document.getElementById("Arabic").classList.add("textNaskh");
  document.getElementById("textarea2").style.fontFamily = "Noto Naskh Arabic";
}

function loadKufi() {
  document.getElementById("Arabic").classList.remove("textNastaliq");
  document.getElementById("Arabic").classList.remove("textNaskh");
  document.getElementById("Arabic").classList.add("textKufi");
  document.getElementById("textarea2").style.fontFamily = "Noto Kufi Arabic";
}

function loadNastaliq() {
  document.getElementById("Arabic").classList.remove("textKufi");
  document.getElementById("Arabic").classList.remove("textNaskh");
  document.getElementById("Arabic").classList.add("textNastaliq");
  document.getElementById("textarea2").style.fontFamily = "Noto Nastaliq Urdu";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
document.getElementById("textarea1").focus();
if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "arabic2judeo") {
  localStorage.setItem("direction", "judeo2arabic");
  localStorage.setItem("encoding", "Judeo");
  localStorage.setItem("languageType","Arabic");
} else if (localStorage.getItem("direction") != "arabic2judeo" && localStorage.getItem("direction") != "judeo2arabic") {
  localStorage.clear();
}

if (screen.width >= 300 && screen.width <= 500) {
  document.getElementById("Arabic").classList.remove("arabicTabText");
  document.getElementById("Arabic").classList.add("arabicTabSmallScreen");
  document.getElementById("Judeo").classList.remove("tabcontent");
  document.getElementById("Judeo").classList.add("tabcontentSmallScreen");
}
