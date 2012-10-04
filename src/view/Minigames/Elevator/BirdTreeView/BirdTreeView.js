/**
 * @constructor
 * @extends {MW.ElevatorView}
 * @param {MW.ElevatorMinigame} elevatorMinigame
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentView} agentView
 */
MW.BirdTreeView = MW.ElevatorView.extend(
/** @lends {MW.BirdTreeView.prototype} */
{
	/** @constructs */
	init: function (elevatorMinigame, stage, agentView) {
		this._super(elevatorMinigame, stage, agentView, "BirdTreeView");
		var layer,
			nbrOfBranches = 5,
			numpanel;

		layer = new Kinetic.Layer()
		
		/* Add background */
		layer.add(new Kinetic.Rect({
			x: 0,
			y: 0,
			width: stage.getWidth(),
			height: stage.getHeight(),
			fill: 'cyan'
		}));

		/* Create the tree */
		layer.add(this.buildTree({
			x: 600,
			y: 100,
			branches: nbrOfBranches
		}));
		
		/* Add the panel with buttons */
		numpanel = new MW.Numpanel({
			height: 75,
			nbrOfButtons: nbrOfBranches,
			buttonScale: 0.9,
			buttonPushed: function () {
				layer.draw();
			}
		});
		numpanel.setX((stage.getWidth() / 2) - (numpanel.getWidth() / 2));
		numpanel.setY(stage.getHeight() - numpanel.getHeight() - 10);
		layer.add(numpanel);

		/* Add the layer and draw it */
		stage.add(layer);
		layer.draw();
		
		
		this.addTearDown(function () {
			stage.remove(layer);
		});
	},
	
	/**
	 * Builds a tree.
	 * @private
	 * @param {Kinetic.Stage} Stage needed to setup objects. 
	 * @param {Hash} config:
	 *		{Number} x - x position, default 0
	 *		{Number} y - y position, default 0
	 *		{Number} height - height that the branches will take up, default 500.
	 *		{Number} branches - branches on the tree, default 5.
	 * @returns {Kinetic.Group} The group with all the branches.
	 */
	buildTree: function (config) {
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.height === undefined) config.height = 500;
		if (config.branches === undefined) config.branches = 5;
		var group,
			branch,
			spaceBetween;
		
		group = new Kinetic.Group({
				x: config.x,
				y: config.y
		});
		branch = new MW.BirdTreeBranch({
				number: 1,
				isRight: false
		});
		group.add(branch);
		
		spaceBetween =
			(config.height - config.branches * branch.getHeight()) / config.branches;
		
		for (var i = 2; i <= config.branches; i++) {
			branch = new MW.BirdTreeBranch({
				/* The branch that goes right is put more to the right. */
				x: i % 2 == 0 ? (3 * branch.getWidth()) / 5 : 0,
				y: branch.getY() + branch.getHeight() + spaceBetween,
				number: i,
				isRight: i % 2 == 0 ? true : false
			});
			group.add(branch);
		}
		
		return group;
	}
});