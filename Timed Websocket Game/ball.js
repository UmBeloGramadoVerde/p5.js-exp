class Ball {

	constructor(x,y,r){
		this.pos = createVector(x,y);
		this.r=r;
		this.speed = createVector(0,0);
		this.last;
	}

	draw(){
		fill(75, 192, 217);
		stroke(118, 229, 252);
		strokeWeight(1);
		ellipse(this.pos.x,this.pos.y,2*this.r,2*this.r);
	}

	move(){
		this.pos.add(this.speed);
	}

	accelerate(mouse){
		if ((this.speed.x <= 100) && (this.speed.y <= 100)){
			let diff = p5.Vector.sub(this.pos, mouse);
			diff.normalize();
			diff.mult(-1);
			this.speed.add(diff);
		}
	}

	sqr(x) { return x * x }

	dist2(v, w) {
		return this.sqr(v.x - w.x) + this.sqr(v.y - w.y)
	}
	distToSegmentSquared(p, v, w) {
		var l2 = this.dist2(v, w);
		if (l2 == 0) return this.dist2(p, v);
		var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
		t = Math.max(0, Math.min(1, t));
		this.last = {
			x: v.x + t * (w.x - v.x),
	        y: v.y + t * (w.y - v.y)
	    };
		return this.dist2(p, this.last);
	}
	distToSegment(p, v, w) {
		return Math.sqrt(this.distToSegmentSquared(p, v, w));
	}

	checkBoundaries(terrain){
		let closest_distance = 1000000000;
		let closest_vector = new p5.Vector();
		let i=0;
		let y1, y2, x1, x2, x0, xc, yc,D, x, y;
		let v1 = createVector(0, 0, 0);
		let vertex=v1;
		let distance;

		for (i = 0; i < terrain.points_inner; i++) {

			distance = this.distToSegment(this.pos, terrain.vertices_inner[i], terrain.vertices_inner[i+1]);
			if (distance < closest_distance){
				closest_vector = createVector(this.last.x, this.last.y);
				closest_distance = distance;
			}

		}

		for (i = 0; i < terrain.points_outer; i++) {
			distance = this.distToSegment(this.pos, terrain.vertices_outer[i], terrain.vertices_outer[i+1]);
			if (distance < closest_distance){
				closest_vector = createVector(this.last.x, this.last.y);
				closest_distance = distance;
			}
		}

		for (i = 0; i < terrain.points_inner; i++) {
			if (i>0) {
				distance = this.distToSegment(this.pos, terrain.vertices_inner[i], terrain.vertices_inner[i-1]);
				if (distance < closest_distance){
					closest_vector = createVector(this.last.x, this.last.y);
					closest_distance = distance;
				}
			}
		}

		for (i = 0; i < terrain.points_outer; i++) {
			if (i>0) {
				distance = this.distToSegment(this.pos, terrain.vertices_outer[i], terrain.vertices_outer[i-1]);
				if (distance < closest_distance){
					closest_vector = createVector(this.last.x, this.last.y);
					closest_distance = distance;
				}
			}
		}

		stroke(118, 229, 252);
    	strokeWeight(1);
    	point(closest_vector.x, closest_vector.y);
    	line(this.pos.x,this.pos.y,closest_vector.x, closest_vector.y);

  		if (closest_distance < this.r) {
  			this.speed = createVector(0,0,0);
  		}

  		return closest_vector;
	}

	boost(dir){
		let STRENGTH = 20;
		let v1 = dir.normalize();
		v1.mult(STRENGTH);
		let v2 = createVector(0,0,0);
		this.speed = p5.Vector.lerp(v2, v1, 0.4);
	}

	push(terrain, direction){
		let closest = this.checkBoundaries(terrain);
		let distance = this.dist2(this.pos, closest);
		if (distance <= 400) {
			while(distance <= 400){
				closest = this.checkBoundaries(terrain);
				this.pos.add(closest.normalize().mult(direction*0.3));
				distance = this.dist2(this.pos, closest);
			}
		}
	}

	keepInside(terrain){

		let closest = this.checkBoundaries(terrain);
		let distance = this.dist2(this.pos, closest);
		if (this.dist2(createVector(0,0), this.pos) >= this.r) {
			if (this.dist2(createVector(0,0), this.pos) > this.dist2(createVector(0,0), closest)) {
				this.push(terrain, 1);
			}
			else if (this.dist2(createVector(0,0), this.pos) <= this.dist2(createVector(0,0), closest)) {
				this.push(terrain, -1);
			}
		}

	}
}
