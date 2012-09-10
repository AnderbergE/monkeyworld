/**
 * @constructor
 * @extends {MW.ViewModule}
 */
MW.MinigameHandlerView = function () {
	MW.ViewModule.call(this, "MinigameHandlerView");
	/** @type {MW.MinigameHandlerView} */ var view = this;
	/** @type {Kinetic.Stage}          */ var stage = view.stage;
	/** @type {Kinetic.Layer}          */ var layer = stage.getDynamicLayer();
	/**
	 * Show the current total backend score of the minigame.
	 * @param {MW.MinigameHandlerView} view
	 */
	(function (view) {
		/** @const @type {string} */ var label = "Backend Score (current minigame):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 12,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 700,
			y: 35
		});
		var on = false;
		var running = false;
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MINIGAME, function(msg) {
			text.setText(label + " " + msg.score);
		});
		view.addSetup(function () {
			on = true;
			running = true;
			layer.add(text);
		});
		view.on(MW.Event.TRIGGER_SCORE, function () {
			if (running && !on) {
				layer.add(text);
				on = true;
				console.info("Turning off backend score display");
			} else if (running && on) {
				layer.remove(text);
				on = false;
				console.info("Turning on backend score display");
			}
		});
		view.addTearDown(function() {
			running = false;
			if (on) {
				layer.remove(text);
			}
			on = false;
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
			fontSize: 12,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 700,
			y: 55
		});
		var on = false, running = false;
		view.addSetup(function () {
			layer.add(text);
			running = true;
			on = true;
		});
		view.on(MW.Event.LEARNING_TRACK_UPDATE, function(msg) {
			text.setText(label + " " + msg.learningTrack.name());
		});
		view.on(MW.Event.TRIGGER_SCORE, function () {
			if (running && !on) {
				layer.add(text);
				on = true;
			} else if (running && on) {
				layer.remove(text);
				on = false;
			}
		});
		view.addTearDown(function() {
			running = false;
			if (on) {
				layer.remove(text);
			}
			on = false;
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
				offset: {
					x: MW.Images.WATERDROP.width / 2,
					y: 0
				},
				width: MW.Images.WATERDROP.width,
				height: MW.Images.WATERDROP.height,
				visible: false,
				rotation: Math.PI
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
		view.addSetup(function () {
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
			var x2 = pitcherImage.getX() + pitcherImage.getWidth() / 2;
			var y2 = pitcherImage.getY() + pitcherImage.getHeight() - dropImage.getHeight();
			var velocity = 200; /* px/s */
			var distance = Math.sqrt(Math.pow(dropOrigin.x - x2, 2) + Math.pow(dropOrigin.y - y2, 2));
			var time = distance / velocity * 1000;
			dropImage.setX(dropOrigin.x);
			dropImage.setY(dropOrigin.y);
			dropImage.setOpacity(1);
			dropImage.show();
			if (view.game.modeIsAgentSee()) {
				MW.Sound.play(MW.Sounds.YAY_HELPED_ME_GET_WATER);
			} else if (view.game.modeIsAgentDo()) {
				MW.Sound.play(MW.Sounds.YAY_HELPED_ME_GET_WATER_DROP_1);
				MW.Sound.play(MW.Sounds.YAY_HELPED_ME_GET_WATER_DROP_2);
				view.setTimeout(function () {
					MW.Sound.play(MW.Sounds.LETS_FILL_THE_BUCKET);
				}, 2000)
			}
			view.getTween(dropImage.attrs)
			.to({
				x: x2 - 50,
				y: y2
			}, time * 1.2)
			.to({
				rotation: 4 * Math.PI / 3,
				x: x2 - 50,
				y: y2 - 30
			}, 300)
			.to({
				rotation: 5 * Math.PI / 3,
				x: x2 - 25,
				y: y2 - 25
			}, 300)
			.to({
				rotation: 6 * Math.PI / 3,
				x: x2,
				y: y2
			}, 300).call(function () {
				MW.Sound.play(MW.Sounds.DRIP);
				pitcherBottomImage.show();
				view.getTween(waterRect.attrs).to({ height: waterRect.getHeight() - levelHeight }, 1000);
				view.getTween(dropImage.attrs).to({ opacity: 0 }, 1000).wait(1000).call(function () {
					dropImage.hide();
					dropImage.setRotation(Math.PI);
					if (msg.callback != undefined)
						msg.callback();
				});
			});
		});
	})(this);
};
