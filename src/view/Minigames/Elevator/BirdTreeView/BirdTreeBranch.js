/**
 * @constructor
 * @extends {Kinetic.Group}
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - the branches number, default 0
 *		{Boolean} isRight - if the branch should sprout right, default true
 */
MW.BirdTreeBranch = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.number === undefined) config.number = 0;
	if (config.isRight === undefined) config.isRight = true;
	var group,
		branchGraphics,
		direction = config.isRight ? 1 : 0;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y
	});
		
	nest = new MW.BirdTreeNest({
		facingRight: !config.isRight
	});
	
	branchGraphics = new Kinetic.Rect({
		width: 150,
		height: 30,
		fill: 'brown'
	});
	branchGraphics.setY(nest.getHeight());
	
	nest.setX(
		direction*(branchGraphics.getWidth()-nest.getWidth())
	);
	
	group.add(nest);
	group.add(branchGraphics);
	
	
	/**
	* Add getWidth function to group.
	* @public
	* @returns {Number}
	*/
	group.getWidth = function () {
		return branchGraphics.getWidth();
	}
	
	/**
	* Add getHeight function to group.
	* @public
	* @returns {Number}
	*/
	group.getHeight = function () {
		return branchGraphics.getHeight();
	}
	
	
	return group;
};
