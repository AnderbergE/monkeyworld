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
			panda;
		
		group = new Kinetic.Group({
			x: config.x,
			y: config.y
		});
		
		panda = new Kinetic.Image({
			width: 143,
			height: 211,
			image: MW.Images.ELEVATORGAME_AGENT_PANDA
		});
		group.add(panda)
		
		
		this.getGraphics = function () {
			return group;
		};
		
		this.transitionTo = function (config) {
			group.transitionTo(config);
		};
	}
});