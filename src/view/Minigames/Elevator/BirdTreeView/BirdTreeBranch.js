/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {Kinect.Stage} stage
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - the branches number, default 0
 *		{Boolean} isRight - if the branch should sprout right, default true
 */
MW.BirdTreeBranch = MW.ViewModule.extend(
/** @lends {MW.BirdTreeBranch.prototype} */
{
	/** @constructs */
	init: function (stage, config) {
		this._super(stage, "BirdTreeBranch");
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.number === undefined) config.number = 0;
		if (config.isRight === undefined) config.isRight = true;
		var
			branchGraphics,
			group = new Kinetic.Group({
				x: config.x,
				y: config.y
			});
			direction = config.isRight ? 1 : 0;
		
		nest = new MW.BirdTreeNest(stage, {
			x: 0,
			y: 0,
			facingRight: !config.isRight
		});
		
		branchGraphics = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: 150,
			height: 30,
			fill: 'brown'
		});
		branchGraphics.setY(nest.getHeight());
		
		nest.getGraphics().setX(
			direction*(branchGraphics.getWidth()-nest.getWidth())
		);
		
		group.add(nest.getGraphics());
		group.add(branchGraphics);
		
		
		/**
		* @public
		* @returns {Number}
		*/
		this.getWidth = function () {
			return branchGraphics.getWidth();
		}
		
		/**
		* @public
		* @returns {Number}
		*/
		this.getHeight = function () {
			return branchGraphics.getHeight();
		}
		
		/**
		* @public
		* @returns {Kinect.Group} The group with all the branch graphics.
		*/
		this.getGraphics = function () {
			return group;
		}
	}
});
