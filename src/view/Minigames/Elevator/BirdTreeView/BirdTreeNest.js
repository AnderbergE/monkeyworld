/**
 * @constructor
 * @extends {Kinetic.Group}
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 *		{Boolean} facingRight - if the bird should face right, default true
 */
MW.BirdTreeNest = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
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
		fill: config.facingRight ? 'purple' : 'yellow'
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
