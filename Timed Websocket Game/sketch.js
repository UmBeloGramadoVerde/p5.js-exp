let width = 400;
let height = 400;
let MAX = 400;
let MIN = 10;
let contador=0;
let COLOR_1;
let COLOR_2;
let COLOR_3;
let current_color;

function setup() {

  createCanvas(width, height);
  terrain = new Terrain(MIN, MAX);
  terrain.setup();
  ball = new Ball(MAX/2,MAX/2,20);
  COLOR_1 = color( 157,172,255);
  COLOR_2 = color( 210,190,235);
  COLOR_3 = color( 255,210,215);
  current_color = COLOR_1;
}

function draw() {

  translate(width/2, height/2);
  translate(-ball.pos.x, -ball.pos.y);
  background(92, 39, 81);
  terrain.draw(current_color, color( 100,87,166));
  ball.move();
  ball.draw();
  ball.keepInside(terrain);
  stroke("black");
  let mouse = createVector(mouseX - (width/2) + ball.pos.x, mouseY -(height/2) + ball.pos.y);
  line(mouse.x, mouse.y, ball.pos.x, ball.pos.y);
  
  if (contador % 25 == 0) {
    if (current_color == COLOR_3) {current_color = COLOR_1;}
    else if (current_color == COLOR_1) {current_color = COLOR_2;}
    else if (current_color == COLOR_2) {
      current_color = COLOR_3;
      ball.boost(p5.Vector.sub(mouse, ball.pos));
    }
  }
  contador++;
}

function mousePressed() {
  let mouse = createVector(mouseX - (width/2), mouseY -(height/2));
  ball.boost(mouse);
}