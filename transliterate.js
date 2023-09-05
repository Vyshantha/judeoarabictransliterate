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

  // Transliteration used - https://en.wikipedia.org/wiki/Judeo-Arabic_dialects
  /* TODO : shadda & others - diacritics Judeo-Arabic text : https://en.wikipedia.org/wiki/Hebrew_diacritics */

  /* SAMPLE -
    אול מא כ̇לק אללה אלסמאואת ואלארץ̇
    ואלארץ̇ כאנת גאמרה ומסתבחרה וט̇לאם עלי וג̇ה אלגמר וריח אללה תהב עלי ו
    אלמא
    ושא אללה אן יכון נור פכאן נור
    פלמא עלם אללה אן אלנור ג̇יד פצל אללה בין אלנור ובין אלט̇לאם
    וסמא אללה אוקאת אלנור נהארא ואוקאת אלט̇לאם סמאהא לילא ולמא מצ̇י מן אלליל ואלנהאר יום ואחד
  
    transcribiert -
    I. جامره ( גאמרה ) != غامرة
    II. الجمر ( אלגמר ) != الغمر
  */

  /* TODO / Fix
    1. Article ال (al / el / il) : das Wort als Präfix angehängt (bsp. الكتاب "das Buch"). Jedoch kann der Artikel im Judäoarabischen auf verschiedene Weise geschrieben werden. Teilweise wird der Artikel genauso wie im Arabischen behandelt, also אל geschrieben und präfigiert (z.B. in der judäo-arabischen Bibelübersetzung des Saadiya Gaon אלסמאואת "die Himmel" oder ואלארץ̇ "und die Erde".
    2. nordafrikanischen - den Artikel jedoch auch oft nur als ל gesehen z.B. ליהוד "die Juden" für اليهود in der nordafrikanischen Zeitung בית ישראל .
    3. nordafrikanischen - Texten ist mir ferner noch die Doppelte Schreibung von verdoppelten Konsonanten aufgefallen. Z.B. אוול für أول (vergleiche jedoch אול bei Saadiya Gaon).
    4. irakischen - der Artikel oft als אל als seperates Wort z.B. אל רחמאן anstelle von الرحمن hier schreibt das judäoarabische in רחמאן auch ein Alef, wo im Arabischen gar kein Alif ist. Teilweise erscheint אל auch als Ligatur ﭏ.
    5. In manchen Fällen werden auch emphatische Konsonanten nicht emphatisch geschrieben, oder nicht emphatische Konsonanten emphatisch z.B. ונס für ونص "und halb", dies ist jedoch eher eine seltene Ausnahme die mir bisher nur in marokkanischen Texten begegnet ist.
  */

  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "judeo2arabic") {
    const judeoToArabic = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
    ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","א":"ا","ב":"ب","ג":"ج","גׄ":"ج","גׄ":"غ","ג̇":"ج","ג̇":"غ","עׄ":"غ","רׄ":"غ","דׄ":"ذ","ע̇":"غ","ר̇":"غ","ד̇":"ذ","ד":"د","ה":"ه","ו":"و","וו":"و","ז":"ز","ח":"ح","זׄ":"ظ","טׄ":"ظ","ז̇":"ظ","ט̇":"ظ","ט":"ط","י":"ي","יי":"ي","חׄ":"خ","כׄ":"خ","ךׄ":"خ","ח̇":"خ","כ̇":"خ","ך̇":"خ","כ":"ك","ך":"ك","ל":"ل","מ":"م","ם":"م","נ":"ن","ן":"ن","ס":"س","ע":"ع","פ":"ف","ף":"ف","פׄ":"ف","ףׄ":"ف","צׄ":"ض","ץׄ":"ض","פ̇":"ف","ף̇":"ف","צ̇":"ض","ץ̇":"ض","צ":"ص","ץ":"ص","ק":"ق","ר":"ر","ש":"ش","ש֒":"ش","תׄ":"ث","ת̇":"ث","ת֒":"ث","ת":"ت","ﭏ":"ال","₪":"﷼","שׂ":"","שׁ":"","קִ":"","":"كׄ"} ;

    const consonantsWithDotAbove = ['ג','ד','ע','ר','ז','ט','ח','כ','ך','פ','ף','צ']
    
    const niqqud = {" ְ  ": "", "  ְ ": "e", " ְ  ": "'", "  ֱ ": "e", " ֲ  ": "a", " ֳ  ": "o", " ִ  ": "i", " ֵ  ": "e", " ֵ  ": "ei", " ֶ  ": "e", " ֶ  ": "ei+yod", " ַ  ": "a", " ָ  ": "a", " ָ  ": "o", "  ֹ ": "o", "וֹ": "o", " ּ  ": "", "וּ": "u", " ֻ  ": "u", "ײַ": "", "  ֞ ": "", "  ֜ ": "", "׳": "", "  ֿ ": "", " ّ":""};

    let resultAr = "";
    let textLa = document.getElementById("textarea1").value.toLowerCase();
    for (let u = 0; u < textLa.length; u++) {
      if (textLa[u].indexOf("\n") > -1) { // New Lines
        resultAr = resultAr + "\n";
      } else if (textLa[u] && textLa[u+1] && judeoToArabic[textLa[u] + textLa[u+1]]) {
        resultAr = resultAr + judeoToArabic[textLa[u] + textLa[u+1]];
        u = u + 1;
      } else if (textLa[u] && judeoToArabic[textLa[u]]) {
        resultAr = resultAr + judeoToArabic[textLa[u]];
      }
    }
    let unprocessed = (resultAr != "") ? resultAr.split(" ") : resultAr;
    //let unprocessed = resultAr.split("\\n");
    let processed = "";
    for (let i = 0; i < unprocessed.length; i++) {
      if (unprocessed[i].indexOf("الا") > 0) {
        console.log("Multi-word suggestion when beginning with الا ");
        processed = processed + unprocessed[i] + ' ' + unprocessed[i].replace("الا","الأ") + ' ';
      } else if (unprocessed[i].startsWith("ا")) {
        console.log("Multi-word suggestion when beginning with ا ");
        processed = processed + unprocessed[i] + ' ' + unprocessed[i].replace("ا","أ") + ' ';
      } else if (unprocessed[i].endsWith("ي")) {
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
