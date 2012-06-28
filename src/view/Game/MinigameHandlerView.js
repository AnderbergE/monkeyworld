/**
 * @constructor
 * @extends {ViewModule}
 */
MW.MinigameHandlerView = function() {
	ViewModule.call(this, "MinigameHandlerView");
	
	/** @type {MW.MinigameHandlerView} */ var view = this;
	/** @type {Kinetic.Stage}          */ var stage = view.stage;
	/** @type {Kinetic.Layer}          */ var layer = stage._gameLayer;
	
	/**
	 * Show the current total backend score of the minigame.
	 * @param {MW.MinigameHandlerView} view
	 */
	(function(view) {
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
		
		view.on(MW.Event.MINIGAME_STARTED, function(msg) {
			console.log("added be total score text");
			layer.add(text);
		});
		
		view.addTearDown(function() {
			console.log("remove be total score text");
			layer.remove(text);
		});
	})(this);
	

	/**
	 * Show the current learning track.
	 * @param {MW.MinigameHandlerView} view
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
		
		view.on(MW.Event.MINIGAME_STARTED, function(msg) {
			console.log("added learning track text");
			layer.add(text);
		});
		
		view.on(MW.Event.LEARNING_TRACK_UPDATE, function(msg) {
			text.setText(label + " " + msg.learningTrack.name());
		});
		
		view.addTearDown(function() {
			console.log("remove learning track text");
			layer.remove(text);
		});
		
	})(this);
};
