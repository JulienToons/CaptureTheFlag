const Engine = function(time_step, render, update) {

  this.accumulated_time        = 0;
  this.animation_frame_request = undefined,
  this.time                    = undefined,
  this.time_step               = time_step,
  this.timeFactor              =1;
  this.autoTime                =false;
  
  this.updated = false;

  this.update = update;
  this.render = render;

  this.run = function(time_stamp) {
	  
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;
	
	let calculatedTimeStep = this.time_step*this.timeFactor;//*this.autoTime;
	
	while(this.autoTime == true){
		//console.log("autoTime");
		let efficiencyRate = this.time_step * .75;
		this.update(efficiencyRate);
	}
	
    if (this.accumulated_time >= /*this.time_step*/ calculatedTimeStep* 3) {

      this.accumulated_time = calculatedTimeStep;//this.time_step;

    }

    while(this.accumulated_time >= calculatedTimeStep){//this.time_step) {

      this.accumulated_time -= calculatedTimeStep;//this.time_step;

      this.update(calculatedTimeStep);//this.time_step);

      this.updated = true;

    }

    if (this.updated) {

      this.updated = false;
	  
      this.render(time_stamp);

    }

  };

  this.handleRun = (time_step) => { this.run(time_step); };

};

Engine.prototype = {

  constructor:Engine,

  start:function() {

    this.accumulated_time = this.time_step;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);

  },

  stop:function() { window.cancelAnimationFrame(this.animation_frame_request); }

};