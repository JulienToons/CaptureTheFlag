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

	this.balls = []

	this.players = []; // player contains string and hammer
	this.user = null;

	this.particles = [];

};
Game.World.prototype = {

	constructor: Game.World,
  
	setup:function() {
		console.log("Capture The Flag [pitch-controlled] vALPHA 0.01");
	
	},

	update:function() {

	}
};

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

// Staitc Helper Functions
class f{
	static get ELPSILON(){return .00000001}
}

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