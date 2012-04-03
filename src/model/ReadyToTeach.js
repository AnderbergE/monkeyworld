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
			model: FishingGame,
			mode: GameMode.CHILD_PLAY
		});
		Log.debug("Not ready to teach!");
	};
	
	var enterMonkeySeeMode = function() {
		evm.tell("Game.startGame", {
			view: FishingView,
			model: FishingGame,
			mode: GameMode.MONKEY_SEE
		});
		console.log("Will enter MonkeySeeMode");
	};
	
	this.readyToTeach = function() {
		evm.tell("Game.getBanana", {
			callback: enterMonkeySeeMode
		});
		Log.debug("Ready to teach!");
	};
	
	this.tearDown = function() {
		
	};
	
	this.start = function() {
		
	};
}