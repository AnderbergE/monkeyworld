/**
 * Creates a button.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - number of the button, default 0
 * 		{Number} radius - radius of the button, default 25
 *		{Function} pushed - called when button is pushed, default empty.
 *		{Function} drawScene - function that redraws the scene, default empty.
 * @return The button as a Kinetic.group.
 */
MW.Button = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.number === undefined) config.number = 0;
	if (config.radius === undefined) config.radius = 25;
	if (config.pushed === undefined) config.pushed = function () {};
	if (config.drawScene === undefined) config.drawScene = function () {};
	var group,
		circle;
	
	group = new Kinetic.Group({
			x: config.x + config.radius,
			y: config.y
	});
	
	/* Add button */
	circle = new Kinetic.Circle({
		radius: config.radius
	});
	setAppearance(circle, 'blue');
	group.add(circle);
	
	/* Mouse events */	
	circle.on('mouseover', function () {
		setAppearance(circle, 'yellow', 'yellow');
		config.drawScene();
	});
	
	circle.on('mouseout', function () {
		setAppearance(circle, 'blue');
		config.drawScene();
	});
	
	circle.on('mousedown', function () {
		setAppearance(circle, 'red', 'red');
		config.drawScene();
	});
	
	circle.on('mouseup', function () {
		setAppearance(circle, 'yellow', 'yellow');
		config.drawScene();
		config.pushed(config.number);
	});
	
	
	return group;
};

/**
 * Set the appearance of a Kinect.shape object.
 * @private
 * @param {Kinect.Shape} object - The object to set edit.
 * @param {String} fill - The color to fill with.
 * @param {String} shadow - The color of the shadow, null will "remove" shadow.
 */
function setAppearance (object, fill, shadow) {
	object.setFill(fill);
	if (shadow != null) {
		object.setShadow({
			color: shadow,
			blur: 15,
			opacity: 1
		});
	} else {
		/* How to remove shadow? opacity 0 does not work, use 0.01 */
		object.setShadow({
			opacity: 0.01
		});
	}
}