/**
 * @constructor
 * @extends {Kinetic.Shape}
 */
Kinetic.Button = function(config) {
	var button = new Kinetic.Group({
		x: config.x,
		y: config.y,
		width: config.width,
		height: config.height
	});
	var _rect = new Kinetic.Rect({
		x: 0, y: 0,
		width: config.width, height: config.height,
		fill: "#ccc",
		strokeWidth: 1,
		stroke: "white"
	});
	var _text = new Kinetic.Text({
		text: config.text,
		fontFamily: "Arial",
		textFill: "black",
		fontSize: config.fontSize,
		x: config.width / 2,
		y: config.height / 2,
		verticalAlign: "middle",
		align: "center"
	});
	button.add(_rect);
	button.add(_text);
	button.on("mousedown touchstart", config.callback);
	return button;
};