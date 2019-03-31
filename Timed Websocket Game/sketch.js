//The app now can generate the ball and make it be contained inside the arena (fixes need for inside the arena, ocasional crashes)
//Implemente the "boost" method in order to implement the rithym on the next phase
//Functions to detect distance and push implemented for interacting with all kinds os arenas and players

let width = 400;
let height = 400;

function setup() {

  createCanvas(width, height);
  terrain = new Terrain(10, 400);
  terrain.setup();
  ball = new Ball(50,50,20);
}

function draw() {

  translate(width/2, height/2);
  translate(-ball.pos.x, -ball.pos.y);
  background(51);
  ball.move();
  terrain.draw();
  ball.draw();
  let closest = ball.checkBoundaries(terrain);
  ball.keepInside(terrain);
}

function mousePressed() {
  let v;
  let mouse = createVector(mouseX - (width/2), mouseY -(height/2));
  console.log("Ball X: "+ ball.pos.x+" Ball Y:"+ball.pos.y);
  console.log("Mouse X: "+ mouse.x+"Mouse Y: "+mouse.y);
  v = p5.Vector.sub(mouse, ball.pos);
  ball.burst(mouse);
}
