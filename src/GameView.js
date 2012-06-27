/**
 * @constructor
 * @extends {ViewModule}
 */
function GameView() {
	ViewModule.call(this);
	/** @type {GameView}      */ var view  = this;
	/** @type {Kinetic.Layer} */ var layer = view.stage._gameLayer;

	/**
	 * Show the current backend score of a mini game.
	 * @param {GameView} view
	 */
	(function(view) {
		/** @const @type {string} */ var label = "Backend Score (current mode):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 16,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 500,
			y: 15
		});
		layer.add(text);
		
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MODE, function(msg) {
			text.setText(label + " " + msg.backendScore);
		});
		
		view.on(MW.Event.TEAR_DOWN, function(msg) {
			layer.remove(text);
		});
		
	})(this);
}
inherit(GameView, ViewModule);