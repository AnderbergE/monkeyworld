/**
 * Creates a button.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - number of the button, default 0
 *		{Function} drawScene - function that redraws the scene, default empty.
 * @return The button as a Kinetic.group.
 */
MW.Button = MW.GlobalObject.extend(
/** @lends {MW.Agent.prototype} */
{
	/** @constructs */
	init: function (config) {
		this._super("Button");
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.number === undefined) config.number = 0;
		if (config.drawScene === undefined) config.drawScene = function () {};
		var button = this,
			group,
			graphics;
		
		
		group = new Kinetic.Group({
				x: config.x,
				y: config.y
		});
		group.setScale(0.75, 0.75);
		
		/* Add button */
		graphics = new Kinetic.Image({
			image: eval("MW.Images.ELEVATORGAME_BUTTON_FINGERS_" +
				config.number)
		});
		group.add(graphics);
		
		
		/* Mouse events */	
		graphics.on('mouseover', function () {
			config.drawScene();
			document.body.style.cursor = "pointer";
		});

		graphics.on('mouseout', function () {
			config.drawScene();
			document.body.style.cursor = "default";
		});

		graphics.on('mousedown', function () {
			graphics.clearImageBuffer();
			var image = eval("MW.Images.ELEVATORGAME_BUTTON_FINGERS_DOWN_" +
					config.number);
			MW.SetImage(graphics, image, 0, graphics.getY() + 5)
			config.drawScene();
		});

		graphics.on('mouseup', function () {
			var image = eval("MW.Images.ELEVATORGAME_BUTTON_FINGERS_" +
					config.number);
			MW.SetImage(graphics, image, 0, 0)
			config.drawScene();
			button.tell('BUTTON_PUSHED', { number: config.number });
		});
	
		/**
		 * @public
		 * @param {Boolean} lock - true if the buttons should not be pushable.
		 */
		button.on(MW.Event.MG_ELEVATOR_LOCK, function (lock) {
			group.setListening(!lock);
			config.drawScene();
		});
		
		/**
		 * @public
		 * @return {Kinetic.Group} returns group that is addable to the stage.
		 */
		this.getGroup = function () {
			return group;
		};
	}
});