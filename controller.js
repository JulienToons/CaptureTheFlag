const Controller = function() {

	this.left  = new Controller.ButtonInput();
	this.right = new Controller.ButtonInput();

	this.keyDownUp = function(type, key_code) {
		var down = (type == "keydown") ? true : false;

		// switch(key_code) {
		// 	case 37: this.left.getInput(down);  break;
		// 	case 39: this.right.getInput(down);
		// }
		switch(key_code) {
			case 65: this.left.getInput(down);  break;
			case 68: this.right.getInput(down);
		}
	};

};

Controller.prototype = {
	constructor : Controller
};

Controller.ButtonInput = function() {
	this.active = this.down = false;
};

Controller.ButtonInput.prototype = {
	constructor : Controller.ButtonInput,

	getInput : function(down) {
		if (this.down != down) this.active = down;
		this.down = down;
	}
};


var game_var = {};

	//When loading, we store references to our
	//drawing canvases, and initiate a game instance.
window.onload = function(){

		//Create our game client instance.
	game_var = new Game(1000, 600);

			//Fetch the viewport
		game_var.viewport = document.getElementById('viewport');

			//Fetch the rendering contexts
		game_var.ctx = game_var.viewport.getContext('2d');

			//Set the draw style for the font
		game_var.ctx.font = '11px "Helvetica"';

		//Finally, start the loop
	game_var.update( new Date().getTime() );

}; //window.onload
