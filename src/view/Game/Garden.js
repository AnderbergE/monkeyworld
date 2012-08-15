/**
 * @constructor
 * @extends {ViewModule}
 */
MW.GardenView = function () {
	ViewModule.call(this, "GardenView");
	var
		view = this,
		sadBackground,
		happyBackground,
		layer,
		setVerdure,
		pitcherGroup,
		pitcherImage,
		waterPolygon;
	view.addSetup(function () {
		sadBackground = new Kinetic.Image({
			image: MW.Images.GARDEN_SAD_BG
		});
		happyBackground = new Kinetic.Image({
			image: MW.Images.GARDEN_BG
		});
		pitcherGroup = new Kinetic.Group({
			x: 300,
			y: 300,
			visible: false
		});
		pitcherImage = new Kinetic.Image({
			image: MW.Images.PITCHER,
			centerOffset: {
				x: MW.Images.PITCHER.width / 2,
				y: MW.Images.PITCHER.height / 2
			}
		});
		waterPolygon = new Kinetic.Polygon({
		    points: [
				{ x: 40, y: 0 },
				{ x: 60, y: 0 },
				{ x: 80, y: 40 },
				{ x: 41, y: 63 },
				{ x: 15, y: 17 }
		    ],
			centerOffset: {
				x: MW.Images.PITCHER.width / 2,
				y: MW.Images.PITCHER.height / 2
			},
		    fill: "blue"
		});
		layer = new Kinetic.Layer();
		view.getStage().add(layer);
		layer.add(sadBackground);
		layer.add(pitcherGroup);
		pitcherGroup.add(waterPolygon);
		pitcherGroup.add(pitcherImage);
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
	view.on(MW.Event.WATER_GARDEN, function (msg) {
		setVerdure();
		var p = waterPolygon.attrs.points;
		var k1 = (p[0].y - p[4].y) / (p[0].x - p[4].x);
		var k2 = (p[2].y - p[1].y) / (p[2].x - p[1].x);
		var yOffset = 17;
		var newY = p[0].y + yOffset;
		var m1 = p[0].y - k1 * p[0].x;
		var m2 = p[2].y - k2 * p[2].x;
		pitcherGroup.show();
		setTimeout(function () {
			view.getTween(pitcherImage.attrs).to({ rotation: Math.PI / 3 });
			setTimeout(function () {
				waterPolygon.transitionTo({
					points: {
						0: { x: (newY - m1) / k1, y: newY },
						1: { x: (newY - m2) / k2, y: newY }
					},
					duration: 3,
					callback: function () {
					var k3 = (p[3].y - p[4].y) / (p[3].x - p[4].x);
					var m3 = p[3].y - k3 * p[3].x;
					newY += p[3].y - p[2].y;
						waterPolygon.transitionTo({
							points: {
								0: { x: (newY - m3) / k3, y: newY },
								1: { x: (newY - m2) / k2, y: newY }
							},
							duration: 3,
							callback: function () {
								newY += p[3].y - p[2].y;
								var k4 = (p[2].y - p[3].y) / (p[2].x - p[3].x);
								var m4 = p[2].y - k4 * p[2].x;
								waterPolygon.transitionTo({
									points: {
										0: { x: (newY - m3) / k3, y: newY },
										1: { x: (newY - m3) / k3, y: newY }
									},
									duration: 2,
									callback: function () {
										setTimeout(function () {
											msg.callback();
										}, 3000);
									}
								});
							}
						});
					}
				});
			}, 1000);
		}, 1000);
	});
};
