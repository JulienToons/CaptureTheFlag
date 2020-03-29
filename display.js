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
	this.update = function(w,h){
		this.drawRectangle(0,0,"#5bb",w,h);
	};
	this.drawObject = function(image, x,y,size){
		this.drawRectangle(x,y);
		try{ this.buffer.drawImage(image, x,y,size, size);}
		catch(e){ console.log("Img failed to load: "+e);}
	};
	  
	this.drawImg = function(image, x, y, ox, oy, width, height, r, spread) {
		// this.drawRectangle(x,y,"#000",50,40);
		let rotation = r;
		this.buffer.translate(x,y);
		this.buffer.rotate(rotation * this.TO_RADIANS);
		// this.drawRectangle(0,0,"#eee", 20, 20);
		this.buffer.drawImage(image, ox, oy, width, height);
		this.buffer.rotate(-rotation * this.TO_RADIANS);
		this.buffer.translate(-x,-y);
	};

	  
	this.resize = function(w, h, height_width_ratio) {		
		if (h / w > height_width_ratio) {
			this.context.canvas.height = w * height_width_ratio;
			this.context.canvas.width  = w;
		} else {
			this.context.canvas.height = h;
			this.context.canvas.width  = h / height_width_ratio;
		}
		this.context.imageSmoothingEnabled = true;// ****************too
	};
};

Display.prototype = {
	constructor : Display,
	render:function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); }
};