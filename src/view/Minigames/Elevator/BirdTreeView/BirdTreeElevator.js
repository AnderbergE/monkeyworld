/**
 * Create a bird tree elevator.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * @return The bird tree elevator as a Kinetic.group.
 */
MW.BirdTreeElevator = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	var group,
		elevator;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y,
	});
	
	/* Add the elevator. */
	elevator = new Kinetic.Rect({
		width: 50,
		height: 40,
		fill: 'hotpink'
	});
	group.add(elevator);
	
	
	/**
	* @public
	* @returns {Number} The width of the bird tree nest.
	*/
	group.getWidth = function () {
		return elevator.getWidth();
	};
	
	/**
	* @public
	* @returns {Number} The height of the bird tree nest.
	*/
	group.getHeight = function () {
		return elevator.getHeight();
	};
	
	
	return group;
};
