/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {Kinetic.Stage} stage
 * @param {MW.Game} game
 */
MW.GardenView = MW.ViewModule.extend(
/** @lends {MW.GardenView.prototype} */
{
	/** @constructs */
	init: function (stage, game) {
		this._super(stage, "GardenView");
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
				offset: {
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
				offset: {
					x: MW.Images.PITCHER.width / 2,
					y: MW.Images.PITCHER.height / 2
				},
				fill: "blue"
			});
			layer = new Kinetic.Layer();
			stage.add(layer);
			layer.add(sadBackground);
			layer.add(pitcherGroup);
			pitcherGroup.add(waterPolygon);
			pitcherGroup.add(pitcherImage);
		});
		view.addTearDown(function () {
			stage.remove(layer);
		});

		/**
		 * Make the garden look like last time it was visited, before adding more
		 * water.
		 */
		setVerdure = function () {
			var verdure = game.getGardenVerdure();
		};

		view.on(MW.Event.FRAME, function (msg) {
			layer.draw();
		});

		view.on("Game.demonstrateGarden", function (msg) {
			MW.Sound.play(MW.Sounds.INTRO_GARDEN_1);
			happyBackground.setOpacity(0);
			layer.add(sadBackground);
			layer.add(happyBackground);
			var skipButton = new Kinetic.Group({ x: 10, y: 10 });
		
			var skipRect = new Kinetic.Rect({
				width: 100,
				height: 30,
				fill: "gray"
			});
		
			var skipText = new Kinetic.Text({
				text: "Skip",
				width: 100,
				height: 30,
				y: 10,
				align: "center",
				fontFamily: "Arial",
				textFill: "black"
			});

			skipButton.add(skipRect);
			skipButton.add(skipText);
		
			skipButton.on("mousedown touchstart", function () {
				msg.callback();
			});

			layer.add(skipButton);
		
			view.setTimeout(function () {
				MW.Sound.play(MW.Sounds.INTRO_GARDEN_2);
				sadBackground.transitionTo({
					opacity: 0,
					duration: 2
				});
				happyBackground.transitionTo({
					opacity: 1,
					duration: 2,
					callback: function () {
						view.setTimeout(function () {
							msg.callback();
						}, 2000);
					}
				});
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
			pitcherImage.setRotation(Math.PI / 3);
			pitcherGroup.show();

			/*
			 * TODO: Redo this animation with transitionTo when KineticJS has
			 *       resolved the bug which seems to have appeared in recursive
			 *       transitions. (Using Kinetic v4.0.1 when writing this.)
			 *
			 *       http://goo.gl/GzzV2
			 */
			setTimeout(function () {
				view.getTween(waterPolygon.attrs.points[0])
				.to({ x: (newY - m1) / k1, y: newY }, 3000);
				view.getTween(waterPolygon.attrs.points[1])
				.to({ x: (newY - m2) / k2, y: newY }, 3000).call(function () {
					var k3 = (p[3].y - p[4].y) / (p[3].x - p[4].x);
					var m3 = p[3].y - k3 * p[3].x;
					newY += p[3].y - p[2].y;
					view.getTween(waterPolygon.attrs.points[0])
					.to({ x: (newY - m3) / k3, y: newY }, 3000);
					view.getTween(waterPolygon.attrs.points[1])
					.to({ x: (newY - m2) / k2, y: newY }, 3000).call(function () {
						newY += p[3].y - p[2].y;
						var k4 = (p[2].y - p[3].y) / (p[2].x - p[3].x);
						var m4 = p[2].y - k4 * p[2].x;
						view.getTween(waterPolygon.attrs.points[0])
						.to({ x: (newY - m3) / k3, y: newY }, 2000);
						view.getTween(waterPolygon.attrs.points[1])
						.to({ x: (newY - m3) / k3, y: newY }, 2000).call(function () {
							view.setTimeout(function () {
								msg.callback();
							}, 3000);
						});
					});
				});
			}, 2000);
		});
	}
});

