/**
 * MonkeyPlayer
 * @extends {MW.Player}
 * @constructor
 */
function MonkeyPlayer() {
	Log.debug("Creating MonkeyPlayer", "player");
	MW.Player.call(this, "MonkeyPlayer");
	var that = this;
	this.strategies = function() {};
	
	/**
	 * @param {Ladder} game
	 * @param {Array=} result
	 */
	this.strategies["Ladder"] = function(game, result) {
		Log.debug("Applying MonkeyPlayer's strategy to the Ladder", "player");
		
		var resultPosition = 0;
		var interrupted = false;
		var intentionalMistakePosition = Utils.getRandomInt(0, result.length - 1);
		Log.debug("Will make mistake on try number " + intentionalMistakePosition + 1, "agent");
		var tries = 0;
		
		that.on("Ladder.readyToPick", function(msg) {
			play(resultPosition++);
		});
		
		that.on("Ladder.incorrect", function(msg) {
			if (game.agentIsInterrupted()) return;
			/** @const @type {number} */ var MAX_AGENT_TRIES = 4;
			if (tries < MAX_AGENT_TRIES) {
				play(resultPosition++);
			} else if (tries === MAX_AGENT_TRIES) {
				if (!game.agentIsBeingHelped()) {
					MW.Sound.play(MW.Sounds.LADDER_PLEASE_HELP_ME);
					game.helpAgent();
				}
			}
		});
		
		that.on("Ladder.correct", function(msg) {
			tries = 0;
		});
		
		this.interrupt = function() {
			Log.debug("Interrupting agent", "agent");
			interrupted = true;
			tries = 0;
		};
		
		this.resume = function() {
			Log.debug("Resuming agent", "agent");
			interrupted = false;
		};
		
		var play = function(resultPosition) {
			if (interrupted) return;
			tries++;
			setTimeout(function() {
				Log.debug("Picking a number", "agent");
				if (resultPosition === intentionalMistakePosition || result[resultPosition] === "incorrect") {
					game.pick(game.getIncorrectNumber());
				} else {
					game.pick(game.getTargetNumber());
				}
				
			}, 2000);
		};
		
		that.on("Ladder.hasTarget", function(msg) {
			setTimeout(function() {
				game.openTreat();	
			}, 1500);
		});
		
		that.on("Game.stopMiniGame", function(msg) {
			that.forget();
		});
	};
}
