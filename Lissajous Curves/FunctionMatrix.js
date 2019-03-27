class FunctionCircleMatrix {

  constructor(n) {
    let i = 0;
    this.n = n;
    this.matrix = [];
    for (i = 1; i <= n; i++) {
      this.matrix[i] = new FunctionCircleArray(this.n, 3 * radius, i * 3 * radius + radius);
    }
  }

  draw() {
    let i;
    this.generate();
    for (i = 1; i <= this.n; i++) {
      this.matrix[i].draw();
    }
  }

  generate() {
    let i = 0;
    let j = 0;
    for (i = 1; i <= this.n; i++) {
      this.matrix[i].circles[1].vx = i;
      this.matrix[i].circles[1].vy = i;
    }
    for (i = 2; i <= this.n; i++) {
      for (j = 2; j <= this.n; j++) {
        this.matrix[i].circles[j].vx = this.matrix[i].circles[1].vx;
        this.matrix[i].circles[j].vy = this.matrix[1].circles[j].vy;
      }
    }
  }
}
