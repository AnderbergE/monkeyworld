/**
 * @constructor
 * @extends {ViewModule}
 */
MW.MinigameHandlerView = function() {
	ViewModule.call(this);
	
	/** @type {MW.MinigameHandlerView} */ var view = this;
	/** @type {Kinetic.Stage}          */ var stage = view.stage;
	/** @type {Kinetic.Layer}          */ var layer = stage._gameLayer;
	
	view.tag("MinigameHandlerView");
	
	/** @const @type {string} */ var label = "Backend Score (current minigame):";
	var text = new Kinetic.Text({
		text: label,
		fontSize: 16,
		fontFamily: "sans-serif",
		textFill: "black",
		align: "left",
		verticalAlign: "middle",
		x: view.stage.getWidth() - 500,
		y: 35
	});

	view.on(MW.Event.BACKEND_SCORE_UPDATE_MINIGAME, function(msg) {
		text.setText(label + " " + msg.score);
	});
	
	view.on(MW.Event.MINIGAME_INITIATED, function(msg) {
		layer.add(text);
	});
	
	view.on(MW.Event.MINIGAME_ENDED, function(msg) {
		layer.remove(text);
	});
	

	/**
	 * Show the current learning track.
	 * @param {GameView} view
	 */
	(function(view) {
		/** @const @type {string} */ var label = "Learning track (current game):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 16,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 500,
			y: 55
		});
		
		view.on(MW.Event.MINIGAME_INITIATED, function(msg) {
			layer.add(text);
		});
		
		view.on(MW.Event.LEARNING_TRACK_UPDATE, function(msg) {
			text.setText(label + " " + msg.learningTrack.name());
		});
		
		view.on(MW.Event.TEAR_DOWN, function(msg) {
			layer.remove(text);
		});
		
	})(this);
};
inherit(MW.MinigameHandlerView, ViewModule);