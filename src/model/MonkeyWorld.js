/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {boolean=} useViews Defaults to true. Useful to falsify when testing.
 */
MW.Game = function(useViews) {

	/** @const @type {MW.Game}      */ var that = this;
	
	/** @const @type {MiniGame}     */ var NO_MINI_GAME = new NoMiniGame();
	/** @const @type {MW.NoMiniGameResult} */ var NO_RESULT    = new MW.NoMiniGameResult();
	/** @const @type {GamerPlayer}  */ var GAMER        = new GamerPlayer();
	/** @const @type {MonkeyPlayer} */ var MONKEY       = new MonkeyPlayer();
	/** @const @type {AngelPlayer}  */ var ANGEL        = new AngelPlayer();
	
	/** @type {number}              */ var numBananas   = 0;
	/** @type {GameMode}            */ var gameMode     = GameMode.CHILD_PLAY; 
	/** @type {MiniGame}            */ var miniGame     = NO_MINI_GAME;
	/** @type {Player}              */ var player       = GAMER;
	/** @type {number}              */ var _round       = 1;
	/** @type {boolean}             */ var mistake      = false;
	/** @type {MW.MiniGameResult}   */ var result       = NO_RESULT;

	/*========================================================================*/
	/*=== CONSTRUCTOR ========================================================*/
	/*========================================================================*/
	
	if (useViews === undefined) useViews = true;
	this.on("frame", function(msg) { miniGame.onFrame(msg.frame); });

	
	/*========================================================================*/
	/*=== PRIVATE ============================================================*/
	/*========================================================================*/
	
	/**
	 * Set the current round to specified number. It is recommended to use this
	 * function above accessing the _round variable directly, since this
	 * function will make boundary checks. It throws an exception if the upper
	 * or lower round boundary is violated. 
	 * @param {number} round
	 */
	var setRound = function(round) {
		if (round > Settings.get("global", "monkeySeeRounds") &&
		    (gameMode === GameMode.MONKEY_SEE ||
		     gameMode === GameMode.MONKEY_DO)) {
			throw "MonkeyWorld.MiniGameRoundOverMaxLimit";
		} else if (round < 1){
			throw "MonkeyWorld.MiniGameRoundUnderMinLimit";
		} else {
			_round = round; 
		}
	};
	
	/**
	 * Add one round to the current mini game
	 */
	var addRound = function() {
		setRound(_round + 1);
	};
	
	/**
	 * Add one or more bananas
	 * @param {number=} number Defaults to one (1) banana
	 * @param {Function=} callback What to do when the banana has been added
	 */
	var addBanana = function(number, callback) {
		if (number === undefined) number = 1;
		numBananas++;
		console.log(number + " " +numBananas);
		if (number > 0) {
			console.log("ADD BANANA");
			that.tell("Game.addBanana", {
				index: numBananas,
				callback: number > 1 ? function() { addBanana(number - 1, callback); } : callback
			});
		}
	};
	
	/**
	 * Calculate what the next game mode, round and player should be.
	 */
	var getNextState = function() {
		if (gameMode === GameMode.CHILD_PLAY) {
			that.tell("Game.askIfReadyToTeach", {
				yes: function() {
					gameMode = GameMode.MONKEY_SEE;
					setRound(1);
					addBanana(1, startMiniGame);
				},
				no: function() {
					addRound();
					startMiniGame();
				}
			});
		} else if (gameMode === GameMode.MONKEY_SEE) {
			var result = miniGame.getResult();
			if (result.madeMistake()) mistake = true;
			if (_round === Settings.get("global", "monkeySeeRounds")) {
				setRound(1);
				gameMode = GameMode.MONKEY_DO;
				player = MONKEY;
				addBanana(1, startMiniGame);
			} else {
				addRound();
				startMiniGame();
			}
		} else if (gameMode === GameMode.MONKEY_DO) {
			if (_round === Settings.get("global", "monkeySeeRounds")) {
				setRound(1);
				gameMode = GameMode.CHILD_PLAY;
				player = GAMER;
				addBanana(2);
			} else {
				addRound();
				startMiniGame();
			}
		}
	};
	
	/**
	 * Start the current mini game.
	 */
	var startMiniGame = function() {
		miniGame = new FishingGame();
		if (useViews) {
			new FishingView(miniGame).setup();
			that.tell("Game.miniGameListenersInitiated");
		}
		that.tell("Game.initiate");
		miniGame.start();
		that.tell("Game.start");
		if (gameMode === GameMode.MONKEY_DO) {
			miniGame.play(player, result.getResult(_round).getActions());
		} else {
			miniGame.play(player);	
		}
	};
	
	/**
	 * Stop the current mini game.
	 */
	var stopMiniGame = function() {
		that.tell("Game.stopMiniGame");
		miniGame.stop();
		delete miniGame;
		miniGame = NO_MINI_GAME;
	};

	/*========================================================================*/
	/*=== PUBLIC =============================================================*/
	/*========================================================================*/
	
	/**
	 * Return the number of bananas
	 * @returns {number}
	 */
	this.numberOfBananas = function() {
		return numBananas;
	};
	
	/**
	 * Tell the game that a mini game has finished
	 */
	this.miniGameDone = function() {
		if (miniGame === NO_MINI_GAME) {
			throw "MonkeyWorld.NoActiveMiniGameException";
		}
		this.tell("Game.stopMiniGame");
		result.pushResult(miniGame.getResult());
		getNextState();
	};
	
	/**
	 * Get the current game mode.
	 * @return {GameMode}
	 */
	this.getMode = function() {
		return gameMode;
	};
	
	/**
	 * Get the current round.
	 * @return {number}
	 */
	this.getRound = function() {
		return _round;
	};
	
	/**
	 * Start the Monkey World game
	 */
	this.start = function() {
		result = new MW.MiniGameResult();
		startMiniGame();
	};
	
	/**
	 * Stops the Monkey World game
	 */
	this.stop = function() {
		stopMiniGame();
		numBananas = 0;
		gameMode = GameMode.CHILD_PLAY;
		setRound(1);
		player = GAMER;
		mistake = false;
		result = NO_RESULT;
		this.tell("Game.stop");
	};
	
	
	/**
	 * Restart the Monkey World game.
	 */
	this.restart = function() {
		this.stop();
		this.start();
	};
	
	/**
	 * Returns the current mini game.
	 * @return {MiniGame}
	 */
	this.getMiniGame = function() {
		return miniGame;
	};
	
	/**
	 * Returns true if a mistake has been made in the current mini game.
	 * @return {boolean}
	 */
	this.madeMistake = function() {
		return mistake;
	};
	
	/**
	 * Returns true if the current player is the gamer.
	 * @return {boolean}
	 */
	this.playerIsGamer = function() { return player === GAMER; };
	
	/**
	 * Returns true if the current player is the monkey.
	 * @return {boolean}
	 */
	this.playerIsMonkey = function() { return player === MONKEY; };
	
	/**
	 * Returns true if the current player is the guardian angel.
	 * @return {boolean}
	 */
	this.playerIsAngel = function() { return player === ANGEL; };

};

MW.Game.prototype = new MW.GlobalObject("MonkeyWorld.Game");