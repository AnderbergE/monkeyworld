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
		var
			view = this,
			layer = new Kinetic.Layer();

		stage.add(layer);
		layer.add(new Kinetic.Rect({
			x: 0,
			y: 0,
			width: stage.getWidth(),
			height: stage.getHeight(),
			fill: 'cyan'
		}));

		layer.add(this.buildTree(stage, {
			x: 100,
			y: 100
		}));

		layer.draw();
		
		view.addTearDown(function () {
			stage.remove(layer);
		});
	},
	
	/**
	 * @private
	 * @param {Kinetic.Stage} Stage needed to setup objects. 
	 * @param {Hash} config:
	 *		{Number} x - x position, default 0
	 *		{Number} y - y position, default 0
	 *		{Number} height - height that the branches will take up, default 500.
	 *		{Number} branches - branches on the tree, default 5.
	 *		{Boolean} isRight - the direction of the branch, default true.
	 * @returns {Kinetic.Group} The group with all the branches.
	 */
	buildTree: function (stage, config) {
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.height === undefined) config.height = 500;
		if (config.branches === undefined) config.branches = 5;
		var
			branch,
			group = new Kinetic.Group({
				x: config.x,
				y: config.y
			}),
			spaceBetween;
		
		branch = new MW.BirdTreeBranch(stage, {
				number: 1,
				isRight: false
		});
		group.add(branch.getGraphics());
		
		spaceBetween =
			(config.height - config.branches * branch.getHeight()) / config.branches;
			
		for (var i = 2; i <= config.branches; i++) {
			branch = new MW.BirdTreeBranch(stage, {
				x: i % 2 == 0 ? (3 * branch.getWidth()) / 5 : 0,
				y: branch.getGraphics().getY() + branch.getHeight() + spaceBetween,
				number: i,
				isRight: i % 2 == 0 ? true : false
			});
			group.add(branch.getGraphics());
		}
		
		return group;
	}
});