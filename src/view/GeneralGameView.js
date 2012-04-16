/**
 * View for illustrating general game events, such as banana retrievement and
 * system confirmation.
 * 
 * @constructor
 * @implements {ViewModule}
 * @param {EventManager} evm
 * @param {GameState} gameState
 */
function GeneralGameView(evm, stage, gameState) {
	
	var EVM_TAG = "GeneralGameView";
	var layer = stage._gameLayer;
	
	this.init = function() {
		Log.debug("GeneralGameView kicking in", "GGV");
	};
	
	this.tearDown = function() {
		evm.forget(EVM_TAG);
	};
	
	evm.on("Game.showSystemConfirmation", function(msg) {
		Log.debug("Game.showSystemConfirmation", "GGV");
		var happyFace = new Kinetic.Image({
			image: images['happy-face'],
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			centerOffset: { x: images['happy-face'].width / 2, y: images['happy-face'].height / 2 }
		});
		layer.add(happyFace);
	}, EVM_TAG);
	
	evm.on("Game.thankYouForHelpingMonkey", function(msg) {
		var text = new Kinetic.Text({
			fontFamily: "Arial",
			fontSize: 36,
			textFill: "white",
			textStrokeFill: "black",
			text: Strings.get("THANK_YOU_FOR_HELPING"),
			align: "center",
			y: stage.getHeight()/2,
			x: stage.getWidth()/2
		});
		layer.add(text);
		setTimeout(function() {
			Tween.get(text.attrs).to({x:-300, y:-400, alpha: 1}, 500).call(function() {
				layer.remove(text);
				msg.callback();	
			});
		}, 1500);
	}, EVM_TAG);
};
