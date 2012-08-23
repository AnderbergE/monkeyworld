/**
 * @extends {Kinetic.Node}
 * @param {ViewModule} view
 * @param {Object} config
 * @constructor
 */
Kinetic.MW.YesButton = function (view, config) {
	config.image = MW.Images.BUTTON_YES_1;
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
		.to({ image: MW.Images.BUTTON_YES_2 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_3 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_4 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_3 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_2 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_1 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_2 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_3 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_4 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_3 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_2 }).wait(interval)
		.to({ image: MW.Images.BUTTON_YES_1 }).wait(interval);
	}
	image.animate = this.animate;
	return image;
};
