/**
 * @constructor
 * @param {EventManager} evm
 * @param {Object} config 
 * @implements {ModelModule}
 */
function ReadyToTeach(evm, config) {
	
	this.init = function(config) {
		console.log("ReadyToTeach init");
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
	};
	
	this.readyToTeach = function() {
		GameState.addBanana();
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