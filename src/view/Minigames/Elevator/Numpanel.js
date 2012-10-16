/**
 * Create a numpanel
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} height - height of the numpanel, default 50
 * 		{Number} nbrOfButtons - columns of buttons, default 5
 * 		{Number} rows - rows of buttons, default 1
 * 		{Number} columns - columns of buttons, default nbrOfButtons
 * 		{Number} buttonScale - size of button (1 = full row's height), default 1
 *		{Function} drawScene - function that redraws the scene, default empty.
 * @return The numpanel as a Kinetic.group.
 */
MW.Numpanel = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.height === undefined) config.height = 50;
	if (config.nbrOfButtons === undefined) config.nbrOfButtons = 5;
	if (config.rows === undefined) config.rows = 1;
	if (config.columns === undefined) config.columns = config.nbrOfButtons;
	if (config.buttonScale === undefined) config.buttonScale = 1;
	if (config.drawScene === undefined) config.drawScene = function () {};
	var group,
		buttonDiameter = config.height / config.rows;
	
	group = new Kinetic.Group({
		x: config.x,
		y: config.y
	});
	
	/* Add the buttons in rows and columns */
	var k = 1;
	for (var row = 0; row < config.rows; row++) {
		for (var column = 0; column < config.columns; column++) {
			if (k > config.nbrOfButtons) {
				break;
			}
			group.add(new MW.Button({
				x: column * buttonDiameter,
				y: row * buttonDiameter,
				number: k,
				radius: (buttonDiameter * config.buttonScale ) / 2,
				drawScene: config.drawScene
			}).getGroup());
			k++;
		}
	}
	group.setListening(false);
	
	
	/**
	 * @public
	 * @returns {Number} The height of the bird tree nest.
	 */
	group.getWidth = function () {
		var columns = config.columns > config.nbrOfButtons ?
			config.columns : config.nbrOfButtons;
		/* buttonwidth  */
		return columns * (config.height / config.rows);
	};
	
	/**
	 * @public
	 * @returns {Number} The height of the bird tree nest.
	 */
	group.getHeight = function () {
		var buttonDiameter = config.height / config.rows; 
		var rows = Math.ceil(config.nbrOfButtons / config.columns);
		return rows * buttonDiameter - buttonDiameter / 2;
	};
	
	/**
	 * @public
	 * @param {Boolean} isLocked - true if the buttons should not be pushable.
	 */
	group.lock = function (isLocked) {
		group.setListening(!isLocked);
		config.drawScene();
	}
	
	
	return group;
};
