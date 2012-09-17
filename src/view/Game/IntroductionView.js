/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {Kinetic.Stage} stage
 * @param {Function} callback
 */
MW.IntroductionView = MW.ViewModule.extend(
/** @lends {MW.IntroductionView.prototype} */
{
	/** @constructs */
	init: function (stage, callback) {
		this._super(stage, "IntroductionView");
		this._callback = callback;
		this._layer = new Kinetic.Layer();
	},

	setup: function () {
		var that = this;
		this._super();
		this.getStage().add(this._layer);
		
		var mouseView = new MW.MouseAgentView(this._layer, { x: 100, y: 200, scale: 0.7 });
		mouseView.dance();
		
		var mouseView2 = new MW.MouseAgentView(this._layer, { x: 300, y: 200, scale: 0.7 });
		mouseView2.dance();

		var mouseView3 = new MW.MouseAgentView(this._layer, { x: 500, y: 200, scale: 0.7 });
		mouseView3.dance();

		var mouseView4 = new MW.MouseAgentView(this._layer, { x: 700, y: 200, scale: 0.7 });
		mouseView4.dance();
		
		var skipButton = new Kinetic.Group({ x: 10, y: 10 });
		
		var skipRect = new Kinetic.Rect({
			width: 100,
			height: 30,
			fill: "gray"
		});
		
		var skipText = new Kinetic.Text({
			text: "Skip",
			width: 100,
			height: 30,
			y: 10,
			align: "center",
			fontFamily: "Arial",
			textFill: "black"
		});

		skipButton.add(skipRect);
		skipButton.add(skipText);
		
		skipButton.on("mousedown touchstart", function () {
			that._callback(true);
		});
		this._layer.add(skipButton);
		this._layer.draw();
		this.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_1); }, 2000);
		this.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_2); }, 2000);
		this.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_3); }, 7000);
		this.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_4); }, 7000);
		this.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_5); }, 12000);
		this.setTimeout(function () { that._callback(false); }, 14000);
	},
	
	tearDown: function () {
		this._super();
		this.getStage().remove(this._layer);
	}
});

