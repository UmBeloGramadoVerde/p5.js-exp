let width = 400;
let height = 400;
let MAX = 400;
let MIN = 10;


function setup() {

  createCanvas(width, height);
  terrain = new Terrain(MIN, MAX);
  terrain.setup();
  ball = new Ball(MAX/2,MAX/2,20);
}

function draw() {

  translate(width/2, height/2);
  translate(-ball.pos.x, -ball.pos.y);
  background(92,39,81);
  ball.move();
  terrain.draw();
  ball.draw();
  ball.checkBoundaries(terrain);
  ball.keepInside(terrain);
}

function mousePressed() {
  let v;
  let mouse = createVector(mouseX - (width/2), mouseY -(height/2));
  console.log("Ball X: "+ ball.pos.x+" Ball Y:"+ball.pos.y);
  console.log("Mouse X: "+ mouse.x+"Mouse Y: "+mouse.y);
  v = p5.Vector.sub(mouse, ball.pos);
  ball.boost(mouse);
}
