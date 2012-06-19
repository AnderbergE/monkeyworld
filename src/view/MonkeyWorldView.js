/**
 * View for illustrating general game events, such as banana retrievement and
 * system confirmation.
 * 
 * @constructor
 * @extends {ViewModule}
 * @param {Kinetic.Stage} stage
 * @param {GameState} gameState
 * @param {MW.Game} game
 */
function MonkeyWorldView(stage, gameState, game) {
	Log.debug("Creating MonkeyWorldView", "object");
	ViewModule.call(this, "MonkeyWorldView");
	this._tag = "MonkeyWorldView";
	
	var layer = stage._gameLayer;
	
	this.tearDown = function() {
		this.forget();
	};
	
	/**
	 * Show a menu in which the user can choose a mini game to play.
	 * 
	 * @param {MonkeyWorldView} view
	 */
	(function(view) {
		var buttons = new Array();
		view.on("Game.showMiniGameChooser", function(msg) {
			
			var callback = msg.callback;
			var games = msg.games;
			var grid = Utils.gridizer(200, 200, 300, 100, 2);
			
			//for (var i = 0; i < games.length; i++) { (function(i) {
			for (var gameObject in games) { (function() {
				var game = games[gameObject];
				if (game.available != undefined && !game.available) return;
				var pos = grid.next();
				var button = new Kinetic.Group(pos);
				var rect = new Kinetic.Rect({
					width: 280,
					height: 100,
					stroke: "black",
					strokeWidth: 4
				});
				var text = new Kinetic.Text({
					text: game.title,
					fontSize: 20,
					fontFamily: "sans-serif",
					textFill: "black",
					align: "center",
					verticalAlign: "middle",
					x: rect.getWidth() / 2,
					y: rect.getHeight() / 2
				});
				button.add(rect);
				button.add(text);
				button.on("mousedown touchstart", function() {
					rect.setFill("yellow");
					callback(game);
				});
				buttons.push(button);
				layer.add(button);
			})();}
		});
		
		view.on("Game.hideMiniGameChooser", function(msg) {
			for (var i = 0; i < buttons.length; i++) {
				layer.remove(buttons[i]);
			}
			buttons = new Array();
		});
	})(this);

	/**
	 * Show loading bars and percentage numbers when downloading images, sound
	 * and possibly other resources.
	 * 
	 * @param {MonkeyWorldView} view
	 */
	(function LoadingModule(view) {
		
		/** @const */
		var BAR_CONFIG = {
			/** @const */ WIDTH: 300,
			/** @const */ HEIGHT: 30,
			/** @const */ MARGIN: 20
		};
		
		var bar = new Kinetic.Rect({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			width: BAR_CONFIG.WIDTH + BAR_CONFIG.MARGIN,
			height: BAR_CONFIG.HEIGHT + BAR_CONFIG.MARGIN,
			cornerRadius: 10,
			centerOffset: {
				x: (BAR_CONFIG.WIDTH + BAR_CONFIG.MARGIN) / 2,
				y: (BAR_CONFIG.HEIGHT + BAR_CONFIG.MARGIN) / 2
			},
			fill: "#333",
			alpha: 0
		});
		
		var filler = new Kinetic.Rect({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			width: 0,
			height: BAR_CONFIG.HEIGHT,
			centerOffset: {
				x: BAR_CONFIG.WIDTH / 2,
				y: BAR_CONFIG.HEIGHT / 2
			},
			fill: "#FFCC00"
		});
		
		var loadingText = new Kinetic.Text({
			fontFamily: "Arial",
			fontSize: 10,
			textFill: "black",
			fontStyle: "bold",
			textStrokeFill: "black",
			text: "Monkey World Demo",
			align: "center",
			y: stage.getHeight()/2 - 50,
			x: stage.getWidth()/2
		});
		
		view.on("Game.showLoadingScreen", function(msg) {
			layer.add(bar);
			layer.add(filler);
			layer.add(loadingText);
			bar.transitionTo({alpha:1, duration: msg.time / 1000});
		});	
		
		view.on("Game.loadingSounds", function(msg) {
			loadingText.setText(Strings.get("INIT_LOADING_SOUNDS"));
		});
		view.on("Game.loadingImages", function(msg) {
			loadingText.setText(Strings.get("INIT_LOADING_IMAGES"));
		});
		view.on("Game.loadingDone", function(msg) {
			layer.remove(loadingText);
			layer.remove(bar);
			layer.remove(filler);
		});
		view.on("Game.updateSoundLoading", function(msg) {
			filler.setWidth(msg.progress * BAR_CONFIG.WIDTH);
		});
		view.on("Game.updateImageLoading", function(msg) {
			filler.setWidth(msg.progress * BAR_CONFIG.WIDTH);
		});

	})(this);
};
inherit(MonkeyWorldView, ViewModule);