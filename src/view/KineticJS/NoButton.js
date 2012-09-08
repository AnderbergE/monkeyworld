/**
 * @extends {Kinetic.Node}
 * @param {MW.ViewModule} view
 * @param {Object} config
 * @constructor
 */
Kinetic.MW.NoButton = function (view, config) {
	config.image = MW.Images.BUTTON_NO_1;
	config.width = 128;
	config.height = 128;
	config.offset = {
		x: 64,
		y: 64
	};
	var image = new Kinetic.Image(config);
	this.animate = function () {
		var interval = 300;
		view.getTween(image.attrs)
		.to({ image: MW.Images.BUTTON_NO_2 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_3 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_4 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_1 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_5 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_6 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_7 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_1 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_2 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_3 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_4 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_1 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_5 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_6 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_7 }).wait(interval)
		.to({ image: MW.Images.BUTTON_NO_1 }).wait(interval);
	}
	image.animate = this.animate;
	return image;
};
