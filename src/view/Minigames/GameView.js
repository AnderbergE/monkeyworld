/**
 * @constructor
 * @extends {ViewModule}
 * @param {string} tag
 */
function GameView(tag) {
	ViewModule.call(this, tag);
	/** @type {GameView}      */ var view  = this;
	/** @type {Kinetic.Layer} */ var layer = view.stage._gameLayer;
	/**
	 * Show the current backend score of a mini game.
	 * @param {GameView} view
	 */
	(function (view) {
		/** @const */
		var label = "Backend Score (current mode):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 16,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 500,
			y: 15
		});
		layer.add(text);		
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MODE, function(msg) {
			text.setText(label + " " + msg.backendScore);
		});
		view.addTearDown(function() {
			layer.remove(text);
		});
	})(this);

	/**
	 * Show the pitcher
	 */
	(function (view) {
		var pitcherImage = new Kinetic.Image({
			image: MW.Images.PITCHER,
			x: layer.getStage().getWidth() - MW.Images.PITCHER.width - 20,
			y: layer.getStage().getHeight() - MW.Images.PITCHER.height - 100,
			width: MW.Images.PITCHER.width,
			height: MW.Images.PITCHER.height
		});
		var cloudImage = new Kinetic.Image({
			image: MW.Images.CLOUD,
			x: - MW.Images.CLOUD.width,
			y: 20,
			width: MW.Images.CLOUD.width,
			height: MW.Images.CLOUD.height
		});
		var dropImage = new Kinetic.Image({
			image: MW.Images.WATERDROP,
			centerOffset: {
				x: MW.Images.WATERDROP.width / 2,
				y: 0
			},
			width: MW.Images.WATERDROP.width,
			height: MW.Images.WATERDROP.height,
			visible: false
		});
		var pitcherBottomImage = new Kinetic.Image({
			image: MW.Images.PITCHER_BOTTOM,
			x: pitcherImage.getX(),
			y: pitcherImage.getY(),
			width: MW.Images.PITCHER_BOTTOM.width,
			height: MW.Images.PITCHER_BOTTOM.height,
			visible: false
		});
		var waterRect = new Kinetic.Rect({
			fill: "#379de4",
			x: pitcherImage.getX() + 20,
			y: pitcherImage.getY() + pitcherImage.getHeight() - 4,
			width: 54,
			height: 0
		});
		layer.add(dropImage);
		layer.add(waterRect);
		layer.add(pitcherBottomImage);
		layer.add(pitcherImage);
		layer.add(cloudImage);
		view.addTearDown(function() {
			layer.remove(pitcherImage);
		})
		view.on(MW.Event.PITCHER_LEVEL_ADD, function(msg) {
			Log.debug("Setting pitcher level: " + msg.level);
			view.getTween(cloudImage.attrs).to({ x: pitcherImage.getX() - 19 }, 4000).wait(2000).call(function () {
				function fillFunction (fillsLeft) {
					var dropStartY = cloudImage.getY() + cloudImage.getHeight() - MW.Images.WATERDROP.height;
					dropImage.setX(cloudImage.getX() + cloudImage.getWidth() / 2);
					dropImage.setY(dropStartY);
					dropImage.setAlpha(1);
					dropImage.show();
					view.getTween(dropImage.attrs).to({ y: pitcherImage.getY() + pitcherImage.getHeight() - dropImage.getHeight() }, 3000).call(function () {
						pitcherBottomImage.show();
						view.getTween(waterRect.attrs).to({ height: waterRect.getHeight() - 10 }, 1000);
						view.getTween(dropImage.attrs).to({ alpha: 0 }, 1000).wait(1000).call(function () {
							if (fillsLeft > 0)
								fillFunction(fillsLeft - 1);
							else {
								view.getTween(cloudImage.attrs).to({ x: view.getStage().getWidth() }, 1000).to({ x: - MW.Images.CLOUD.width });
								dropImage.hide();
							}
						});
					});
				};
				fillFunction(msg.level - 1);
			});
		});
	})(this);
}
