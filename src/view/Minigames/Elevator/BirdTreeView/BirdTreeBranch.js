/**
 * Create a bird tree branch.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - the branches number, default 0
 *		{Boolean} isRight - if the branch should sprout right, default true
 * @return The bird tree branch as a Kinetic.group.
 */
MW.BirdTreeBranch = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.number === undefined) config.number = 0;
	if (config.isRight === undefined) config.isRight = true;
	var group,
		branch,
		nest,
		direction = config.isRight ? 1 : 0;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y
	});
	
	/* Add nest */
	nest = new MW.BirdTreeNest({
		number: config.number,
		facingRight: !config.isRight
	});
	
	branch = new Kinetic.Rect({
		y: nest.getHeight(),
		width: 150,
		height: 30,
		fill: 'brown'
	});
	
	nest.setX(
		direction * (branch.getWidth() - nest.getWidth())
	);
	
	group.add(nest);
	group.add(branch);
	
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getWidth = function () {
		return branch.getWidth();
	};
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getHeight = function () {
		return branch.getHeight() + nest.getHeight();
	};
	
	group.isRight = function () {
		return config.isRight;
	}
	
	group.getNestX = function () {
		return nest.getX();
	}
	
	
	return group;
};
