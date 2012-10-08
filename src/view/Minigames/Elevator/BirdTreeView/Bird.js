/**
 * Create a bird.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - number of the bird, default 0
 * @return The bird as a Kinetic.group.
 */
MW.Bird = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.number === undefined) config.number = 0;
	var group,
		bird;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y
	});
	bird = new Kinetic.Rect({
		width: 50,
		height: 30,
		fill: config.number == 1 ? 'green' :
			config.number == 2 ? 'darkslategray' :
			config.number == 3 ? 'lightseagreen' :
			config.number == 4 ? 'indigo' : 'greenyellow'
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
	
	
	return group;
};
