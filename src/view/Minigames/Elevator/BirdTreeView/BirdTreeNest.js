/**
 * Create a bird tree nest.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - number of the branch, default 0
 *		{Boolean} facingRight - if the bird should face right, default true
 * @return The bird tree nest as a Kinetic.group.
 */
MW.BirdTreeNest = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.number === undefined) config.number = 0;
	if (config.facingRight === undefined) config.facingRight = true;
	var group,
		nest;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y,
	});
	nest = new Kinetic.Rect({
		width: 30,
		height: 10,
		fill: MW.BirdColorGet(config.number)
	});
	group.add(nest);
	
	
	/**
	* @public
	* @returns {Number} The width of the bird tree nest.
	*/
	group.getWidth = function () {
		return nest.getWidth();
	};
	
	/**
	* @public
	* @returns {Number} The height of the bird tree nest.
	*/
	group.getHeight = function () {
		return nest.getHeight();
	};
	
	
	return group;
};
