/**
 * @extends {Kinetic.Node}
 * @param {MW.ViewModule} view
 * @param {Object} config
 * @constructor
 */
Kinetic.MW.YesButton = function (view, config) {
	var started = false;
	config.image = MW.Images.BUTTON_YES_SPRITE;
	config.width = 224;
	config.height = 224;
	config.offset = {
		x: 112,
		y: 112
	};
	config.animations = {
		"shake": [
			{ x: 0, y: 0, width: 224, height: 224 },   // 1
			{ x: 0, y: 274, width: 224, height: 224 }, // 2
			{ x: 0, y: 548, width: 224, height: 224 }, // 3
			{ x: 0, y: 274, width: 224, height: 224 }, // 2
			{ x: 0, y: 0, width: 224, height: 224 },   // 1
			{ x: 0, y: 274, width: 224, height: 224 }, // 2
			{ x: 0, y: 548, width: 224, height: 224 }, // 3
			{ x: 0, y: 274, width: 224, height: 224 }  // 2
		],
		"idle": [
			{ x: 0, y: 0, width: 224, height: 224 }    // 1
		]
	};
	config.animation = "idle";
	config.frameRate = 10;
	var image = new Kinetic.Sprite(config);
	this.animate = function () {
		if (!started) {
			image.start();
			started = true;
		}
		image.setAnimation("shake");
		image.afterFrame(config.animations["shake"].length - 1, function () {
			image.setAnimation("idle");
		});
	}
	image.animate = this.animate;
	return image;
};

