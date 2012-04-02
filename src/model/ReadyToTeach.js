/**
 * @constructor
 * @param {EventManager} evm
 * @param {Object} config 
 * @implements {ModelModule}
 */
function ReadyToTeach(evm, config) {
	
	this.init = function(config) {
		
	};
	
	this.notReadyToTeach = function() {
		evm.tell("Game.startGame", {
			view: FishingView,
			model: FishingGame
		});
		Log.debug("Not ready to teach!");
	};
	
	this.readyToTeach = function() {
		Log.debug("Ready to teach!");
	};
	
	this.tearDown = function() {
		
	};
	
	this.start = function() {
		
	};
}