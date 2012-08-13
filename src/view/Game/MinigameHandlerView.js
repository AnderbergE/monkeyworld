/**
 * @constructor
 * @extends {ViewModule}
 */
MW.MinigameHandlerView = function () {
	ViewModule.call(this, "MinigameHandlerView");
	/** @type {MW.MinigameHandlerView} */ var view = this;
	/** @type {Kinetic.Stage}          */ var stage = view.stage;
	/** @type {Kinetic.Layer}          */ var layer = stage._gameLayer;
	/**
	 * Show the current total backend score of the minigame.
	 * @param {MW.MinigameHandlerView} view
	 */
	(function (view) {
		/** @const @type {string} */ var label = "Backend Score (current minigame):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 16,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 500,
			y: 35
		});
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MINIGAME, function(msg) {
			text.setText(label + " " + msg.score);
		});
		view.on(MW.Event.MINIGAME_STARTED, function(msg) {
			console.log("added be total score text");
			layer.add(text);
		});
		view.addTearDown(function() {
			console.log("remove be total score text");
			layer.remove(text);
		});
	})(this);

	/**
	 * Show the current learning track.
	 * @param {MW.MinigameHandlerView} view
	 */
	(function (view) {
		/** @const @type {string} */ var label = "Learning track (current game):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 16,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 500,
			y: 55
		});
		view.on(MW.Event.MINIGAME_STARTED, function(msg) {
			console.log("added learning track text");
			layer.add(text);
		});
		view.on(MW.Event.LEARNING_TRACK_UPDATE, function(msg) {
			text.setText(label + " " + msg.learningTrack.name());
		});
		view.addTearDown(function() {
			console.log("remove learning track text");
			layer.remove(text);
		});
	})(this);

	/**
	 * Show the pitcher
	 */
	(function (view) {
		var pitcherImage, dropImage, pitcherBottomImage, waterRect,
		levelHeight = 6.9, dropOrigin = { x: 10, y: 20 };
		view.addSetup(function () {
			pitcherImage = new Kinetic.Image({
				image: MW.Images.PITCHER,
				x: layer.getStage().getWidth() - MW.Images.PITCHER.width - 20,
				y: 20,
				width: MW.Images.PITCHER.width,
				height: MW.Images.PITCHER.height,
				visible: false
			});
			dropImage = new Kinetic.Image({
				image: MW.Images.WATERDROP,
				centerOffset: {
					x: MW.Images.WATERDROP.width / 2,
					y: 0
				},
				width: MW.Images.WATERDROP.width,
				height: MW.Images.WATERDROP.height,
				visible: false
			});
			pitcherBottomImage = new Kinetic.Image({
				image: MW.Images.PITCHER_BOTTOM,
				x: pitcherImage.getX(),
				y: pitcherImage.getY(),
				width: MW.Images.PITCHER_BOTTOM.width,
				height: MW.Images.PITCHER_BOTTOM.height,
				visible: false
			});
			waterRect = new Kinetic.Rect({
				fill: "#379de4",
				x: pitcherImage.getX() + 20,
				y: pitcherImage.getY() + pitcherImage.getHeight() - 4,
				width: 54,
				height: 0
			});
			layer.add(pitcherBottomImage);
			layer.add(waterRect);
			layer.add(dropImage);
			layer.add(pitcherImage);
		});
		view.addTearDown(function() {
			layer.remove(dropImage);
			layer.remove(pitcherImage);
			layer.remove(pitcherBottomImage);
			layer.remove(waterRect);
		});
		view.on(MW.Event.MINIGAME_STARTED, function (msg) {
			pitcherImage.show();
			var level = view.game.getWaterDrops();
			if (level > 0)
				pitcherBottomImage.show();
			waterRect.setHeight(waterRect.getHeight() - levelHeight * level);
		});
		view.on(MW.Event.PITCHER_LEVEL_RESET, function (msg) {
			pitcherBottomImage.hide();
			waterRect.setHeight(0);
		});
		view.on(MW.Event.PITCHER_LEVEL_SET_DROP_ORIGIN, function (msg) {
			dropOrigin.x = msg.x;
			dropOrigin.y = msg.y;
		});
		view.on(MW.Event.PITCHER_LEVEL_ADD, function (msg) {
			console.log("Drop origin", dropOrigin);
			var x2 = pitcherImage.getX() + pitcherImage.getWidth() / 2;
			var y2 = pitcherImage.getY() + pitcherImage.getHeight() - dropImage.getHeight();
			var velocity = 200; /* px/s */
			var distance = Math.sqrt(Math.pow(dropOrigin.x - x2, 2) + Math.pow(dropOrigin.y - y2, 2));
			var time = distance / velocity * 1000;
			console.log(velocity, distance, time);
			dropImage.setX(dropOrigin.x);
			dropImage.setY(dropOrigin.y);
			dropImage.setAlpha(1);
			dropImage.show();
			MW.Sound.play(MW.Sounds.YAY_HELPED_ME_GET_WATER_DROP_1);
			view.setTimeout(function () {
				MW.Sound.play(MW.Sounds.YAY_HELPED_ME_GET_WATER_DROP_2);
				view.setTimeout(function () {
					MW.Sound.play(MW.Sounds.LETS_FILL_THE_BUCKET);
				}, 2000)
			}, 2000);
			view.getTween(dropImage.attrs).to({
				x: x2,
				y: y2
			}, time).call(function () {
				pitcherBottomImage.show();
				view.getTween(waterRect.attrs).to({ height: waterRect.getHeight() - levelHeight }, 1000);
				view.getTween(dropImage.attrs).to({ alpha: 0 }, 1000).wait(1000).call(function () {
					dropImage.hide();
					if (msg.callback != undefined)
						msg.callback();
				});
			});
		});
	})(this);
};
