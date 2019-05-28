class Particle {

  constructor(x, y) {
    this.position = createVector(x, y);
    this.r = 2;
    this.speed = p5.Vector.mult(p5.Vector.random2D(), random(1, 5));
    this.lifetime = random(50, 100);
  }

  draw() {
    fill(120, 100, 217);
    stroke(92, 39, 81);
    strokeWeight(1);
    ellipse(this.position.x, this.position.y, 2 * this.r, 2 * this.r);
  }

  move() {
    this.position.add(this.speed);
  }

  update() {
    this.draw();
    this.move();
    if (this.lifetime > 0) {
      this.lifetime--;
    }
  }

  boost(dir) {
    let STRENGTH = 10;
    let v1 = dir.normalize();
    v1.mult(STRENGTH);
    let v2 = createVector(0, 0);
    this.speed = p5.Vector.lerp(v2, v1, 0.4);
  }

}