
class Terrain {

  constructor(r_min, r_max) {
    this.points_inner = 20;
    this.points_outer = 40;
    this.radius_min = r_min;
    this.radius_max = r_max;
    this.vertices_inner = [];
    this.vertices_outer = [];
    this.midpoint = (this.radius_max - this.radius_min) / 3;
    this.body_inner;
    this.body_outer;
  }

  setup() {
    let i;
    let xaux, yaux;
    let radius;

    //***Generating terrain path***

    //inner
    for (i = 0; i < this.points_inner; i++) {
      radius = random(this.radius_min, this.radius_min + this.midpoint);
      xaux = cos((2*PI / this.points_inner) * i) * radius;
      yaux = sin((2*PI / this.points_inner) * i) * radius;
      this.vertices_inner.push({ x: xaux, y: yaux });
    }
    this.vertices_inner[this.points_inner-1] = this.vertices_inner[0];
    this.vertices_inner[this.points_inner] = this.vertices_inner[1];

    //outer
    for (i = 0; i < this.points_outer; i++) {
      radius = random(this.radius_max - this.midpoint, this.radius_max);
      xaux = cos((2*PI / this.points_outer) * i) * radius;
      yaux = sin((2*PI / this.points_outer) * i) * radius;
      this.vertices_outer[i] = { x: xaux, y: yaux };
    }
    this.vertices_outer[this.points_outer-1] = this.vertices_outer[0];
    this.vertices_outer[this.points_outer] = this.vertices_outer[1];

  }

  draw() {
    let i;

    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    for (i = 0; i < this.vertices_inner.length; i++) {
      vertex(this.vertices_inner[i].x, this.vertices_inner[i].y);
    }
    endShape();


    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    for (i = 0; i < this.vertices_outer.length; i++) {
      vertex(this.vertices_outer[i].x, this.vertices_outer[i].y);
    }
    endShape();
  }
}