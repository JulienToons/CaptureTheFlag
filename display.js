const Display = function(canvas, container) {

	this.buffer  = document.createElement("canvas").getContext("2d"),
	this.context = canvas.getContext("2d");
	this.TO_RADIANS = Math.PI /180;

	this.drawRectangle = function(x, y, color = null, width =1, height=1) {
	if (color == null){ color = "#abc";};
	this.buffer.fillStyle = color;
	this.buffer.fillRect(x, y, width, height);

	};
	this.drawCircle = function(x, y, r, color = "#434", type = "both"){
	if(type == "fill"){ 
		this.buffer.fill();
		this.buffer.fillStyle = color
	}
	else{ this.buffer.stroke(); }
	  
      this.buffer.fillStyle = color;
	
	this.buffer.arc(x,y,r, 0, 360 * this.TO_RADIANS);
	  
	if(type == "both"){ 
		this.buffer.fillStyle = color;
		this.buffer.fill();
		this.buffer.stroke();
	} else if(type == "fill"){ 
		this.buffer.fillStyle = color;
		this.buffer.fill();
	}
	else{ this.buffer.stroke(); }
	  
	};
	this.update = function(){

	};
	this.drawObject = function(image, x,y,size){
		this.drawRectangle(x,y);
		try{ this.buffer.drawImage(image, x,y,size, size);}
		catch(e){ console.log("Bubble failed to load");}
	};
	  
	this.drawImg = function(image, x, y, size, r) {
		let rotation = 90-r;
		this.buffer.translate(x,y);
		this.buffer.rotate(rotation * this.TO_RADIANS);
		this.buffer.drawImage(image, -26,-37,size, size);
		this.buffer.rotate(-rotation * this.TO_RADIANS);
		this.buffer.translate(-x,-y);
	};

	  
	this.resize = function(w, h, height_width_ratio) {
		let temp = document.getElementById("main");
		let sb = document.getElementById("sidebar");
		let l = sb.offsetWidth + 0;
		let width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;

		let height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
		height = h - (document.getElementById("topbar").getAttribute("bottom") +81);
		width = w - (l + 26);
		
		temp.style.left = `${l}px`;
		
		if (height / width > height_width_ratio) {
			this.context.canvas.height = width * height_width_ratio;
			this.context.canvas.width  = width;
		} else {
			this.context.canvas.height = height;
			this.context.canvas.width  = height / height_width_ratio;
		}
		this.context.imageSmoothingEnabled = true;// ****************too
	};
};

Display.prototype = {
	constructor : Display,
	render:function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); }
};