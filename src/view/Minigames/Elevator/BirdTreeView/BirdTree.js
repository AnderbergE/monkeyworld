/**
 * Create a bird tree.
 * X coordinate 0 is the center of the tree.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} nbrOfBranches - the number of branches, default 5
 *		{Function} drawScene - function that redraws the scene, default empty.
 * @return The bird tree as a Kinetic.group.
 */
MW.BirdTree = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.nbrOfBranches === undefined) config.nbrOfBranches = 5;
	if (config.drawScene === undefined) config.drawScene = function () {};
	var group, 
		bole;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y
	});
	
	/* Create the branches */
	buildTree(group, {
			offsetFromTop: 100,
			height: MW.Images.ELEVATORGAME_TREE_BOLE.height - 200,
			branches: config.nbrOfBranches,
			drawScene: config.drawScene
	});
	
	/* Add the tree bole */
	bole = new Kinetic.Image({
		x: -220,
		image: MW.Images.ELEVATORGAME_TREE_BOLE
	});
	group.add(bole);
	
	
	/**
	* @public
	* @returns {Number}
	*/
	group.getHeight = function () {
		return bole.getHeight();
	};
	
	/**
	* @public
	* @returns {Number} - the number of branches in the tree
	*/
	group.getNbrOfBranches = function () {
		return config.nbrOfBranches;
	};
	
	/**
	* @public
	* @param {Number} number - the branch number
	* @returns {Kinetic.Group} - the branch is returned
	*/
	group.getBranch = function (number) {
		return group.getChildren()[config.nbrOfBranches - number];
	};
	
	
	return group;
};

/**
 * Builds a tree.
 * @private
 * @param {Hash} config:
 *		{Number} offsetFromTop - the offset from the top of the tree, default 0.
 *		{Number} height - height that the branches will take up, default 500.
 *		{Number} branches - branches on the tree, default 5.
 *		{Function} drawScene - function that redraws the scene, default empty.
 * @returns {Kinetic.Group} The group with all the branches.
 */
function buildTree (group, config) {
	if (config.offsetFromTop === undefined) config.offsetFromTop = 0;
	if (config.height === undefined) config.height = 500;
	if (config.branches === undefined) config.branches = 5;
	var group,
		branch,
		spaceBetween,
		branchList = new Array();
	
	branch = new MW.BirdTreeBranch({
			y: config.offsetFromTop,
			number: config.branches,
			isRight: false,
			drawScene: config.drawScene
	});
	/* Branch that goes left is put to the left. */
	branch.setX(-branch.getWidth());
	group.add(branch);
	
	/* Create the branches. */
	for (var i = 1; i < config.branches; i++) {
		branch = new MW.BirdTreeBranch({
			y: branch.getY() + config.height / config.branches,
			number: config.branches - i,
			isRight: i % 2 != 0 ? true : false ,
			drawScene: config.drawScene
		});
		branch.setX(i % 2 != 0 ? 0 : -branch.getWidth());
		group.add(branch);
	}
	
	return group;
}