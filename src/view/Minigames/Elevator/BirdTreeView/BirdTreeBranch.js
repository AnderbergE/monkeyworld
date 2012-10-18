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
		nest;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y
	});
	
	/* Add branch */
	var branchVariant = config.number > 8 ? 4 : Math.floor((Math.random()*3))+1;
	branch = new Kinetic.Image({
		image: eval('MW.Images.ELEVATORGAME_TREE_BRANCH_' + (config.isRight ?
			'RIGHT' : 'LEFT') + '_' + branchVariant)
	});
	group.add(branch);
	
	/* Add nest */
	nest = new MW.BirdTreeNest({
		x: (config.isRight ? 60 : 40) + Math.floor(Math.random()*20),
		number: config.number,
		facingRight: !config.isRight
	});
	nest.setY(branch.getHeight() / 2 - nest.getHeight() +
		(branchVariant == 2 ? 10 : 0) +
		(branchVariant == 4 ? -7 : 0));
	group.add(nest);
	
	
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
		return branch.getHeight();
	};
	
	/**
	* @public
	* @returns {Boolean}
	*/
	group.isRight = function () {
		return config.isRight;
	}
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getNest = function () {
		return nest;
	}
	
	
	return group;
};
