/**
 * MonkeyPlayer
 * @extends {Player}
 * @constructor
 */
function MonkeyPlayer() {
	Log.debug("Creating MonkeyPlayer", "player");
	var that = this;
	this.strategies = function() {};
	
	/**
	 * @param {Ladder} game
	 * @param {MW.MiniGameResult=} result
	 */
	this.strategies["Ladder"] = function(game, result) {
		Log.debug("Applying MonkeyPlayer's strategy to the Ladder", "player");
		
		var resultPosition = 0;
		var interrupted = false;
		
		that.on("Ladder.readyToPick", function(msg) {
			play(resultPosition++);
		});
		
		this.interrupt = function() {
			Log.debug("Interrupting agent", "agent");
			interrupted = true;
		};
		
		this.resume = function() {
			Log.debug("Resuming agent", "agent");
			interrupted = false;
			play(resultPosition);
		};
		
		var play = function(resultPosition) {
			if (interrupted) return;
			setTimeout(function() {
				if (result[resultPosition] === "correct") {
					console.log("Target Number: " + game.getTargetNumber());
					game.pick(game.getTargetNumber());
				} else {
					console.log("Incorrect Number: " + game.getIncorrectNumber());
					game.pick(game.getIncorrectNumber());
				}
				
			}, 2000);
		};
		
		that.on("Ladder.hasTreat", function(msg) {
			setTimeout(function() {
				game.openTreat();	
			}, 1500);
		});
		
		that.on("Game.stopMiniGame", function(msg) {
			console.log("FORGETTING MONKEY");
			that.forget();
		});
	};
	
	/**
	 * @param {FishingGame} game
	 */
	this.strategies["FishingGame"] = function(game, result) {
		Log.debug("Applying MonkeyPlayer's strategy to the FishingGame", "player");

		var resultPosition = 0;
		
		that.on("Game.start", function(msg) {
			game.turnOffClicks();
			game.turnOffInactivityTimer();
		});
		
		that.on("FishingGame.started", function(msg) {
			handleResults();
		});
		
		that.on("FishingGame.countingStarted", function(msg) {
			handleCountingResults();
		});
		
		function handleCountingResults() {
			setTimeout(function() {
				Sound.play(Sounds.MONKEY_HMM);	
				setTimeout(function() {
					var guess = result[resultPosition++];
					game.countFish(guess);
					if (resultPosition < result.length) {
						handleCountingResults();
					}
				}, 2000);
			}, 1000);
		};
		
		function handleResults() {
			var happening = result[resultPosition++];
			var resultLength = result.length;
			if (resultPosition <= resultLength && happening != "FishingGame.catchingDone") {
				this.setTimeout(function() {
					if (happening == "correct") {
						game.catchFish(game.getOneCorrectFish(), function() {handleResults();});
					} else if (happening == "incorrect") {
						game.catchFish(game.getOneIncorrectFish(), function() {handleResults();});
					} else if (happening == "freeIncorrect") {
						game.freeFish(game.getOneIncorrectlyCapturedFish(), function() {handleResults();});
					} else if (happening == "freeCorrect") {
						game.freeFish(game.getOneCorrectlyCapturedFish(), function() {handleResults();});
					} else {
						Log.error("Error when handling happenings (no such happening: " + happening + ")", "monkey");
					}
				}, 2000);
			}
		}
		
		that.on("Game.tearDown", function(msg) {
			that.forget();
		});
	};
	
}
MonkeyPlayer.prototype = new Player();
