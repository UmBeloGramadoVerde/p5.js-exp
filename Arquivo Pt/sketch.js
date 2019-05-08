var langs =['Português',['pt-BR', 'Brasil'],['pt-PT', 'Portugal']];


showInfo('info_start');


let final_transcript = '';
let interim_transcript = '';
let transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;
let menu="";
const input_timeout = 3;
let input_initial_word;
let query = '';
const TOTAL_TIME_FOR_SEARCH = 20;
let AMOUNT;
let paginas_atras = [];
let paginas_afrente = [];
let pages;

let listener = new EventTarget();


//checks if the browser supports the webkit Speech recognition
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {

  //speech sintesys setup
  var u = new SpeechSynthesisUtterance();
  u.lang = 'pt-BR';
  u.rate = 1;

  //speech recognition setup
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;


  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
  };
  recognition.onerror = function(event) {
    if (event.error == 'audio-capture') {
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };
  recognition.onend = function() {
    recognizing = false;
    recognition.start();
    if (ignore_onend) {
      return;
    }
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
  };
  recognition.onresult = function(event) {
    interim_transcript = '';
    transcript = '';
    let final_word = '';
    let donezo=false;
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
        final_word = event.results[i][0].transcript;
        donezo = true;
        document.getElementById("speech_text_div").style.display = "none";
      } else {
        interim_transcript += event.results[i][0].transcript;
        transcript = event.results[i][0].transcript;
      }
    }
    let params = {
      text: interim_transcript
    };
    var input_event = new CustomEvent('inputting', {detail: params});
    listener.dispatchEvent(input_event);
    searchOption(transcript);
    if (transcript!="") {document.getElementById("speech_text_div").style.display = "block";}
    interim_span.innerHTML = linebreak(interim_transcript);
    interim_span.style.visibility = "visible";
  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;

function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'pt-BR';
  recognition.start();
  ignore_onend = false;
  interim_span.innerHTML = '';
  showInfo('info_allow');
  start_timestamp = event.timeStamp;
}

//looks for the child of the info div that has the same id as the passed and turns it's visibility into inline instead of none
function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}

let last_word;

function searchOption(word){
  if ((menu == "") && (last_word != word)) {
    last_word = word;
    let formatted = word.toLowerCase().trim();

    if (["pesquisar"].indexOf(formatted)>=0){
      console.log("pesquisa");
      voiceSearch("Vamos fazer uma pesquisa");
    }

    if (["cancela", "cancelar"].indexOf(formatted)>=0){
      console.log("cancela");
      menu = "";
    }

    if (["baixo", "descer", "desce", "dc", "baixa", "beijo"].indexOf(formatted)>=0){
      //se ja faz 500 milis que fizeram isso
      menu = "baixo";
      console.log("baixo");
      window.scrollBy(0, AMOUNT);
      setTimeout(() => menu = "", 500);
    }

    if (["cima", "subir", "sim mano", "simão"].indexOf(formatted)>=0){
      menu = "cima";
      console.log("sobe");
      window.scrollBy(0, -AMOUNT);
      setTimeout(() => menu = "", 500);
    }

    if (["volta", "voltar"].indexOf(formatted)>=0){
      menu = "volta";
      console.log("volta");
      let anterior = paginas_atras[paginas_atras.length-1];
      document.getElementById("frame").src = anterior;
      paginas_afrente.push(anterior);
      paginas_atras.pop(anterior);
      setTimeout(() => menu = "", 500);
    }

    if (["avançar", "frente"].indexOf(formatted)>=0){
      menu = "avançar";
      console.log("avançar");
      let proxima = paginas_afrente[paginas_afrente.length-1];
      document.getElementById("frame").src = proxima;
      paginas_atras.push(proxima);
      paginas_afrente.pop(proxima);
      setTimeout(() => menu = "", 500);
    }

    if (["tens por busca", "por busca", "e tens por", "itens por busca"].indexOf(formatted)>=0){
      menu = "maxitens";
      console.log("maxitens");
      menu = "";
      //
    }

    if (["topo"].indexOf(formatted)>=0){
      menu = "topo";
      console.log("topo");
      window.scrollTo(0, 0);
      menu = "";
    }
    if (["ajuda", "ajudar", "help"].indexOf(formatted)>=0){
      menu = "ajuda";
      document.getElementById("speech_text_div").style.display = "none";
      showInfo('info_help');
      document.getElementById("help").style.display = "block";
      setTimeout(() => {
        document.getElementById("help").style.display = "none";
        showInfo('info_speak_now');
      }, 5000);
      console.log("ajuda");
      menu = "";
    }
  }
}

function say(message){
  speech = new SpeechSynthesisUtterance(message);
  speech.lang = "pt-BR";
  speechSynthesis.speak(speech);
}


function deleteBeforeWord(text, term){
  text = text.toLowerCase();
  let result = text;
  for (var i = 0; i <= text.length-term.length; i++) {
    if (text.substring(i, i+term.length) == term) {
      while((text[i] != " ") && (i < text.length)){
        i++;
      }
      result = text.substring(i+1);
    }
  }
  return result;
}

async function voiceSearch(message){
  query = '';
  window.scrollTo(0, 0);
  let did_user_started;
  let input_timeout_start_time = 0;
  let search_start_time = millis();
  let input_timeout_start_string= '';
  let search_in_progress = false;
  let is_listener_alive = true;


  say(message);

  listener.addEventListener("inputting", function handler(input) {

    if (input.detail.text != '') {
      query = deleteBeforeWord(input.detail.text, "pesqui");

      console.log("*************");
      console.log("input detail-> {"+input.detail.text+"}");
      console.log("query-> {"+query+"}");

      input_timeout_start_time = millis();
      input_timeout_start_string = query;

      function generatesPromises(start_time, start_string){

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            //checks if the string is not empty, if there is no search_in_progress and it was the last response detected
            if ((input_timeout_start_time == start_time) && (start_string != '') && !search_in_progress && is_listener_alive) {
              search_in_progress = true;
              resolve(start_string);
            }
            else{
              //verifica se a diferença de tempo já bateu o que foi determinado como timeout para input
              //o operador ternario retorna bool representando se houve timeout
              reject(((millis() - search_start_time) / 1000) > TOTAL_TIME_FOR_SEARCH ? true : false);
            }
          }, input_timeout*1000);
        });

      }

      did_user_started = generatesPromises(input_timeout_start_time, input_timeout_start_string);
      did_user_started
      .then((different_word) => {
        console.log("different_word-> {"+different_word+"}");
        listener.removeEventListener("inputting", handler);
        is_listener_alive = false;
        gotSearchPhrase(different_word);
      })
      .catch((timeout) => {
        //checa o bool retornado por cada reject das promessas gerados, a constante é
        //convenientemente nomeada timeout para facilicar a visualização do que seu valor implica
        if (timeout) {
          listener.removeEventListener("inputting", handler);
          is_listener_alive = false;
          console.log("Mais de 20 segundos");
          menu = "";
        }
        else {console.log("Input, mas ainda esta esperando");}
      });
    }
  });

}

let on_option_selection = false;

function removeLineBreaks(word){
  return word.replace(/(\r\n|\n|\r)/gm," ");
}

async function gotSearchPhrase(query){
  query = removeLineBreaks(query);
  query.trim();
  if (on_option_selection == false) {
    say("Entendido, pesquisando por: "+ query);
    query.toLowerCase();
    if (query[0] == ' ') {query = query.substr(1);;}
    let url = 'https://arquivo.pt/textsearch?q="'+query+'"&maxItems=20&prettyPrint=true';
    let result = await fetch(url);
    pages = await result.json();

    if (pages.response_items.length != 0) {
      document.getElementById("links").innerHTML = "";
      for (var i = 0; i < pages.response_items.length; i++) {
        var node = document.createElement("LI");
        var textnode = document.createTextNode(pages.response_items[i].title+" - "+(i+1));
        node.appendChild(textnode);
        document.getElementById("links").appendChild(node);
      }
      document.getElementById("links").style.display = "block";
      on_option_selection = true;
      voiceSearch("Escolha uma opção de 1 a "+pages.response_items.length);
    }
    else {say("Não encontrei nenhum resultado para: "+ query);}
  }
  else {
    on_option_selection = false;
    document.getElementById("links").style.display = "none";
    let option = parseInt(query, 10);
    if (option != NaN) {
      say("Entendido, acessando "+option);
      let chosen_address = pages.response_items[option].linkToNoFrame;
      paginas_atras.push(chosen_address);
      document.getElementById("frame").src = chosen_address;
    }
    else {say(query+" não é uma das opções enumeradas");}
  }
}

function setup() {

  AMOUNT = windowHeight;

}

window.onkeydown = function(e) { 
  if (e.keyCode == 32) {
    startButton(event);
  }
  return !(e.keyCode == 32);
};

function encodePixelString(value){
  return value+"px";
}

function decodePixelString(value){
  return parseInt(value.substring(0, value.length - 2));
}

function mostraElementoPorAlgunsSegundos(id){
  document.getElementById(id).style.zIndex = random(100, 200);
  setTimeout( () => document.getElementById(id).style.display = "none", 5000);
}
