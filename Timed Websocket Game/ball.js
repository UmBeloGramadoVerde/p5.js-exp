class Ball {

	constructor(x,y,r){
		this.pos = createVector(x,y);
		this.r=r;
		this.speed = createVector(0,0);
	}

	draw(){
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

	checkBoundaries(terrain){
		let closest_distance = 1000000000;
		let closest_vector = new p5.Vector();
		let i=0;
		for (i = 0; i < terrain.points_inner; i++) {
			let vertex = createVector(terrain.vertices_inner[i].x,terrain.vertices_inner[i].y);
			let distance = p5.Vector.dist(vertex, this.pos);
			if (distance < closest_distance){
				closest_vector = vertex;
				closest_distance = distance;
			}
    	}
    	for (i = 0; i < terrain.points_outer; i++) {
			let vertex = createVector(terrain.vertices_outer[i].x,terrain.vertices_outer[i].y);
			let distance = p5.Vector.dist(vertex, this.pos);
			if (distance < closest_distance){
				closest_vector = vertex;
				closest_distance = distance;
			}
    	}
    	stroke(255);
    	strokeWeight(10);
    	point(closest_vector.x, closest_vector.y);
	}
}