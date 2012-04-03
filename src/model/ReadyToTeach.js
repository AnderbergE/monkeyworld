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
	};
	
	var enterMonkeySeeMode = function() {
		evm.tell("Game.startGame", {
			view: FishingView,
			model: FishingGame,
			mode: GameMode.MONKEY_SEE
		});
	};
	
	this.readyToTeach = function() {
		GameState.setMode(GameMode.MONKEY_SEE);
		evm.tell("Game.getBanana", {
			callback: enterMonkeySeeMode
		});
	};
	
	this.tearDown = function() {
		
	};
	
	this.start = function() {
		
	};
}