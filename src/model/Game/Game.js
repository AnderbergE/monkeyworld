/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {Kinetic.Stage} stage
 * @param {boolean=} useViews - Defaults to true. Useful to falsify when testing.
 */
MW.Game = MW.GlobalObject.extend(
/** @lends {MW.Game.prototype} */
{
	/** @constructs */
	init: function (stage, useViews) {
		this._super("Game");
		this.game = this;
		this.stage = stage;
		this.evm = MW.EventManager;

		var
			that = this,
			/** @const @type {MW.Minigame} */
			NO_MINI_GAME = null,
			/** @type {MW.GameMode} */
			gameMode = MW.GameMode.CHILD_PLAY,
			/** @type {MW.Minigame} */
			miniGame = NO_MINI_GAME,
			/** @type {MW.MinigameView} */
			miniGameView = null,
			/** @type {MW.MinigameView} */
			currentMiniGameView = null,
			/** @type {Function} */
			miniGameStarter = null,
			/** @type {number} */
			currentConfiguration = null,
			/** @type {Array.<Object>} */
			minigameArray = new Array();
	
		/*====================================================================*/
		/*=== CONSTRUCTOR ====================================================*/
		/*====================================================================*/
	
		if (useViews === undefined) useViews = true;
		if (useViews) new MW.MonkeyWorldView(stage);
	
		/*====================================================================*/
		/*=== PRIVATE ========================================================*/
		/*====================================================================*/
	
		/**
		 * Select stacked minigame or show mini game chooser.
		 */
		var selectMinigame = function() {
			if (minigameArray.length > 0) {
				currentConfiguration = minigameArray.splice(0, 1);
				miniGameStarter = function() {
					/* TODO: Add parameters to game */
					miniGame = new currentConfiguration.game(that);
					miniGameView = currentConfiguration.view;
				};
				startMiniGame();
			} else {
				/* TODO: Do not use callbacks from views! */
				that.tell("Game.showMiniGameChooser", {
					callback: function(choice) {
						currentConfiguration = choice;
						miniGameStarter = function() {
							that.tell("Game.hideMiniGameChooser");
							/* TODO: Add parameters to game */
							miniGame = new choice.game(that);
							miniGameView = choice.view;					
						};
						startMiniGame();
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
				currentMiniGameView = new miniGameView(miniGame, stage);
				currentMiniGameView.setup();
				that.tell("Game.miniGameListenersInitiated");
			}
			that.tell(MW.Event.MINIGAME_INITIATED);
			miniGame.play();
			that.tell(MW.Event.MINIGAME_STARTED);
		};
	
		/**
		 * Stop the current mini game.
		 */
		var stopMiniGame = function () {
			if (useViews) {
				currentMiniGameView.tearDown();
			}
			miniGame.stop();
			miniGame.tearDown();
			miniGame = NO_MINI_GAME;
			miniGameScore = 0;
		};

		/*====================================================================*/
		/*=== PUBLIC =========================================================*/
		/*====================================================================*/
	
		/**
		 * Start the Monkey World game
		 * @public
		 */
		this.start = function() {
			selectMinigame();
		};

		/**
		 * Stops the Monkey World game
		 * @public
		 */
		this.stop = function() {
			stopMiniGame();
		};

		/**
		 * Restart the Monkey World game.
		 * @public
		 */
		this.restart = function() {
			this.stop();
			this.start();
		};

		/**
		 * @public
		 * @return {boolean} true if the current mode is Child play
		 */
		this.modeIsChild = function() {
			return gameMode === MW.GameMode.CHILD_PLAY;
		};

		/**
		 * @public
		 * @return {boolean} true if the current mode is Agent Watch
		 */
		this.modeIsAgentSee = function() {
			return gameMode === MW.GameMode.AGENT_WATCH;
		};

		/**
		 * @public
		 * @return {boolean} true if the current mode is Agent Act
		 */
		this.modeIsAgentDo = function() {
			return gameMode === MW.GameMode.AGENT_ACT;
		};
		
		/**
		 * Set game mode.
		 * @public
		 * @param {MW.GameMode} mode - the new game mode.
		 */
		this.setMode = function (mode) {
			var i;
			for (i = 0; i <= MW.GameMode.length; i++) {
				if (i == MW.GameMode.length) {
					throw {
						name: "MonkeyWorld.SetFaultyMode",
						message: "There is no such mode to set."
					};
				}
				if (MW.GameMode[i] == mode) {
					break;
				}
			}
			gameMode = mode;
		};
		
		this.on(MW.Event.MINIGAME_ENDED, function () {
			if (miniGame === NO_MINI_GAME) {
				throw {
					name: "MonkeyWorld.NoActiveMiniGameException",
					message: "There is no active minigame"
				};
			}
			stopMiniGame();
			selectMinigame();
		});
	}
});