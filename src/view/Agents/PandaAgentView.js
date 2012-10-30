/**
 * Create a bird.
 * @extends {MW.GlobalObject}
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 */
MW.PandaAgentView = MW.GlobalObject.extend(
{
	init: function (config) {
		this._super('PandaAgentView');
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		var group,
			panda,
			animation;
		
		group = new Kinetic.Group({
			x: config.x,
			y: config.y,
			scale: {x: 0.25, y: 0.25}
		});
		
		panda = new Kinetic.Image({
			image: MW.Images.ELEVATORGAME_AGENT_PANDA
		});
		group.add(panda)
		
		
		/**
		 * Walk with left foot.
		 * @private
		 */
		function walkLeft () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WALK_LEFT);
			animation = setTimeout(walkRight, 150);
		}
		
		/**
		 * Walk with right foot.
		 * @private
		 */
		function walkRight () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WALK_RIGHT);
			animation = setTimeout(walkLeft, 150);
		}
		
		/**
		 * Wave.
		 * @private
		 */
		function waveUp () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA_WAVE);
			animation = setTimeout(waveDown, 150);
		}
		
		/**
		 * Don't wave.
		 * @private
		 */
		function waveDown () {
			MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			animation = setTimeout(waveUp, 150);
		}
		
		
		/**
		 * @public
		 * @return {Kinetic.Group}
		 */
		this.getGraphics = function () {
			return group;
		};
		
		/**
		 * @public
		 * @param {Hash} config - config for a Kinetic transition.
		 */
		this.transitionTo = function (config) {
			group.transitionTo(config);
		};
		
		/**
		 * @public
		 * @param {Boolean} walk - true if the bird should walk.
		 */
		this.walk = function (walk) {
			clearTimeout(animation);
			if (walk) {
				walkLeft();
			} else {
				MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			}
		}
		
		/**
		 * @public
		 * @param {Boolean} wave - true if the bird should wave.
		 */
		this.wave = function (wave) {
			clearTimeout(animation);
			if (wave) {
				waveUp();
			} else {
				MW.SetImage(panda, MW.Images.ELEVATORGAME_AGENT_PANDA);
			}
		}
	}
});