const Game = function(w,h) {
	this.world    = new Game.World(w,h);
	this.update   = function(t = 0) {
		this.world.update();
	};
};
Game.prototype = { constructor : Game };

Game.World = function(w = 100, h = 100, cw = 10, ch = 10, g = 1) { // cw := camera width // world goes around 0 <=> maxlen (-w/2 to w/2)
	this.height = h;
	this.width = w;
	this.camera = new Camera(0,0,cw, ch);
	this.gravity = g;

	this.players = [];

};
Game.World.prototype = {

	constructor: Game.World,
  
	setup:function() {
		console.log("Capture The Flag [pitch-controlled] vALPHA 0.01");
	
	},

	update:function() {

	}
};

// Staitc Helper Functions
class f{
	static get ELPSILON(){return .00000001}
	static toRadians(d){ return d * Math.PI/180;}
	static lerp(num, factor = .5){
		return num * factor;
	}
	static v = class v{ // vector 2d functions
		static normalize(v){
			let m = this.mag(v);
			return [v[0]/m, v[1]/m];		
		}
		static normal(theta){
			return [Math.cos(theta), Math.sin(theta)];
		}
		
		static multiply (v, m){ return [v[0] * m, v[1] * m];}
		static mult (v, m){ return [v[0] * m, v[1] * m];}
		
		static mag(v){ return this.vectorDistance(v[0],v[1]);}
		static dist(v){ return this.vectorDistance(v[0],v[1]);}
		static distance(v){ return this.vectorDistance(v[0],v[1]);}
		static vectorDistance(x,y){
			return Math.sqrt((x*x)+(y*y));
		}
		
		static add(a,b){ // 2d vectors only
			return [a[0] + b[0], a[1] + b[1]];
		}
		static addition(a,b){ return this.add(a,b); }
		
		static difference(a,b){
			return [a[0] - b[0], a[1] - b[1]];
		}
		static subtract(a,b){ return this.difference(a,b);}
		static subtraction(a,b){ return this.difference(a,b);}
		
		static project(vector, b){ // v onto b
			let mag = Math.dot(vector, b) / Math.dot(b,b);
			let c = [b[0] * mag, b[1] * mag];
			return c;
			// Math.sqrt(Math.dot(vector) - Math.dot(b));
		}
		static proj(v,b){ return this.project(v,b);}
		
		static projectAngle(vector, theta){
			// theta counterclockwise from --->
			return project(vector, [Math.cos(theta), Math.sin(theta)]);
		}
		
		static rotate(v, theta) {
			return [v[0] * Math.cos(theta) - v[1] * Math.sin(theta), v[0] * Math.sin(theta) + v[1] * Math.cos(theta)];
		}
		static rotateXY(x,y,t){
			return this.rotate([x,y],t);
		}
	}
}

Game.Camera = function(xx,yy){
	this.x = xx;
	this.y = yy;
	this.x_offset = 0;
	this.y_offset = 0;
	this.theta = 0;
	this.following = null;
	this.shakeFrames = 0;
	this.lerpFactor = .2;
	this.snapDistance = 2;
	// add shake animations with theta
};
Game.Camera.prototype = {
	constructor: Game.Cannon,
	shake:function(){
		this.shakeFrames = 12;
	}
	update:function(player){
		// lerp function (aka slowly moves to player's pos as if connected by a smooth spring
		this.x = (Math.abs(this.x - player.x) <= this.snapDistance)   (player.x) + (this.lerpFactor * (this.x - player.x))  :  player.x;
		this.y = (Math.abs(this.x - player.x) <= this.snapDistance)   (player.y) + (this.lerpFactor * (this.y - player.y))  :  player.y;
	}
};

// Generic Extendable Classes
class Position{
	constructor(x,y){
		this.x=x;
		this.y=y;
	}
	get pos(){ return [this.x, this.y];}
	set pos(pos){
		this.x = pos[0];
		this.y = pos[1];
	}
	get position(){ return [this.x, this.y];}
	set position(pos){
		this.x = pos[0];
		this.y = pos[1];
	}
};
class StrictTransform extends Position{ // transform without rotation
	constructor(x,y,vx,vy){
		super(x,y);
		this.vx=vx;
		this.vy=vy;
	}
	update(){
		this.x += this.vx;
		this.y += this.vy;
	}
	get v(){ return [this.vx, this.vy];}
	set v(v){
		this.vx = v[0];
		this.vy = v[1];
	}
	get vector(){ return this.v(); }
	set vector(v){ this.v(v); }
};
class Transform extends StrictTransform{
	constructor(x = 0,y = 0,vx = 0,vy = 0, theta = 0, av=0) {
		super(x,y,vx,vy);
		this.angle = theta; // in radians counterclockwise from --> (rotated across the z-axis)
		this.angularVelocity = av;
	}
	update(){
		super.update();
		theta += omega;
	}
	get av() {
		return this.angularVelocity;
	}
	set av(x) {
		this.angularVelocity = x;
	}
	get theta() {
		return this.angle;
	}
	set theta(t){
		this.angle = t;
	}
	get omega() {
		return this.angularVelocity;
	}
	set omega(x) {
		this.angularVelocity = x;
	}
};

class Projectile extends Transform{
	constructor(x,y,vx,vy,theta=0,av=0){
		this.super(x,y,vx,vy,theta,av);
		this.speed = 5;
	}
	update(){
		super.update();
		
		this.pos = f.v.add(this.pos, f.v.projectAngle(speed, theta));
	}
}

class Bullet extends Projectile{
	// **************************************************************************************************************************************************************
}

class Player extends Projectile{
	constructor(x = 0,y = 0,vx = 0,vy = 0, theta = 0, av=0){
		super(x,y,vx,vy,theta,av);
		this.health = 100;
		this.control = -1; // float ( left to right )
		this.bullets = [];
		
		this.framesLeftToShoot = 15;
		this.rSpeed = 1;
		this.maxRSpeed = 8;
	}
	update(){
		super.update();
		
		av *= .7;
		av += rSpeed * this.control;
		if (av > maxRSpeed){ av = maxRSpeed; }
		
		if(this.framesLeftToShoot <= 0){
			this.framesLeftToShoot = 10;
			this.shoot();
		}
	}
	hit(dmg = 1, force = [0,0]){
		this.health += -Math.abs(dmg);
		this.this.pos = f.v.add(this.pos, force);
	}	
	shoot(){
		this.bullets.push(/*new Bullet*/); // **************************************************************************************************************************************************************
	}
}

private class Particle extends StrictTransform{
	constructor(x = 0,y = 0,vx = 0,vy = 0, duration = 50, color = "#555", a = 1) {
		super(x,y,vx,vy);
		this.duration = duration;
		this.framesLeft = duration;
		this.color = color;
		this.a = a;
	}
	update(){
		super.update();
		this.a = this.framesLeft / this.duration;
		this.framesLeft += -1;
	}
	get dead(){
		return (this.a <= 0);
	}
};