class FunctionCircleArray {

	constructor(n, offset_x, offset_y) {
		let i = 0;
		this.n = n;
		this.circles = [];
		for (i = 1; i <= n; i++) {
			this.circles[i] = new FunctionCircle(i * offset_x, offset_y, i, i, 0);
		}
	}

	draw() {
		let i;
		for (i = 1; i <= this.n; i++) {
			this.circles[i].draw();
		}
	}

}
