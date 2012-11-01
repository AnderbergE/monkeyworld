/**
 * Creates a button.
 * Note: It would have been nice to have a superclass with two different
 * ones for number and boolean, but I did not figure out how. Yet.
 * @extends {MW.GlobalObject}
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} width - the width of the button, default 0
 * 		{Number} height - the height of the button, default 0
 * 		{Number} number - number of the button, default undefined
 * 		{Number} bool - yes = true, no = false, default true
 *		{Function} drawScene - function that redraws the scene, default empty.
 */
MW.Button = MW.GlobalObject.extend(
/** @lends {MW.Button.prototype} */
{
	/** @constructs */
	init: function (config, tag) {
		this._super(tag === undefined ? "Button" : tag);
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.width === undefined) config.width = 0;
		if (config.height === undefined) config.height = 0;
		if (config.bool === undefined) config.bool = true;
		if (config.drawScene === undefined) config.drawScene = function () {};
		var button = this,
			group,
			image,
			imageDown,
			graphics;
		
		/* Add button depending on button type */
		if (config.number === undefined) {
			image = eval("MW.Images.ELEVATORGAME_BUTTON_" +
				(config.bool ? "YES" : "NO"));
			imageDown = eval("MW.Images.ELEVATORGAME_BUTTON_DOWN_" +
				(config.bool ? "YES" : "NO"));
		} else {
			image = eval("MW.Images.ELEVATORGAME_BUTTON_FINGERS_" +
				config.number);
			imageDown = eval("MW.Images.ELEVATORGAME_BUTTON_FINGERS_DOWN_" +
				config.number);
		}
		graphics = new Kinetic.Image({
			image: image
		});
		
		group = new Kinetic.Group({
				x: config.x,
				y: config.y,
				scale: {
					/* I was unable to set image size, so set scale instead */
					x: config.width / image.width,
					y: config.height / image.height
				}
		});
		group.add(graphics);
		group.setListening(false);
		
		
		/**
		 * @public
		 * @return {Kinetic.Group} returns group that is addable to the stage.
		 */
		this.getGroup = function () {
			return group;
		};
		
		/**
		 * @public
		 * @param {Boolean} lock - true if button is locked, otherwise false.
		 */
		this.lock = function (lock) {
			group.setListening(!lock);
			config.drawScene();
		}
		
		
		/* Mouse events */	
		graphics.on('mouseover', function () {
			document.body.style.cursor = "pointer";
		});

		graphics.on('mouseout', function () {
			document.body.style.cursor = "default";
		});

		graphics.on('mousedown', function () {
			MW.SetImage(graphics, imageDown, 0, graphics.getY() + 5);
			config.drawScene();
		});

		graphics.on('mouseup', function () {
			MW.SetImage(graphics, image, 0, 0);
			config.drawScene();
			if (config.number === undefined) {
				button.tell('BUTTON_PUSHED', { bool: config.bool });
			} else {
				button.tell('BUTTON_PUSHED', { number: config.number });
			}
		});
	
		/**
		 * @public
		 * @param {Boolean} lock - true if the buttons should not be pushable.
		 */
		button.on(MW.Event.MG_ELEVATOR_LOCK, function (lock) {
			button.lock(lock);
		});
	}
});