window.addEventListener("load", function(event) {

	const AssetsManager = function() {
		this.playerSprite = undefined;
		this.bulletSprite = undefined;
	};

	AssetsManager.prototype = {
		constructor: Game.AssetsManager, requestImage:function(url, callback) {
			let image = new Image();
			image.addEventListener("load", function(event) {
				callback(image);
			}, { once:true });
			image.src = url;
		}
	};

	// var functions
	var keyDownUp = function(event) {
		controller.keyDownUp(event.type, event.keyCode);
	};
	var resize = function(event) {
		display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, height / width);
		display.render();
	};
	var render = function() {
		display.update();
		// render gameobjects
		display.render();
	};
	var update = function(t) {
		// something like... 
		//if (controller.left.active) {       console.log("left");           }
		//if (controller.right.active) {            console.log("right");                }
		//if (controller.up.active) { console.log("up");controller.up.active= false;}//game.world.player.jump();      controller.up= false; }
		
		// or
		// game.world.player.down = controller.down.active;
		game.update(t);
		return;
	};
	setInterval(function(){
		if(needResize == true){
			clearElements();

			needResize = false; 
			resize();
		}
	}, 100);

	var display        = new Display(document.querySelector("canvas"));
	var game           = new Game(1000,600); // pixel resolution (probrably will want it to be low for fps but high for world size + cam.
	var engine         = new Engine(1000/30, render, update);
	var controller     = new Controller();
	var assets_manager = new AssetsManager();


	const width = game.world.width;
	const height = game.world.height;

	display.buffer.canvas.height = height;
	display.buffer.canvas.width  = width;
	display.buffer.imageSmoothingEnabled = false; //  sure??  ************************************************************************************!!!!!!!!!

	game.world.setup();
	/* 
	assets_manager.requestImage("imgs/theImageIWant.png", (image) => {

		assets_manager.cannon_img = image;

		// request more imgs
		
		resize();
		engine.start();

	});*/

	resize();
	engine.start();


	window.addEventListener("keydown", keyDownUp);
	window.addEventListener("keyup"  , keyDownUp);
	window.addEventListener("resize" , resize);

});


