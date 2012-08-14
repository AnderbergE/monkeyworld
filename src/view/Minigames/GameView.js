/**
 * @constructor
 * @extends {ViewModule}
 * @param {string} tag
 */
function GameView(tag) {
	ViewModule.call(this, tag);
	/** @type {GameView}      */ var view  = this;
	/** @type {Kinetic.Layer} */ var layer = view.stage._gameLayer;
	/**
	 * Show the current backend score of a mini game.
	 * @param {GameView} view
	 */
	(function (view) {
		/** @const */
		var label = "Backend Score (current mode):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 12,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 700,
			y: 15
		});
		layer.add(text);		
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MODE, function(msg) {
			text.setText(label + " " + msg.backendScore);
		});
		view.addTearDown(function() {
			layer.remove(text);
		});
	})(this);

	/**
	 * Show the face of the agent in the top right corner in child play mode
	 */
	(function (view) {
		var faceImageObj = view.game.getAgentView().normalFace();
		var faceImage = new Kinetic.Image({
			image: faceImageObj,
			x: view.getStage().getWidth() - faceImageObj.width - 15,
			y: 12,
			scale: 0.5
		});
		view.on(MW.Event.MINIGAME_STARTED, function(msg) {
			if (view.game.modeIsChild()) {
				layer.add(faceImage);
			} else
				console.log(faceImage);
		});
		view.addTearDown(function() {
			layer.remove(faceImage);
		});
	})(this);
}
