const Game = function(w,h) {
	this.world    = new Game.World(w,h);
	this.update   = function(t = 0) {
		this.world.update();
	};
};
Game.prototype = { constructor : Game };

Game.World = function(w = 100, h = 100, cs = .2) {
	this.height = h;
	this.width = w;
	this.camera = undefined;
	//this.gravity = g;
	this.temp = cs;
	this.me = undefined;
	this.players = [];

};
Game.World.prototype = {

	constructor: Game.World,
  
	setup:function() {
		console.log("Capture The Flag [pitch-controlled] vALPHA 0.01");
		this.camera = new Game.Camera(0,0,this.temp);
		this.me = new Player(f.rand(1,this.width),f.rand(1,this.height-1),1,1);
	},

	update:function() {
		this.camera.update(this.me);
		this.me.update();
		for(let i = 0; i < this.me.bullets.length; i++){
			this.me.bullets[i].update();
		}
	}
};

var playSound = function (soundfile) {
		document.getElementById("dummy").innerHTML = 
		"<embed src='"+soundfile+"' hidden='true' autostart='true' loop='false' />";
}

// Staitc Helper Functions
class f{
	static get ELPSILON(){return .00000001}
	static toRadians(d){ return d * Math.PI/180;}
	static lerp(num, factor = .5){
		return num * factor;
	}
	
	static toDeg(a){
		return a * 180 /Math.PI;
	}
	static toRad(a){
		return a * Math.PI / 180;
	}
	static exists(a){
		return a != Infinity && a != null && a != undefined;
	}
	static random(a,b = null){
		if(f.exists(b)){
			return a + Math.random(b-a);
		}
		else {
			return Math.random(a);
		}
	}
	static rand(a,b=null){return this.random(a,b);}
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

Game.Camera = function(xx,yy,cs = .2){
	this.scale = cs;
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
	constructor: Game.Camera,
	shake:function(){
		this.shakeFrames = 12;
	},
	update:function(player){
		// lerp function (aka slowly moves to player's pos as if connected by a smooth spring
		this.x = (Math.abs(this.x - player.x) <= this.snapDistance)?   (player.x) + (this.lerpFactor * (this.x - player.x))  :  player.x;
		this.y = (Math.abs(this.x - player.x) <= this.snapDistance)?  (player.y) + (this.lerpFactor * (this.y - player.y))  :  player.y;
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
		this.theta += this.omega;
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
	get av(){ return this.angularVelocity;}
	set av(a){ this.angularVelocity = a};
	set theta(t){
		this.angle = t;
	}
	get omega() {
		return this.angularVelocity;
	}
	set omega(x) {
		this.angularVelocity = x;
	}
	get angleInDeg(){ 
		return f.toDeg(this.theta);
	};
};

class Projectile extends Transform{
	constructor(x,y,vx=0,vy=0,theta=0,av=0,speed = 1){
		super(x,y,vx,vy,theta,av);
		this.speed = speed;
	}
	update(){
		super.update();
		
		// lerp vx?
		
		this.v = f.v.multiply(f.v.normal(this.theta),this.speed);
	}
}

class Bullet extends Transform{
	constructor(x,y,vx,vy,theta=0,av=0){
		super(x,y,vx,vy,theta,av);
		this.isDead = false;
		this.framesLeftToShoot = 120;
	}
	
	update(){
		super.update();
		
		this.framesLeftToShoot--;
		
		if(this.framesLeftToShoot <= 0){
			this.isDead = true;
		}
	}
}

//audio is html-specific
class Player extends Projectile{
	constructor(x = 0,y = 0,vx = 0,vy = 0, theta = 0, av=0){
		super(x,y,vx,vy,theta,av);
		this.health = 100;
		this.control = -1; // float ( left to right )
		this.bullets = [];
		
		this.framesLeftToShoot = 15;
		this.rSpeed = .04;
		this.maxRSpeed = .1;
	}
	update(){
		super.update();
		this.framesLeftToShoot--;
		
		this.av *= .7;
		this.av += this.rSpeed * this.control;
		if ( this.av >  this.maxRSpeed){  this.av =  this.maxRSpeed; }
		
		if(this.framesLeftToShoot <= 0){
			this.framesLeftToShoot = 3;
			this.shoot();
		}

		for(let i = 0; i <this.bullets.length; i++){
			if(this.bullets[i].isDead){
				console.log("DESTROYED " + this.bullets.splice(i, 1));
				i++;
			}
		}
	}
	hit(dmg = 1, force = [0,0]){
		this.health += -Math.abs(dmg);
		//this.pos = f.v.add(this.pos, force);
	}	
	shoot(){
		//console.log("SHOOT");
		let shootingSpeed = Math.random()*2 + 15;
		// var rect = this().getBoundingClientRect
		this.bullets.push(new Bullet(this.x,this.y,shootingSpeed * this.vx/f.v.mag(this.v), shootingSpeed * this.vy/f.v.mag(this.v),this.theta,0));
		playSound("/sounds/shoot.wav");
		// need lerp for this below
		// this.pos = f.v.add(this.pos, force);
	}
}

class Particle extends StrictTransform{
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