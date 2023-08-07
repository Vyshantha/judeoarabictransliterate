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

  if (localStorage.getItem("direction") == null || localStorage.getItem("direction") == undefined || localStorage.getItem("direction") == "judeo2arabic") {
    let judeoToArabic = {"0":"٠","1":"١","2":"٢","3":"٣","4":"٤","5":"٥","6":"٦","7":"٧","8":"٨","9":"٩"
    ," ":" ",".":"٫",",":"٬",";":"؛","?":"؟","!":"!","\"":"\"","'":"'","(":"﴿",")":"﴾",":":"؞","+":"+","=":"=","/":"؍","-":"-","<":"<",">":">","*":"٭","|":"|","\\":"\\","€":"﷼","{":"{","}":"}","[":"[","]":"]","_":"_","%":"%","@":"@","ˆ":"ˆ","`":"`","´":"´","˜":"˜","·":"·","˙":"˙","¯":"¯","¨":"¨","˚":"˚","˝":"˝","ˇ":"ˇ","¸":"¸","˛":"˛","˘":"˘","’":"’","§":"؎","א":"ا","ב":"ب","ג":"ج","גׄ":"ج"," גׄ":"غ","עׄ":"غ","רׄ":"غ","דׄ":"ذ","ד":"د","ה":"ه","ו":"و","וו":"و","ז":"ز","ח":"ح","זׄ":"ظ","טׄ":"ظ","ט":"ط","י":"ي","יי":"ي","חׄ":"ك","כׄ":"ك","ךׄ":"ك","כ":"ك","ך":"ك","ל":"ل","מ":"م","ם":"م","נ":"ن","ן":"ن","ס":"س","ע":"ع","פ":"ف","ף":"ف","פׄ":"ف","ףׄ":"ف","צׄ":"ض","ץׄ":"ض","צ":"ص","ץ":"ص","ק":"ق","ר":"ر","ש":"ش","ש֒":"ش","תׄ":"ث","ת֒":"ث","ת":"ت","ﭏ":"ال"} ;
    /* TODO : كׄ , ïקִ  , shadda, waslah - diacritics Judeo-Arabic text  */
    /* ’ ײַ   ֿ  ׳  ֵ  וּ   ָ  „  וֹ  ₪  ּ  ֶ  ָ  ָ  ֻ  ִ  ֹ  ְ  ַ  ְ  ‘  —  “ ”  ֲ  ֳ  ֱ  ֵ  ַ  ָ  ֻ  ֶ  ְ  ֱ  ֳ  ֳ  …   ֞  ֜  */

    let resultAr = "";
    let textLa = document.getElementById("textarea1").value.toLowerCase();
    for (let u = 0; u < textLa.length; u++) {
      if (textLa[u].indexOf("\n") > -1) { // New Lines
        resultAr = resultAr + "\n";
      } else if (textLa[u-1] && textLa[u] && judeoToArabic[textLa[u-1] + textLa[u]]) {
        resultAr = resultAr.slice(0, -1) + judeoToArabic[textLa[u-1] + textLa[u]];
        u = u + 1;
      } else if (textLa[u] && judeoToArabic[textLa[u]]) {
        resultAr = resultAr + judeoToArabic[textLa[u]];
      }
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
