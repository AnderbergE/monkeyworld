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
	bird = new Kinetic.Rect({
		width: 50,
		height: 30,
		fill: MW.BirdColorGet(config.number)
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
	* @returns {Number} If the bird is in the elevator.
	*/
	group.inElevator = function () {
		return config.inElevator;
	};
	
	/**
	* @public
	* @param {Boolean} inElevator - set if the bird is in elevator or not.
	*/
	group.setInElevator = function (inElevator) {
		config.inElevator = inElevator;
	}
	
	
	return group;
};
