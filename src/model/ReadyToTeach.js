/**
 * @constructor
 * @param {EventManager} evm
 * @param {Object} config 
 * @extends {ModelModule}
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
	};
	
	var enterMonkeySeeMode = function() {
		evm.tell("Game.startGame", {
			view: FishingView,
			model: FishingGame,
			mode: GameMode.MONKEY_SEE
		});
	};
	
	this.readyToTeach = function() {
		evm.tell("Game.setMode", {mode: GameMode.MONKEY_SEE});
		evm.tell("Game.getBanana", {
			callback: enterMonkeySeeMode
		});
	};
	
	this.tearDown = function() {
		
	};
	
	this.onFrame = function() {};
	
	this.start = function() {
		
	};
}
ReadyToTeach.prototype = new ModelModule();