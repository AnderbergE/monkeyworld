/**
 * @extends {Kinetic.Node}
 * @constructor
 * @param {Object} config
 * @param {ViewModule} view
 */
Kinetic.MW.Lizard = function (config, view) {
	var
		group = new Kinetic.Group(config),
		image,
		walkInterval,
		walkTimeout;
	
	var image = new Kinetic.Image({
		image: MW.Images.TREEGAME_LIZARD_STANDING,
		width: MW.Images.TREEGAME_LIZARD_STANDING.width,
		height: MW.Images.TREEGAME_LIZARD_STANDING.height
	});
	
	group.add(image);
	
	group.startWalk = function () {
		var INTERVAL = 400;
		image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP2;
		walkInterval = view.setInterval(function () {
			image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP1;
			walkTimeout = view.setTimeout(function () {
				image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP2;	
			}, INTERVAL / 2);
		}, INTERVAL);
	};
	
	group.stopWalk = function () {
		view.clearInterval(walkInterval);
		view.clearTimeout(walkTimeout);
		image.attrs.image = MW.Images.TREEGAME_LIZARD_STANDING;
	};
	
	return group;
};