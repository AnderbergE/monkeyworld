/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {boolean=} useViews Defaults to true. Useful to falsify when testing.
 * @param {boolean=} useAgentChooser Defaults to true. Falsify when testing.
 * @param {string=} startGame Code of the game to begin play ("tree", "mountain" or "fishing").
 */
MW.Game = function(useViews, useAgentChooser, startGame) {
	/** @const @type {MW.Game}      */ var that = this;
	
	/** @const @type {MiniGame}     */ var NO_MINI_GAME = new NoMiniGame();
	/** @const @type {MW.NoMiniGameResult} */ var NO_RESULT    = new MW.NoMiniGameResult();
	/** @const @type {GamerPlayer}  */ var GAMER        = new GamerPlayer();
	/** @const @type {MonkeyPlayer} */ var AGENT        = new MonkeyPlayer();
	/** @const @type {AngelPlayer}  */ var ANGEL        = new AngelPlayer();
	
	/** @type {number}              */ var numBananas   = 0;
	/** @type {GameMode}            */ var gameMode     = GameMode.CHILD_PLAY; 
	/** @type {MiniGame}            */ var miniGame     = NO_MINI_GAME;
	/** @type {Function} @constructor */ var miniGameView = null;
	/** @type {Function}            */ var miniGameStarter = null;
	/** @type {Player}              */ var player       = GAMER;
	/** @type {number}              */ var _round       = 1;
	/** @type {MW.MiniGameResult}   */ var result       = NO_RESULT;

	/** @type {Object.<Object>} */
	var gameLibrary = {
		"fishing": { title: "Fishing Game", view: FishingView, game: FishingGame, available: false },
		"tree": { title: "Tree Game", view: TreeView, game: Ladder },
		"mountain": { title: "Mountain Game", view: MountainView, game: Ladder }
	};
	
	/*========================================================================*/
	/*=== CONSTRUCTOR ========================================================*/
	/*========================================================================*/
	
	if (useViews === undefined) useViews = true;
	if (useAgentChooser === undefined) useAgentChooser = true;
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
			gameMode = GameMode.MONKEY_SEE;
			startMiniGame();
		} else if (gameMode === GameMode.MONKEY_SEE) {
			var _result = miniGame.getResult();
			result.pushResult(_result);
			gameMode = GameMode.MONKEY_DO;
			player = AGENT;
			startMiniGame();
		} else if (gameMode === GameMode.MONKEY_DO) {
			if (_round === Settings.get("global", "monkeySeeRounds")) {
				setRound(1);
				gameMode = GameMode.CHILD_PLAY;
				player = GAMER;
				chooseMiniGame(function() {
					startMiniGame();	
				});
			} else {
				addRound();
				startMiniGame();
			}
		}
	};
	
	var chooseMiniGame = function(callback) {
		if (startGame === undefined) {
			that.tell("Game.showMiniGameChooser", {
				callback: function(choice) {
					miniGameStarter = function() {
						that.tell("Game.hideMiniGameChooser");
						miniGame = new choice.game();
						miniGameView = choice.view;					
					};
					callback();
				},
				games: gameLibrary
			});
		} else {
			miniGameStarter = function() {
				miniGame = new gameLibrary[startGame].game();
				miniGameView = gameLibrary[startGame].view;	
			};
			callback();
		}
	};
	
	/**
	 * Start the current mini game.
	 */
	var startMiniGame = function() {
		that.evm.print();
		miniGameStarter();
		if (useViews) {
			miniGameView.prototype.agentImage = GameView.prototype.agentImage;
			var v = new miniGameView(miniGame);
			v._setup();
			v.setup();
			that.tell("Game.miniGameListenersInitiated");
		}
		that.tell("Game.initiate");
		if (gameMode === GameMode.MONKEY_DO) {
			miniGame.play(player, result.getResult(_round).getActions());
		} else {
			miniGame.play(player);	
		}
		miniGame.start();
		that.tell("Game.start");
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
		var chooser = null;
		var _start = function(agent) {
			GameView.prototype.agentImage = agent;
			result = new MW.MiniGameResult();
			player = GAMER;
			chooseMiniGame(function() {
				startMiniGame();
			});
		};
		if (useAgentChooser) {
			chooser = new MW.AgentChooser(function(agent) {
				chooser.tearDown();
				_start(agent);
			});
			if (useViews) {
				new MW.AgentChooserView(chooser).setup();
				that.tell("Game.viewInitiated");
			}
		} else {
			_start("monkey");
		}
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
	 * @return {MiniGame|NoMiniGame}
	 */
	this.getMiniGame = function() {
		return miniGame;
	};
	
	this.setAgentAsPlayer = function() { player = AGENT; };
	this.setGamerAsPlayer = function() { player = GAMER; };
	
	/**
	 * Returns true if the current player is the gamer.
	 * @return {boolean}
	 */
	this.playerIsGamer = function() { return player === GAMER; };
	
	/**
	 * Returns true if the current player is the teachable agent.
	 * @return {boolean}
	 * @deprecated Use <code>playerIsAgent()</code> instead
	 */
	this.playerIsMonkey = function() { return player === AGENT; };
	
	/**
	 * Returns true if the current player is the teachable agent.
	 * @return {boolean}
	 */
	this.playerIsAgent = function() { return player === AGENT; };
	
	/**
	 * Returns true if the current player is the guardian angel.
	 * @return {boolean}
	 */
	this.playerIsAngel = function() { return player === ANGEL; };

	/** @return {boolean} true if the current mode is Child Play */
	this.modeIsChild = function() { return gameMode === GameMode.CHILD_PLAY; };
	
	/** @return {boolean} true if the current mode is Agent See */
	this.modeIsAgentSee = function() { return gameMode ===GameMode.MONKEY_SEE;};
	
	/** @return {boolean} true if the current mode is Agent Do */
	this.modeIsAgentDo = function() { return gameMode === GameMode.MONKEY_DO; };
};

MW.Game.prototype = new MW.GlobalObject("MonkeyWorld.Game");