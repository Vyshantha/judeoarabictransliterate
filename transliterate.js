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
  */
  
  /* TODO : shadda & others - diacritics Judeo-Arabic text : https://en.wikipedia.org/wiki/Hebrew_diacritics
    TODO : Include (diacritics & big letters) : https://en.wikipedia.org/wiki/Unicode_and_HTML_for_the_Hebrew_alphabet
    TODO : Determine if Unicode fixed : https://unicode.org/L2/L2003/03299-hebrew-issues.pdf
    TODO : In manchen Fällen werden auch emphatische Konsonanten nicht emphatisch geschrieben, oder nicht emphatische Konsonanten emphatisch z.B. ונס für ونص "und halb", dies ist jedoch eher eine seltene Ausnahme die mir bisher nur in marokkanischen Texten begegnet ist.
    TODO : Gimel - Jim & Ghayin (as suggestions)
    TODO : H with 2-dot above ? - https://forum.glyphsapp.com/t/decompose-hebrew-accents/4293/5
  */

  /* SAMPLE 
    בשם י֞י אל עולם 
    כ֜נת 
    איّהא    
    אלתלמיד̇ 
    אלעזיז   ר֜  
    יוסף ש֞צ ב֞ר 
    יהודה 
    נ֞ע
    ﭏבלאד ללקראהֵ
  */

  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "judeo2arabic") {
    const judeoToArabic = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
    ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","א":"ا","ב":"ب","ג":"ج","גׄ":"غ","עׄ":"غ","רׄ":"غ","ג̇":"غ","ע̇":"غ","ר̇":"غ","דׄ":"ذ","ד̇":"ذ","ד":"د","ה":"ه","ו":"و","וו":"و","ז":"ز","ח":"ح","זׄ":"ظ","טׄ":"ظ","ז̇":"ظ","ט̇":"ظ","ט":"ط","י":"ي","יי":"ي","חׄ":"خ","כׄ":"خ","ךׄ":"خ","ח̇":"خ","כ̇":"خ","ך̇":"خ","כ":"ك","ך":"ك","ל":"ل","מ":"م","ם":"م","נ":"ن","ן":"ن","ס":"س","ע":"ع","פ":"ف","ף":"ف","פׄ":"ف","ףׄ":"ف","צׄ":"ض","ץׄ":"ض","פ̇":"ف","ף̇":"ف","צ̇":"ض","ץ̇":"ض","צ":"ص","ץ":"ص","ק":"ق","ר":"ر","ש":"س","ש֒":"ش","תׄ":"ث","ת̇":"ث","ת֒":"ث","ת":"ت","ﭏ":"ال","₪":"﷼","שׂ":"","שׁ":"","קִ":"","":"كׄ", "ّ":"ّ"} ; 

    const consonantsWithDotAbove = ['ג','ד','ע','ר','ז','ט','ח','כ','ך','פ','ף','צ']
    
    const niqqud = {" ְ  ": "", "  ְ ": "e", " ְ  ": "'", "  ֱ ": "e", " ֲ  ": "a", " ֳ  ": "o", " ִ  ": "i", " ֵ  ": "e", " ֵ  ": "ei", " ֶ  ": "e", " ֶ  ": "ei+yod", " ַ  ": "a", " ָ  ": "a", " ָ  ": "o", " ֹ  ": "o", "וֹ": "o", " ּ  ": "", "וּ": "u", " ֻ  ": "u", "ײַ": "", "  ֞ ": "", "  ֜ ": "", "׳": "", "  ֿ ": "", " ّ":""};
    /* Shadda with Hebrew letters
      U+05D0 U+0651 אّ HEBREW LETTER ALEF + ARABIC SHADDA
      U+05D1 U+0651 בّ HEBREW LETTER BET + ARABIC SHADDA
      U+05D2 U+0651 גّ HEBREW LETTER GIMEL + ARABIC SHADDA
    */

    const typesOfWordDemarkers = [' ', '\n', ':', '؞', ';', '؛', ',', '٫' , '۔' , '.' , '٬', '؟', '!', '"', '\'', '(', ')', '[', ']', '{', '}', '/', '\\', undefined];

    const nonjoining = ["ء","ا","آ","د","ذ","ر","ز","و"];

    let resultAr = "";
    let textJud = document.getElementById("textarea1").value.toLowerCase();
    for (let u = 0; u < textJud.length; u++) {
      if (textJud[u].indexOf("\n") > -1) { // New Lines
        resultAr = resultAr + "\n";
      } else if (typesOfWordDemarkers.indexOf(textJud[u+4]) > -1 && textJud[u+3] == "ל" && textJud[u+2] == "ו" && textJud[u+1] == "ו" && textJud[u] == "א" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) { 
        console.log("nordafrikanischen - Texten אוול für أول")
        resultAr = (!judeoToArabic[textJud[u+5]] || (judeoToArabic[textJud[u+5]] && typesOfWordDemarkers.indexOf(judeoToArabic[textJud[u+5]]) == -1) || (judeoToArabic[textJud[u+5]] && nonjoining.indexOf(judeoToArabic[textJud[u+5]]) > -1)) ? resultAr + "أول" :  resultAr + "أولـ";
        u = u + 3;
      } else if (typesOfWordDemarkers.indexOf(textJud[u+3]) > -1 && textJud[u+2] == "ל" && textJud[u+1] == "ו" && textJud[u] == "א" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) {  // 
        console.log("nordafrikanischen - Texten für أول : vergleiche jedoch אול bei Saadiya Gaon")
        resultAr = (!judeoToArabic[textJud[u+3]] || (judeoToArabic[textJud[u+3]] && typesOfWordDemarkers.indexOf(judeoToArabic[textJud[u+3]]) == -1) || (judeoToArabic[textJud[u+3]] && nonjoining.indexOf(judeoToArabic[textJud[u+4]]) > -1)) ? resultAr + "أول" :  resultAr + "أولـ";
        u = u + 2;
      } else if (textJud[u+2] == " " && textJud[u+1] == "ל" && textJud[u] == "א" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) { // irakischen - der Artikel oft als אל als seperates Wort z.B. אל רחמאן anstelle von الرحمن hier schreibt das judäoarabische in רחמאן auch ein Alef, wo im Arabischen gar kein Alif ist. Teilweise erscheint אל auch als Ligatur ﭏ.
        console.log("irakischen - Texten der Artikel אל : seperates Wort")
        resultAr = (!judeoToArabic[textJud[u+2]] || (judeoToArabic[textJud[u+2]] && typesOfWordDemarkers.indexOf(judeoToArabic[textJud[u+2]]) == -1) || (judeoToArabic[textJud[u+2]] && nonjoining.indexOf(judeoToArabic[textJud[u+2]]) > -1)) ? resultAr + "ال" :  resultAr + "الـ";
        u = u + 2;
        // TODO ligature ?
      } else if (textJud[u] == "ל" && typesOfWordDemarkers.indexOf(textJud[u-1]) > -1) { // nordafrikanischen - den Artikel jedoch auch oft nur als ל gesehen z.B. ליהוד "die Juden" für اليهود in der nordafrikanischen Zeitung בית ישראל 
        console.log("nordafrikanischen - Texten der Artikel nur als ל geschrieben")
        resultAr = resultAr + "ال";
      } else if (textJud[u] && textJud[u+1] && judeoToArabic[textJud[u] + textJud[u+1]]) {
        console.log("Double letter consonant") // include joined Article ال (al / el / il)
        resultAr = resultAr + judeoToArabic[textJud[u] + textJud[u+1]];
        u = u + 1;
      } else if (typesOfWordDemarkers.indexOf(textJud[u+1]) > -1 && textJud[u] && textJud[u] == "ה" && judeoToArabic[textJud[u]]) {
        console.log("Single letter tāʾ marbūṭa or character")
        resultAr = (nonjoining.indexOf(judeoToArabic[textJud[u-1]]) > -1) ? resultAr + "ة " : resultAr + "ـة ";
        u = u + 1;
      } else if (textJud[u] && judeoToArabic[textJud[u]]) {
        console.log("Single letter consonant or character")
        resultAr = resultAr + judeoToArabic[textJud[u]];
      }
    }
    let unprocessed = (resultAr != "") ? resultAr.split(" ") : resultAr;
    let processed = "";
    for (let i = 0; i < unprocessed.length; i++) {
      if (unprocessed[i].indexOf("الا") > 0) {
        console.log("Multi-word suggestion when beginning with الا ");
        processed = processed + unprocessed[i] + ' ' + unprocessed[i].replace("الا","الأ") + ' ';
      } else if (unprocessed[i].startsWith("ا")) {
        console.log("Multi-word suggestion when beginning with ا ");
        processed = processed + unprocessed[i] + ' ' + unprocessed[i].replace("ا","أ") + ' ';
      } else if (unprocessed[i].endsWith("ي")) {
        console.log("Word end to be processed alef maksura")
        processed = processed + unprocessed[i].replace("ي","ى") + ' ';
      } else {
        console.log("Un processed word");
        processed = processed + unprocessed[i] + ' ';
      }
      resultAr = processed;
    }

    document.getElementById("textarea2").value = resultAr;
    document.getElementById("textarea2").innerHTML = resultAr;
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
