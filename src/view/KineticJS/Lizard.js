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

	image = new Kinetic.Image({
		image: MW.Images.TREEGAME_LIZARD_STANDING,
		width: MW.Images.TREEGAME_LIZARD_STANDING.width,
		height: MW.Images.TREEGAME_LIZARD_STANDING.height
	});
	
	group.add(image);
	
	this.startWalk = function () {
		var INTERVAL = 280;
		image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP2;
		walkInterval = view.setInterval(function () {
			image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP1;
			walkTimeout = view.setTimeout(function () {
				image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP2;	
			}, INTERVAL / 2);
		}, INTERVAL);
	};
	
	this.stopWalk = function () {
		view.clearInterval(walkInterval);
		view.clearTimeout(walkTimeout);
		image.attrs.image = MW.Images.TREEGAME_LIZARD_STANDING;
	};
	
	group.startWalk = this.startWalk;
	group.stopWalk = this.stopWalk;
	return group;
};
