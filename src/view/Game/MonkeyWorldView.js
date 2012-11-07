/**
 * View for illustrating general game events, such as banana retrievement and
 * system confirmation.
 * 
 * @constructor
 * @extends {MW.ViewModule}
 * @param {Kinetic.Stage} stage
 */
MW.MonkeyWorldView = MW.ViewModule.extend(
/** @lends {MW.MonkeyWorldView.prototype} */
{
	/** @constructs */
	init: function (stage) {
		this._super(stage, "MonkeyWorldView");
		var layer = stage.getDynamicLayer();
		var that = this;
		/**
		 * Show a menu in which the user can choose a mini game to play.
		 * 
		 * @param {MW.MonkeyWorldView} view
		 */
		(function(view) {
			var buttons = [];
			var log;
			view.on("Game.showMiniGameChooser", function(msg) {
			
				log = new Kinetic.Text({
					text: "log",
					textFill: "black",
					fontSize: 20
				});
				log.on("mousedown touchstart", function() {
					that.tell(MW.Event.PRINT_LOG);
				});
				layer.add(log);
				
				var callback = msg.callback;
				var games = msg.games;
				var grid = Utils.gridizer(200, 200, 300, 100, 2);
			
				for (var category in games) { (function() {
					for (var i = 0; i < games[category].sum; i++) { (function() {
						var game = games[category].variations[i];
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
							verticalAlign: "center",
							width: 280,
							height: 100,
							y: 40
						});
						text.setAlign("center");
						button.add(rect);
						button.add(text);
						button.on("mousedown touchstart", function() {
							rect.setFill("yellow");
							callback(game);
						});
						/* add to button array */
						buttons.push(button);
						layer.add(button);
					})();}
				})();}
			});
		
			view.on("Game.hideMiniGameChooser", function(msg) {
				layer.remove(log);
				for (var i = 0; i < buttons.length; i++) {
					layer.remove(buttons[i]);
				}
				buttons = new Array();
			});
		})(this);

		/**
		 * Show loading bars and percentage numbers when downloading images,
		 * sound and possibly other resources.
		 * 
		 * @param {MW.MonkeyWorldView} view
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
				offset: {
					x: (BAR_CONFIG.WIDTH + BAR_CONFIG.MARGIN) / 2,
					y: (BAR_CONFIG.HEIGHT + BAR_CONFIG.MARGIN) / 2
				},
				fill: "#333",
				opacity: 0
			});

			var filler = new Kinetic.Rect({
				x: stage.getWidth() / 2,
				y: stage.getHeight() / 2,
				width: 0,
				height: BAR_CONFIG.HEIGHT,
				offset: {
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
				width: stage.getWidth(),
				height: 50,
				y: stage.getHeight()/2 - 50,
				x: 0
			});

			view.on("Game.showLoadingScreen", function(msg) {
				layer.add(bar);
				layer.add(filler);
				layer.add(loadingText);
				bar.transitionTo({opacity:1, duration: msg.time / 1000});
			});

			view.on("Game.loadingSounds", function(msg) {
				loadingText.setText("Loading sounds");
				layer.draw();
			});

			view.on("Game.loadingImages", function(msg) {
				loadingText.setText("Loading images");
				layer.draw();
			});

			view.on("Game.loadingDone", function(msg) {
				layer.remove(loadingText);
				layer.remove(bar);
				layer.remove(filler);
				layer.draw();
			});

			view.on("Game.updateSoundLoading", function(msg) {
				filler.setWidth(msg.progress * BAR_CONFIG.WIDTH);
				layer.draw();
			});

			view.on("Game.updateImageLoading", function(msg) {
				filler.setWidth(msg.progress * BAR_CONFIG.WIDTH);
				layer.draw();
			});

		})(this);
	}
});

