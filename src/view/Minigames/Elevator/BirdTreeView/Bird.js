/**
 * Create a bird.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} scale - scale of bird, default 0
 * 		{Number} number - number of the bird, default 0
 * @return The bird as a Kinetic.group.
 */
MW.Bird = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.scale === undefined) config.scale = 1;
	if (config.number === undefined) config.number = 0;
	config.inElevator = false;
	var group,
		bird;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y,
			scale: config.scale
	});
	
	/* Add bird */
	bird = new Kinetic.Image({
		scale: {x: 0.3, y: 0.3},
		image: eval("MW.Images.ELEVATORGAME_CHICK_" + config.number)
	});
	group.add(bird);
	
	
	/**
	 * @public
	 * @returns {Number} The width of the bird tree nest.
	 */
	group.getWidth = function () {
		return bird.getWidth();
	};
	
	/**
	 * @public
	 * @returns {Number} The height of the bird tree nest.
	 */
	group.getHeight = function () {
		return bird.getHeight();
	};
	
	/**
	 * @public
	 * @param {Boolean} show - true if the bird should show its wings.
	 */
	group.showNumber = function (show) {
		/* Change width and height to avoid stretch/squeeze */
		if (show) {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_SHOW_" + config.number));
		} else {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_" + config.number));
		}
	}
	
	
	return group;
};
