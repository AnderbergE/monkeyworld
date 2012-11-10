/**
 * Create a panel
 * Note: The left over panel width will be used as spacing between buttons.
 * @extends Class
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} width - width of the panel, default 100
 * 		{Number} buttonWidth - width of a button, default 30
 * 		{Number} buttonHeight - height of a button, default 30
 * 		{Number} nbrOfButtons - number of buttons, default 2
 *		{Function} drawScene - function that redraws the scene, default empty
 */
MW.Buttonpanel = Class.extend(
/** @lends {MW.Buttonpanel.prototype} */
{
	init: function (config) {
		if (config.x === undefined) config.x = 0;
		if (config.y === undefined) config.y = 0;
		if (config.width === undefined) config.width = 100;
		if (config.buttonWidth === undefined) config.buttonWidth = 30;
		if (config.buttonHeight === undefined) config.buttonHeight = 30;
		if (config.nbrOfButtons === undefined) config.nbrOfButtons = 2;
		if (config.drawScene === undefined) config.drawScene = function () {};
		this.config = config;
		this.config.columns =
			Math.floor(this.config.width / this.config.buttonWidth);
		if (this.config.columns > config.nbrOfButtons) {
			this.config.columns = config.nbrOfButtons;
		}
		this.config.numberSpacing = (this.config.width -
			config.nbrOfButtons * this.config.buttonWidth) /
			(this.config.columns - 1);
		
		if (this.config.nbrOfButtons == 1 || this.config.columns == 1) {
			this.config.width;
		} 
		
		this.group = new Kinetic.Group({
			x: this.config.x,
			y: this.config.y
		});
	},
	
	/**
	 * @public
	 * @returns {Number} The width of the panel.
	 */
	getWidth: function () {
		return this.config.width;
	},
	
	/**
	 * @public
	 * @returns {Number} The height of the panel.
	 */
	getHeight: function () {
		var rows = Math.ceil(this.config.nbrOfButtons / this.config.columns);
		return rows * this.config.buttonHeight;
	},
	
	/**
	 * @public
	 * @returns {Kinetic.Group} The group holding the graphics.
	 */
	getGroup: function () {
		return this.group;
	},
	
	lock: function (lock) {
		var i = 0;
		for (i; i < this.group.getChildren().length; i++) {
			this.group.getChildren()[i].lock(lock);
		}
		this.config.drawScene();
	},
	
	lightUp: function (light) {
		var i = 0;
		for (i; i < this.group.getChildren().length; i++) {
			this.group.getChildren()[i].lightUp(light);
		}
		this.config.drawScene();
	}
});