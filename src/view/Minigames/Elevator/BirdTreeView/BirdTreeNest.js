/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {Kinect.Stage} stage
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 *		{Boolean} facingRight - if the bird should face right, default true
 */
MW.BirdTreeNest = MW.ViewModule.extend(
/** @lends {MW.BirdTreeNest.prototype} */
{
	/** @constructs */
	init: function (stage, config) {
		this._super(stage, "BirdTreeNest");
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.facingRight === undefined) config.facingRight = true;
		var
			nestGraphics,
			group = new Kinetic.Group();
		
		nestGraphics = new Kinetic.Rect({
			x: config.x,
			y: config.y,
			width: 30,
			height: 10,
			fill: config.facingRight ? 'purple' : 'yellow'
		});
		group.add(nestGraphics);
		
		
		/**
		* @public
		* @returns {Number}
		*/
		this.getWidth = function () {
			return nestGraphics.getWidth();
		}
		
		/**
		* @public
		* @returns {Number}
		*/
		this.getHeight = function () {
			return nestGraphics.getHeight();
		}
		
		/**
		* @public
		* @returns {Kinect.Group} The group with all the nest graphics.
		*/
		this.getGraphics = function () {
			return group;
		}
	}
});
