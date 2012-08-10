/**
 * @constructor
 * @extends {Kinetic.Group}
 * config:
 *    x          - x position, default 0
 *    y          - y position, default 0
 *    buttonWidht - 
 *    buttonHeight -
 *    min        - min number, default 1
 *    max        - max number, default 6
 *    step       - step number, default 1
 *    width      - number of buttons in width, default 2
 *    button     -
 *    buttonActive -
 *    buttonMargin -
 *    buttonOffset - offset from top left corner, where the first button appears
 *    pushed       - button pushed callback, number passed as argument
 *    representations
 *    representationsScale
 */
MW.Numpad = function(config) {
	if (config.x            === undefined) config.x            = 0;
	if (config.y            === undefined) config.y            = 0;
	if (config.min          === undefined) config.min          = 1;
	if (config.max          === undefined) config.max          = 6;
	if (config.step         === undefined) config.step         = 1;
	if (config.width        === undefined) config.width        = 2;
	if (config.pushed       === undefined) config.pushed       = function() {};
	if (config.buttonMargin === undefined) config.buttonMargin = 10;
	if (config.buttonOffset === undefined) config.buttonOffset = { x: 0, y: 0 };
	if (config.representationsScale === undefined) config.representationsScale = 1;
	
	var buttons = [];
	var publicLock = false;
	
	var grid = new Utils.gridizer(
		config.buttonOffset.x, config.buttonOffset.y,
		config.buttonWidth + config.buttonMargin, config.buttonHeight + config.buttonMargin,
		config.width
	);
	
	var group = new Kinetic.Group({ x: config.x, y: config.y });
	
	for (var i = config.min; i <= config.max; i += config.step) { (function(i) {
		var pos = grid.next();
		var buttonGroup = new Kinetic.Group({
			x: pos.x, y: pos.y
		});
		var button = new Kinetic.Image({
			image: config.button,
			width: config.buttonWidth,
			height: config.buttonHeight,
			shadow: {
			      color: 'black',
			      blur: 10,
			      offset: [3, 3],
			      alpha: 0.5
			    }
		});
		var representation = new Kinetic.Image({
			image: config.representations[i],
			scale: {
				x: config.representationsScale,
				y: config.representationsScale
			},
			centerOffset: {
				x: config.representations[i].width / 2,
				y: config.representations[i].height / 2
			},
			x: config.buttonWidth / 2,
			y: config.buttonHeight / 2
		});
		var pushFunction = function(event, force) {
			if (force === undefined) force = false;
			if (force || !publicLock) {
				group.lock();
				config.pushed(i);
				button.attrs.image = config.buttonActive;
			}
		};
		buttonGroup.on("mousedown touchstart", function () { pushFunction(null, false); });
		buttonGroup.add(button);
		buttonGroup.add(representation);
		button.push = pushFunction;
		group.add(buttonGroup);
		buttons[i] = button;
	})(i)};
	
	group.release = function() {
		for (var i = config.min; i <= config.max; i += config.step) {
			buttons[i].attrs.image = config.button;
		}
	};
	
	group.lock = function() {
		publicLock = true;
	};
	
	group.unlock = function() {
		publicLock = false;
	};
	
	group.getButtonPosition = function(i) {
		return { x: buttons[i].getX(), y: buttons[i].getY() };
	};
	
	group.push = function(i) {
		buttons[i].push(null, true);
	};
	
	return group;
};

