/**
 * Create a bird tree.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 *		{Number} height - height that the branches will take up, default 500
 * 		{Number} nbrOfBranches - the number of branches, default 5
 * @return The bird tree as a Kinetic.group.
 */
MW.BirdTree = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.height === undefined) config.height = 500;
	if (config.nbrOfBranches === undefined) config.nbrOfBranches = 5;
	var group;
	
	/* Create the tree */
	group = buildTree({
			x: config.x,
			y: config.y,
			height: config.height,
			branches: config.nbrOfBranches
	});
	
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getWidth = function () {
		return (group.getChildren()[1].getX() +
			group.getChildren()[1].getWidth()) - group.getChildren()[0].getX();
	};
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getHeight = function () {
		return config.height;
	};
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getBranchY = function (i) {
		return group.getChildren()[i-1].getY();
	};
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getBranchOverlap = function () {
		return group.getChildren()[0].getX() - group.getChildren()[1].getX();
	};
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getNbrOfBranches = function () {
		return group.getChildren().length;
	};
	
	
	return group;
};

/**
 * Builds a tree.
 * @private
 * @param {Hash} config:
 *		{Number} x - x position, default 0
 *		{Number} y - y position, default 0
 *		{Number} height - height that the branches will take up, default 500.
 *		{Number} branches - branches on the tree, default 5.
 * @returns {Kinetic.Group} The group with all the branches.
 */
function buildTree (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.height === undefined) config.height = 500;
	if (config.branches === undefined) config.branches = 5;
	var group,
		branch,
		spaceBetween,
		branchList = new Array();
	
	branch = new MW.BirdTreeBranch({
			number: config.branches,
			isRight: false
	});
	branchList.push(branch);
	
	spaceBetween =
		(config.height - config.branches * branch.getHeight()) / config.branches;
	
	for (var i = 1; i < config.branches; i++) {
		branch = new MW.BirdTreeBranch({
			/* The branch that goes right is put more to the right. */
			x: i % 2 == 0 ? 0 : (3 * branch.getWidth()) / 5,
			y: branch.getY() + branch.getHeight() + spaceBetween,
			number: config.branches - i,
			isRight: i % 2 == 0 ? false : true 
		});
		branchList.push(branch);
	}
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y
	});
	/* Put the branches in branch number order. */
	for (var i = branchList.length; i > 0; i--) {
		group.add(branchList[i-1]);
	}
	
	return group;
}