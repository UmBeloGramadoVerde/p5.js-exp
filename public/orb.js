class Orb {

  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.particles = [];
    this.alive = true;
  }

  draw() {
    let i;
    if (this.alive == true) {
      fill(255, 202, 41);
      stroke(92, 39, 81);
      strokeWeight(1);
      ellipse(this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
    }
    if (this.particles.length > 0) {
      for (i = this.particles.length - 1; i >= 0; i--) {
        if (this.particles[i].lifetime <= 0) {
          this.particles.splice(i, 1);
        } else {
          this.particles[i].update();
        }
      }
    }
  }

  explode() {
    let j;
    let p;
    for (j = 0; j < 30; j++) {
      p = new Particle(this.pos.x, this.pos.y);
      this.particles.push(p);
    }
  }
}