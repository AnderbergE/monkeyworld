/**
 * @extends {Kinetic.Node}
 * @constructor
 */
Kinetic.MW.Lizard = function (config) {
	var group = new Kinetic.Group(config);
	
	var image = new Kinetic.Image({
		image: MW.Images.TREEGAME_LIZARD_STANDING,
		width: MW.Images.TREEGAME_LIZARD_STANDING.width,
		height: MW.Images.TREEGAME_LIZARD_STANDING.height
	});
	
	return group;
};