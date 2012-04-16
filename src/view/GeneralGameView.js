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
		var happyFace = getImage('fish0');
		layer.add(happyFace);
	}, EVM_TAG);
};
