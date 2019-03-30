let width = 800;
let height = 800;

function setup() {

  createCanvas(width, height);
  terrain = new Terrain(50, 400);
  terrain.setup();
  ball = new Ball(100,100,30);
}

function draw() {
  translate(width/2, height/2);
  background(51);
  ball.move();
  terrain.draw();
  ball.draw();
  ball.checkBoundaries(terrain);
}

function mousePressed() {
  let mouse = createVector(mouseX-width/2, mouseY-height/2);
  ball.accelerate(mouse);
}