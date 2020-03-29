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
		display.update(game.world.width,game.world.height);
		// add camera later
		for(let i = 0; i < game.world.me.bullets.length; i++){
			let x =  game.world.me.bullets[i].x-5;
			let y =  game.world.me.bullets[i].y;

			display.drawImg(assets_manager.bulletSprite, x, y, 0, 0, 10, 27, game.world.me.bullets[i].angleInDeg-90);
		}
		let rocketX = game.world.me.x;
		let rocketY = game.world.me.y;
		display.drawImg(assets_manager.playerSprite, rocketX, rocketY, -15, -25, 30, 55, game.world.me.angleInDeg + 90);
		// render gameobjects
		display.render();
	};
	var update = function(t) {
		// something like... 
		if (controller.left.active) {
			game.world.me.control = -1;
		} else if (controller.right.active) {
			game.world.me.control = 1;
		}
		else{
			game.world.me.control = 0;
		}
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
	var game           = new Game(1000,600, null); // pixel resolution (probrably will want it to be low for fps but high for world size + cam.
	var engine         = new Engine(1000/30, render, update);
	var controller     = new Controller();
	var assets_manager = new AssetsManager();


	const width = game.world.width;
	const height = game.world.height;

	display.buffer.canvas.height = height;
	display.buffer.canvas.width  = width;
	display.buffer.imageSmoothingEnabled = false; //  sure??  ************************************************************************************!!!!!!!!!

	game.world.setup();
	
	assets_manager.requestImage("imgs/rocket.png", (image) => {

		assets_manager.playerSprite = image;

		assets_manager.requestImage("imgs/nuke.png", (image) => {

			assets_manager.bulletSprite = image;
			
		});
		
		resize();
		engine.start();

	});


	window.addEventListener("keydown", keyDownUp);
	window.addEventListener("keyup"  , keyDownUp);
	window.addEventListener("resize" , resize);

});



game_server.createGame = function(player){
  var thegame = {
    id: UUID()            //give the game an id, not really necessary considering there will only be one game instance
    player_host: player   //not necessary either but for reference, this is the original player
    client_list: [player]
  };

  // var client_list = [player];

  thegame.game = new Game(1000, 600, thegame);    //game takes width and height according to Vikram blame him
  thegame.game.update( new Date().getTime() );
  thegame.game.active = true;

  this.game_count++;
  this.games[thegame.id] = thegame;

  return thegame;
 }

game_server.startGame = function(game) {    //technically more of an add player to game than start game

    for(var client in game.thegame.client_list){
      client.game = game;
    }

    //set this flag, so that the update loop can run it.
    game.active = true;

}; //game_server.startGame

game_server.findGame = function(player){
  if(this.game_count){
    for(var gameid in this.games){
      game_instance = this.games[gameid];       //esentially a fancy way of joining the (theoretically) only existing game
      game_instance.client_list.push(player);
      this.startGame(game_instance);
    }
  }
  else{
    this.createGame(player);
    this.startGame(player);
  }
}


