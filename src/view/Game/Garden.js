/**
 * @constructor
 * @extends {ViewModule}
 */
MW.GardenView = function () {
	ViewModule.call(this);
	var
		view = this,
		sadBackground,
		happyBackground,
		layer,
		setVerdure;
	view.addSetup(function () {
		sadBackground = new Kinetic.Image({
			image: MW.Images.GARDEN_SAD_BG
		});
		happyBackground = new Kinetic.Image({
			image: MW.Images.GARDEN_BG
		});
		layer = new Kinetic.Layer();
		view.getStage().add(layer);
		layer.add(sadBackground);
	});
	view.addTearDown(function () {
		view.getStage().remove(layer);
	});

	/**
	 * Make the garden look like last time it was visited, before adding more
	 * water.
	 */
	setVerdure = function () {
		var verdure = view.game.getGardenVerdure();
		console.log("set verdure", verdure);
	};

	view.on(MW.Event.FRAME, function (msg) {
		layer.draw();
	});
	view.on("Game.demonstrateGarden", function (msg) {
		MW.Sound.play(MW.Sounds.INTRO_GARDEN_1);
		happyBackground.setAlpha(0);
		layer.add(sadBackground);
		layer.add(happyBackground);
		setTimeout(function () {
			MW.Sound.play(MW.Sounds.INTRO_GARDEN_2);
			view.getTween(sadBackground.attrs).to({ alpha: 0 }, 2000);
			view.getTween(happyBackground.attrs).to({ alpha: 1 }, 2000).wait(3000).call(msg.callback);
		}, 3000);
	});
	view.on("Game.waterGarden", function (msg) {
		console.log("water garden");
		setVerdure();
		setTimeout(function () {
			msg.callback();
		}, 3000);
	});
};
