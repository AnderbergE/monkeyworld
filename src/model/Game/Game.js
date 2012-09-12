/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {Kinetic.Stage} stage
 * @param {boolean=}      useViews         Defaults to true. Useful to falsify
 *                                         when testing.
 * @param {boolean=}      useAgentChooser  Defaults to true. Falsify when
 *                                         testing.
 * @param {Object=}       startGame        
 */
MW.Game = function(stage, useViews, useAgentChooser, startGame) {
	/** @const @type {MW.Game}      */ var that = this;
	MW.GlobalObject.call(this, "Game");
	this.evm = new MW.EventManager();
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
		 * TODO: Think real hard about if this is a good way to give
		 * everyone access to the EventManager, MW.Game and
		 * Kinetic.Stage objects. If using ordinary constructors
		 * instead, this whole method is not necessary any more, since 
		 * the caller can use the keyword 'new' instead.
		 */
		object.prototype.evm = that.evm;
		object.prototype.game = that;
		
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

	/**
	 * @constructor
	 * @param {Object} configuration
	 * @param {MW.LearningTrack} learningTrack
	 */
	MW.MinigameLauncher = function(configuration, learningTrack) {
		var _configuration = configuration;
		var _learningTrack = learningTrack;
		this.getConfiguration = function() { return _configuration; };
		this.getLearningTrack = function() { return _learningTrack; };
	};

	var
		/** @const @type {MW.Minigame} */
		NO_MINI_GAME    = null,
		/** @const @type {MW.NoMiniGameResult} */
		NO_RESULT       = new MW.NoMiniGameResult();
	/** @const @type {MW.GamerPlayer}         */ var GAMER           = newObject(MW.GamerPlayer);
	/** @const @type {MW.AgentPlayer}        */ var AGENT           = newObject(MW.AgentPlayer);
	
	/** @const @type {MW.NoLearningTrack}     */ var NO_TRACK     = new MW.NoLearningTrack();
	/** @const @type {MW.RegularLearningTrack}*/ var REGULAR_TRACK= new MW.RegularLearningTrack();
	/** @const @type {MW.MediumLearningTrack} */ var MEDIUM_TRACK = new MW.MediumLearningTrack();
	/** @const @type {MW.FastLearningTrack}   */ var FAST_TRACK   = new MW.FastLearningTrack();
	
	/** @type {MW.GameMode}                */ var gameMode        = MW.GameMode.CHILD_PLAY; 
	/** @type {MW.Minigame}                */ var miniGame        = NO_MINI_GAME;
	/** @type {Function} @constructor      */ var miniGameView    = null;
	                                          var currentMiniGameView = null;
	                                          var miniGameHandlerView = null;
	/** @type {Function}                   */ var miniGameStarter = null;
	/** @type {MW.Player}                  */ var player          = GAMER;
	/** @type {number}                     */ var _round          = 1;
	/** @type {MW.MiniGameResult}          */ var result          = NO_RESULT;
	/** @type {number}                     */ var miniGameScore   = 0;
	                                          var currentConfiguration = null;
	                                          var waterDrops      = 0;
	                                          var gardenVerdure   = 0;
	                                          var agentView       = null;
	
	/** @type {MW.LearningTrack}           */ var _learningTrack  = NO_TRACK;
	/** @type {Array.<MW.MinigameLauncher>} */ var minigameArray = new Array();


	if (startGame != undefined) {
		var h = new MW.MinigameLauncher(startGame, REGULAR_TRACK);
		minigameArray.push(h);
	}
	
	/*====================================================================*/
	/*=== CONSTRUCTOR ====================================================*/
	/*====================================================================*/
	
	if (useViews === undefined) useViews = true;
	if (useAgentChooser === undefined) useAgentChooser = true;
	//this.on("frame", function(msg) { miniGame.onFrame(msg.frame); });
	if (useViews)
		newObject(MW.MonkeyWorldView, stage);

	
	/*====================================================================*/
	/*=== PRIVATE ========================================================*/
	/*====================================================================*/
	
	/**
	 * Set the current round to specified number. It is recommended to use
	 * this function above accessing the _round variable directly, since
	 * this function will make boundary checks. It throws an exception if
	 * the upper or lower round boundary is violated. 
	 * @param {number} round
	 */
	var setRound = function(round) {
		if (round > 1 &&
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
		that.tell(MW.Event.LEARNING_TRACK_UPDATE, {
			learningTrack: learningTrack
		});
	};

	/**
	 * @returns {MW.LearningTrack}
	 */
	var getLearningTrack = function() {
		return _learningTrack;
	};

	/**
	 * Add one round to the current mini game
	 */
	var addRound = function() {
		setRound(_round + 1);
	};

	/**
	 * Decide when it's time and how to play the current game next time.
	 */
	var decideNextOfSameGame = function(config, score) {
		if (score > 26 && score <= 30) {
			//reps = 2;
			// TODO: randomize this push
			minigameArray.push(new MW.MinigameLauncher(config, FAST_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, FAST_TRACK));
		} else if (score > 22 && score <= 26 ) {
			//reps = 3;
			// TODO: randomize this push
			minigameArray.push(new MW.MinigameLauncher(config, MEDIUM_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, MEDIUM_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, MEDIUM_TRACK));
		} else if (score >= 0 && score <= 22) {
			//reps = 5;
			// TODO: randomize this push
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config.category.variations[0], REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
		} else {
			throw "MW.NoSuchMinigameScore";
		}
	};
	
	/**
	 * Set the current minigame score to <code>score</code>.
	 */
	var setMinigameScore = function(score) {
		miniGameScore = score;
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
			setRound(1);
			gameMode = MW.GameMode.CHILD_PLAY;
			player = GAMER;
			stopMiniGame();
			decideNextOfSameGame(currentConfiguration, miniGameScore);
			selectMinigame();
		}
	};
	
	var selectMinigame = function() {
		result = new MW.MiniGameResult();
		player = GAMER;
		gameMode = MW.GameMode.CHILD_PLAY;
//		gameMode = MW.GameMode.AGENT_SEE;

		chooseMiniGame(function() {
			if (useViews) {
				miniGameHandlerView = newObject(MW.MinigameHandlerView, stage);
				miniGameHandlerView.setup();
			}
			setMinigameScore(0);
			startMiniGame();
		});
	};
	
	var chooseMiniGame = function(callback) {
		if (minigameArray.length > 0) {
			var launcher = minigameArray[0];
			minigameArray.splice(0);
			var configuration = launcher.getConfiguration();
			currentConfiguration = configuration;
			miniGameStarter = function() {
				miniGame = newObject(configuration.game);
				miniGameView = configuration.view;
			};
			callback();
			setLearningTrack(launcher.getLearningTrack());
		} else if (startGame === undefined) {
			that.tell("Game.showMiniGameChooser", {
				callback: function(choice) {
					currentConfiguration = choice;
					miniGameStarter = function() {
						that.tell("Game.hideMiniGameChooser");
						miniGame = newObject(choice.game);
						miniGameView = choice.view;					
					};
					callback();
					setLearningTrack(REGULAR_TRACK);
				},
				games: MW.MinigameConfiguration
			});
		}
	};
	
	/**
	 * Start the current mini game.
	 */
	var startMiniGame = function() {
		miniGameStarter();
		miniGame.setup();
		if (useViews) {
			currentMiniGameView = newObject(miniGameView, stage, miniGame);
			currentMiniGameView.setup();
			that.tell("Game.miniGameListenersInitiated");
		}
		that.tell(MW.Event.MINIGAME_INITIATED, {});
		var todo = function () {
			if (gameMode === MW.GameMode.AGENT_DO) {
				var actions = result.getResult(_round).getActions();
				miniGame.play(player, actions);
			} else {
				miniGame.play(player);
			}

			that.tell(MW.Event.MINIGAME_STARTED, {});
		};
		if (useViews) {
			that.tellWait(MW.Event.INTRODUCE_AGENT, todo);
		} else {
			todo();
		}
	};
	
	/**
	 * Stop the current mini game.
	 */
	var stopMiniGame = function () {
		that.tell("Game.stopMiniGame");
		if (useViews)
			miniGameHandlerView.tearDown();
		miniGame.stop();
		miniGame.tearDown();
		delete miniGame;
		miniGameScore = 0;
		miniGame = NO_MINI_GAME;
		that.tell(MW.Event.MINIGAME_ENDED);
	};

	/**
	 * @param {Function=} callback
	 */
	var waterGarden = function (callback) {
		var afterWatering = function () {
			gardenVerdure += waterDrops;
			waterDrops = 0;
			that.tell(MW.Event.PITCHER_LEVEL_RESET);
			gardenView.tearDown();
			that.tell(MW.Event.GARDEN_WATERED);
			if (callback != undefined)
				callback();
		};
		if (useViews) {
			var gardenView = newObject(MW.GardenView, stage);
			gardenView.setup();
			that.tell(MW.Event.WATER_GARDEN, {
				callback: function () {
					afterWatering();
				}
			});
		} else {
			afterWatering();
		}
	};
	
	var demonstrateGarden = function (callback) {
		if (useViews && !MW.GlobalSettings.debug) {
			var gardenView = newObject(MW.GardenView, stage);
			gardenView.setup();
			that.tell("Game.viewInitiated");
			that.tell("Game.demonstrateGarden", {
				callback: function () {
					gardenView.tearDown();
					callback();				
				}
			});
		} else {
			callback();
		}
	};

	var playIntroduction = function (callback) {
		if (useViews && !MW.GlobalSettings.debug) {
			var introductionView = newObject(
				MW.IntroductionView,
				stage,
				function (skipGarden) {
					if (!skipGarden) {
						introductionView.tearDown();
						demonstrateGarden(callback);
					} else {
						introductionView.tearDown();
						callback();
					}
				}
			);
			introductionView.setup();
			that.tell("Game.viewInitiated");
		} else {
			demonstrateGarden(callback);
		}
	};

	/*====================================================================*/
	/*=== PUBLIC =========================================================*/
	/*====================================================================*/
	
	/**
	 * Tell the game that a mini game has finished
	 */
	this.miniGameDone = function() {
		if (miniGame === NO_MINI_GAME) {
			throw {
				name: "MonkeyWorld.NoActiveMiniGameException",
				message: "There is no active minigame"
			};
		}
		if (useViews) {
			currentMiniGameView.tearDown();
		}
		//miniGame.tearDown();
		addMinigameScore(miniGame.getBackendScore());
		//that.evm.print();
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
	
	this.getAgentView = function () {
		return agentView;
	};
	
	/**
	 * Start the Monkey World game
	 */
	this.start = function() {
		var chooser = null;
		var chooserView = null;
		
		playIntroduction(/* then */function () {
			if (useAgentChooser) {
				chooser = newObject(
					MW.AgentChooser,
					function(agent) {
						chooser.tearDown();
						if (chooserView != null)
							chooserView.tearDown();
						agentView = new agent.view();
						selectMinigame();
					}
				);
				if (useViews) {
					chooserView = newObject(MW.AgentChooserView, stage, chooser);
					chooserView.setup();
					that.tell("Game.viewInitiated");
				}
			} else {
				agentView = new MW.MouseAgentView();
				selectMinigame();
			}
		});
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

	this.addWaterDrop = function (callback) {
		that.tell(MW.Event.PITCHER_LEVEL_ADD_BEFORE);
		that.tell(MW.Event.PITCHER_LEVEL_ADD, { callback: function () {
			if (waterDrops === 6) {
				waterGarden(callback);
			} else {
				if (callback != undefined)
					callback();
			}
		}});
		waterDrops += 1;
	};

	this.getWaterDrops = function () {
		return waterDrops;
	};

	this.getGardenVerdure = function () {
		return gardenVerdure;
	};

	/**
	 * Returns the current mini game.
	 * @return {MW.Minigame}
	 */
	this.getMiniGame = function() {
		return miniGame;
	};

	this.setAgentAsPlayer = function() {
		player = AGENT;
	};

	this.setGamerAsPlayer = function() {
		player = GAMER;
	};

	/**
	 * Returns true if the current player is the gamer.
	 * @return {boolean}
	 */
	this.playerIsGamer = function() {
		return player === GAMER;
	};

	/**
	 * Returns true if the current player is the teachable agent.
	 * @return {boolean}
	 */
	this.playerIsAgent = function() {
		return player === AGENT;
	};

	/** @return {boolean} true if the current mode is Child Play */
	this.modeIsChild = function() {
		return gameMode === MW.GameMode.CHILD_PLAY;
	};

	/** @return {boolean} true if the current mode is Agent See */
	this.modeIsAgentSee = function() {
		return gameMode === MW.GameMode.AGENT_SEE;
	};

	/** @return {boolean} true if the current mode is Agent Do */
	this.modeIsAgentDo = function() {
		return gameMode === MW.GameMode.AGENT_DO;
	};
};

