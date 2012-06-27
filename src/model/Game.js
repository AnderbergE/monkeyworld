/**
 * @constructor
 * @param {Function} minigameConstructor
 */
MW.MinigameHandler = function(minigameConstructor) {
	
};

/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {Kinetic.Stage} stage
 * @param {boolean=}      useViews         Defaults to true. Useful to falsify
 *                                         when testing.
 * @param {boolean=}      useAgentChooser  Defaults to true. Falsify when
 *                                         testing.
 * @param {string=}       startGame        Code of the game to begin play
 *                                         ("tree", "mountain" or "fishing").
 */
MW.Game = function(stage, useViews, useAgentChooser, startGame) {
	/** @const @type {MW.Game}      */ var that = this;
	
	this.evm = new GameEventManager(stage);
	this.stage = stage;
	this.game = this;
	
	/**
	 * @param {Function} object to create
	 * @param {*=} arg1
	 * @param {*=} arg2
	 * @param {*=} arg3
	 * @param {*=} arg4
	 */
	var newObject = function(object, arg1, arg2, arg3, arg4) {
		/*
		 * TODO: Think real hard about if this is a good way to give everyone
		 * access to the EventManager, MW.Game and Kinetic.Stage objects. If
		 * using ordinary constructors instead, this whole method is not
		 * necessary any more, since the caller can use the keyword 'new'
		 * instead.
		 */
		object.prototype.evm = that.evm;
		object.prototype.game = that;
		object.prototype.stage = stage;
		
		/*
		 * TODO: Find out how to achieve this with apply(...) instead.
		 */
		var tmp = null;
		if (arg1 === undefined)
			tmp = new object();
		else if (arg1 != undefined && arg2 === undefined)
			tmp = new object(arg1);
		else if (arg2 != undefined && arg3 === undefined)
			tmp = new object(arg1, arg2);
		else if (arg3 != undefined && arg4 === undefined)
			tmp = new object(arg1, arg2, arg3);
		else
			tmp = new object(arg1, arg2, arg3, arg4);
		return tmp;
	};
	
	/** @const @type {MiniGame}            */ var NO_MINI_GAME    = new NoMiniGame();
	/** @const @type {MW.NoMiniGameResult} */ var NO_RESULT       = new MW.NoMiniGameResult();
	/** @const @type {GamerPlayer}         */ var GAMER           = newObject(GamerPlayer);
	/** @const @type {MonkeyPlayer}        */ var AGENT           = newObject(MonkeyPlayer);
	/** @const @type {AngelPlayer}         */ var ANGEL           = newObject(AngelPlayer);
	
	/** @const @type {MW.NoLearningTrack}     */ var NO_TRACK     = new MW.NoLearningTrack();
	/** @const @type {MW.RegularLearningTrack}*/ var REGULAR_TRACK= new MW.RegularLearningTrack();
	/** @const @type {MW.MediumLearningTrack} */ var MEDIUM_TRACK = new MW.MediumLearningTrack();
	/** @const @type {MW.FastLearningTrack}   */ var FAST_TRACK   = new MW.FastLearningTrack();
	
	/** @type {MW.GameMode}                */ var gameMode        = MW.GameMode.CHILD_PLAY; 
	/** @type {MiniGame}                   */ var miniGame        = NO_MINI_GAME;
	/** @type {Function} @constructor      */ var miniGameView    = null;
	/** @type {Function}                   */ var miniGameStarter = null;
	/** @type {Player}                     */ var player          = GAMER;
	/** @type {number}                     */ var _round          = 1;
	/** @type {MW.MiniGameResult}          */ var result          = NO_RESULT;
	/** @type {number}                     */ var miniGameScore   = 0;
	
	/** @type {MW.LearningTrack}              */ var _learningTrack  = REGULAR_TRACK;

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
	//this.on("frame", function(msg) { miniGame.onFrame(msg.frame); });
	if (useViews) newObject(MonkeyWorldView);

	
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
		    (gameMode === MW.GameMode.AGENT_SEE ||
		     gameMode === MW.GameMode.AGENT_DO)) {
			throw "MonkeyWorld.MiniGameRoundOverMaxLimit";
		} else if (round < 1){
			throw "MonkeyWorld.MiniGameRoundUnderMinLimit";
		} else {
			_round = round; 
		}
	};
	
	/**
	 * @param {MW.LearningTrack} learningTrack
	 */
	var setLearningTrack = function(learningTrack) {
		_learningTrack = learningTrack;
		that.tell(MW.Event.LEARNING_TRACK_UPDATE, { learningTrack: learningTrack });
	};
	
	/**
	 * @returns {MW.LearningTrack}
	 */
	var getLearningTrack = function() {
		return _learningTrack;
	}
	
	/**
	 * Add one round to the current mini game
	 */
	var addRound = function() {
		setRound(_round + 1);
	};
	
	/**
	 * Set the current minigame score to <code>score</code>.
	 */
	var setMinigameScore = function(score) {
		console.log("setMinigameScore" + score)
		miniGameScore = score;
		console.log("setMinigameScore" + miniGameScore)
		that.tell(MW.Event.BACKEND_SCORE_UPDATE_MINIGAME, { score: miniGameScore });
	};
	
	/**
	 * Add <code>score</code> to the current minigame's total scoring. 
	 */
	var addMinigameScore = function(score) {
		setMinigameScore(miniGameScore + score);
	};
	
	/**
	 * Calculate what the next game mode, round and player should be.
	 */
	var getNextState = function() {
		if (gameMode === MW.GameMode.CHILD_PLAY) {
			gameMode = MW.GameMode.AGENT_SEE;
			startMiniGame();
		} else if (gameMode === MW.GameMode.AGENT_SEE) {
			var _result = miniGame.getResult();
			result.pushResult(_result);
			gameMode = MW.GameMode.AGENT_DO;
			player = AGENT;
			startMiniGame();
		} else if (gameMode === MW.GameMode.AGENT_DO) {
			if (_round === Settings.get("global", "monkeySeeRounds")) {
				setRound(1);
				gameMode = MW.GameMode.CHILD_PLAY;
				player = GAMER;
				stopMiniGame();
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
						console.log("NYTT SPEL");
						miniGame = newObject(choice.game);
						miniGameView = choice.view;					
					};
					callback();
				},
				games: gameLibrary
			});
		} else {
			miniGameStarter = function() {
				miniGame = newObject(gameLibrary[startGame].game);
				console.log("NYTT SPEL " + miniGame.getBackendScore());
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
			var v = newObject(miniGameView, miniGame);
			v._setup();
			v.setup();
			that.tell("Game.miniGameListenersInitiated");
		}
		that.tell("Game.initiate");
		that.tell(MW.Event.MINIGAME_INITIATED);
		if (gameMode === MW.GameMode.AGENT_DO) {
			miniGame.play(player, result.getResult(_round).getActions());
		} else {
			miniGame.play(player);
		}
		that.tell("Game.start", {}, true);
		that.tell(MW.Event.MINIGAME_STARTED, {}, true);
	};
	
	/**
	 * Stop the current mini game.
	 */
	var stopMiniGame = function() {
		that.tell("Game.stopMiniGame");
		miniGame.stop();
		delete miniGame;
		miniGameScore = 0;
		miniGame = NO_MINI_GAME;
		that.tell(MW.Event.MINIGAME_ENDED);
	};

	/*========================================================================*/
	/*=== PUBLIC =============================================================*/
	/*========================================================================*/
	
	/**
	 * Tell the game that a mini game has finished
	 */
	this.miniGameDone = function() {
		if (miniGame === NO_MINI_GAME) {
			throw "MonkeyWorld.NoActiveMiniGameException";
		}
		this.tell("Game.stopMiniGame", {}, true);
		addMinigameScore(miniGame.getBackendScore());
		getNextState();
	};
	
	/**
	 * Get the current game mode.
	 * @return {MW.GameMode}
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
	 * Get the current score.
	 * @return {number}
	 */
	this.getScore = function() {
		return miniGameScore;
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
//			minigameHandler = newObject(MW.MinigameHandler);
			if (useViews) newObject(MW.MinigameHandlerView);
			chooseMiniGame(function() {
				setMinigameScore(0);
				setLearningTrack(REGULAR_TRACK);
				startMiniGame();
			});
		};
		if (useAgentChooser) {
			chooser = newObject(MW.AgentChooser, function(agent) {
				chooser.tearDown();
				_start(agent);
			});
			if (useViews) {
				newObject(MW.AgentChooserView, chooser).setup();
				that.tell("Game.viewInitiated");
			}
		} else {
			_start(MW.Images.MONKEY);
		}
	};
	
	/**
	 * Stops the Monkey World game
	 */
	this.stop = function() {
		stopMiniGame();
		gameMode = MW.GameMode.CHILD_PLAY;
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
	 */
	this.playerIsAgent = function() { return player === AGENT; };
	
	/**
	 * Returns true if the current player is the guardian angel.
	 * @return {boolean}
	 */
	this.playerIsAngel = function() { return player === ANGEL; };

	/** @return {boolean} true if the current mode is Child Play */
	this.modeIsChild = function() { return gameMode === MW.GameMode.CHILD_PLAY; };
	
	/** @return {boolean} true if the current mode is Agent See */
	this.modeIsAgentSee = function() { return gameMode === MW.GameMode.AGENT_SEE;};
	
	/** @return {boolean} true if the current mode is Agent Do */
	this.modeIsAgentDo = function() { return gameMode === MW.GameMode.AGENT_DO; };
	
};

MW.Game.prototype = new MW.GlobalObject("MonkeyWorld.Game");