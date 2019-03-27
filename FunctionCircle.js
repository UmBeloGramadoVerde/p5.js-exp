class FunctionCircle {

	constructor(x, y, vx, vy, delta) {
		this.cx = x;
		this.cy = y;
		this.vx = vx;
		this.vy = vy;
		this.delta = delta;
		this.x = 0;
		this.y = 0;
	}

	draw() {
		let i;
		for (i = 0; i < 10; i++) {
			stroke(255);
			strokeWeight(2);
			fill(255);
			this.y = radius * sin(this.vx / 10 * this.delta) + this.cy;
			this.x = radius * cos(this.vy / 10 * this.delta) + this.cx;
			point(this.x, this.y);
			this.delta += 1;
		}
	}

}
