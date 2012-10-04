/**
 * @constructor
 * @extends {Kinetic.Group}
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - number of the button, default 0
 * 		{Number} radius - radius of the button, default 25
 */
MW.Button = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.number === undefined) config.number = 0;
	if (config.radius === undefined) config.radius = 25;
	var group,
		circle;
		
	group = new Kinetic.Group({
			x: config.x + config.radius,
			y: config.y
	});
		
	circle = new Kinetic.Circle({
		radius: config.radius,
		fill: 'blue' 
	})
	
	group.add(circle);
	
	
	return group;
};
