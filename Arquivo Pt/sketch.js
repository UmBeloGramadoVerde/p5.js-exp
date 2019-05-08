let reim;
let url;
let contador = 0;
let contador_global = 0;
let length = 0;
let w = 600;
let h = 600;
let list = [];
let i;
let size = 10;
let escala = 10;
let limite = 1000;
let soma = 0;


function setup() {
  document.getElementById("1").style.opacity = "1";
  url = 'https://jarbas.serenata.ai/api/chamber_of_deputies/reimbursement/';
  createCanvas(800, 1600);
  for (i = 0; i <= limite; i++) {
    list[i] = 0;
  }
  noLoop();
}

function gotData(data) {
  reim = data;
}

function draw() {

  translate(-offset, 0);
  background(255);
  loadJSON(url, gotData);
  if (reim) {
    url = reim.next;
    length = reim.results.length;
    while (contador < length - 1) {
      contador++;
      contador_global++;
      list[Math.trunc(reim.results[contador].total_net_value)]++;
    }
    contador = 0;
    for (i = 0; i <= limite; i++) {
      if (i % escala == 0) {
        fill(221 - i / 3, 110, 66);
        rect(i * size / escala, 0, size, soma);
        if (soma != 0) {
          fill(20);
          text(i, i * size / escala, soma + size);
        }
        soma = 0;
      }
      soma += list[i];
      fill(255);
    }
  }
}

// function doubleClicked() {
//   offset = 0;
//   document.getElementById("defaultCanvas0").style.display = "block";
//   loop();
// }

let clicks = 0;
let is_running = false;

function navigate(x) {
  let initial_value = clicks;
  if (x > windowWidth / 4) {
    clicks++;
  } else {
    if (clicks > 0) {
      clicks--;
    }
  }
  if (!is_running) {
    if (clicks >= document.getElementsByClassName("info").length) {
      is_running = true;
      offset = 0;
      document.getElementById("defaultCanvas0").style.display = "block";

      TweenMax.to(document.getElementsByClassName("info")[index_of_displayed], 0.2, {
        x: 50,
        scale: 1.02
      });
      TweenMax.to(document.getElementsByClassName("info")[index_of_displayed], 0.7, {
        x: -2000,
        opacity: 0,
        delay: 0.2
      });

      loop();
    } else {
      let delta = clicks - initial_value;
      if (delta > 0) {
        cicleBetweenInfo("up");
      }
      if (delta < 0) {
        cicleBetweenInfo("down");
      }
    }
  }
  // document.getElementById("temp").innerHTML = x;
}

let index_of_displayed = 0;

function cicleBetweenInfo(direction) {
  let diff = 0;
  var elements = document.getElementsByClassName("info");
  let DURATION = 1;
  switch (direction) {
    case "up":
      diff = 1;
      break;
    case "down":
      diff = -1;
      break;
  }


  if ((index_of_displayed > 0) && (index_of_displayed < elements.length - 1)) {
    TweenMax.to(elements[index_of_displayed], 0.2, {
      x: 50,
      scale: 1.02
    });
    TweenMax.to(elements[index_of_displayed], DURATION, {
      x: -2000,
      opacity: 0,
      delay: 0.2
    });
    TweenMax.to(elements[index_of_displayed + diff], DURATION, {
      x: 0,
      opacity: 1
    });
    index_of_displayed = index_of_displayed + diff;
  }

  if (index_of_displayed == 0) {
    if (diff == 1) {
      TweenMax.to(elements[index_of_displayed], 0.2, {
        x: 50,
        scale: 1.02
      });
      TweenMax.to(elements[index_of_displayed], DURATION, {
        x: -2000,
        opacity: 0,
        delay: 0.2
      });
      TweenMax.to(elements[index_of_displayed + diff], DURATION, {
        x: 0,
        opacity: 1
      });
      index_of_displayed = index_of_displayed + diff;
    }
  }

  if (index_of_displayed == elements.length - 1) {
    if (diff == -1) {
      TweenMax.to(elements[index_of_displayed], 0.2, {
        x: 50,
        scale: 1.02
      });
      TweenMax.to(elements[index_of_displayed], DURATION, {
        x: -2000,
        opacity: 0,
        delay: 0.2
      });
      TweenMax.to(elements[index_of_displayed + diff], DURATION, {
        x: 0,
        opacity: 1
      });
      index_of_displayed = index_of_displayed + diff;
    }
  }

}

let offset = 0;

function mouseDragged(event) {
  if ((offset - event.movementX < limite - w) && (offset - event.movementX >= 0)) {
    offset = offset - event.movementX;
  }
}

window.addEventListener('touchstart', function onFirstTouch(event) {
  let last_touch = event.touches[event.touches.length-1];
  navigate(last_touch.screenX);
}, false);
