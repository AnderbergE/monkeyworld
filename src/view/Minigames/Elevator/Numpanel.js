/**
 * Create a numpanel
 * Note: The left over panel width will be used as spacing between buttons.
 * @extends MW.Buttonpanel
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} width - width of the panel, default 100
 * 		{Number} buttonWidth - width of a button, default 30
 * 		{Number} buttonHeight - height of a button, default 30
 * 		{Number} nbrOfButtons - number of buttons, default 2
 *		{Function} drawScene - function that redraws the scene, default empty
 */
MW.Numpanel = MW.Buttonpanel.extend(
/** @lends {MW.Numpanel.prototype} */
{
	init: function (config) {
		this._super(config);
		
		/* Add the buttons */
		var button = 1;
		var columnPos = 0;
		for (button; button <= this.config.nbrOfButtons; button++) {
			columnPos = ((button - 1) % this.config.columns);
			this.group.add(new MW.Button({
				x: columnPos * this.config.buttonWidth +
					columnPos * this.config.numberSpacing,
				y: Math.floor((button - 1) / this.config.columns) *
					this.config.buttonHeight,
				width: this.config.buttonWidth,
				height: this.config.buttonHeight,
				number: button,
				drawScene: config.drawScene
			}).getGroup());
		}
	}
});