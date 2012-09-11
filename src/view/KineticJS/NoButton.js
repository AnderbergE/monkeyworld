/**
 * @extends {Kinetic.Node}
 * @param {MW.ViewModule} view
 * @param {Object} config
 * @constructor
 */
Kinetic.MW.NoButton = function (view, config) {
	var started = false;
	config.image = MW.Images.BUTTON_NO_SPRITE;
	config.width = 208;
	config.height = 208;
	config.offset = {
		x: 104,
		y: 104
	};
	config.animations = {
		"shake": [
			{ x: 0, y: 0, width: 208, height: 208 },    // 1 middle
			{ x: 0, y: 258, width: 208, height: 208 },  // 2 left1
			{ x: 0, y: 516, width: 208, height: 208 },  // 3 left2
			{ x: 0, y: 258, width: 208, height: 208 },  // 2 left1
			{ x: 0, y: 0, width: 208, height: 208 },    // 1 middle
			{ x: 0, y: 1032, width: 208, height: 208 }, // 5 right1
			{ x: 0, y: 1290, width: 208, height: 208 }, // 6 right2
			{ x: 0, y: 1032, width: 208, height: 208 }, // 5 right1
			{ x: 0, y: 0, width: 208, height: 208 },    // 1 middle
			{ x: 0, y: 258, width: 208, height: 208 },  // 2 left1
			{ x: 0, y: 516, width: 208, height: 208 },  // 3 left2
			{ x: 0, y: 258, width: 208, height: 208 },  // 2 left1
			{ x: 0, y: 0, width: 208, height: 208 },    // 1 middle
			{ x: 0, y: 1032, width: 208, height: 208 }, // 5 right1
			{ x: 0, y: 1290, width: 208, height: 208 }, // 6 right2
			{ x: 0, y: 1032, width: 208, height: 208 }  // 5 right1
		],
		"idle": [
			{ x: 0, y: 0, width: 208, height: 208 }    // 1 middle
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

