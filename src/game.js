// To prevent SoundJS producing error message. Bug in SoundJS compilation?
SoundJS.testAudioStall = function(event) {};

window.onload = function() {
	new Game();
};

var GameState = new (/** @constructor */function() {
	
	var bananas = 0;
	var currentSeeRound = 1;
	var maxSeeRounds = 3;
	var mode = GameMode.CHILD_PLAY;
	
	this.addBanana = function() {
		Log.debug("Adding banana", "game");
		bananas++;
	}
	
	this.addMonkeySeeRound = function() {
		currentSeeRound++;
	}
	
	this.getMonkeySeeRounds = function() {
		return currentSeeRound;
	}
	
	this.setMode = function(imode) {
		mode = imode;
	}
	
	this.getMode = function() {
		return mode;
	}
});

/**
 * @constructor
 */
function Game() {

	//var fishingGame = new FishingGame();
	
	//fishingGame.play(monkeyPlayer, eventManager);
	
	/** @const */ var WIN_WIDTH = 1024;
	/** @const */ var WIN_HEIGHT = 768;
	var stage = new Kinetic.Stage({
        container: 'container',
        width: WIN_WIDTH,
        height: WIN_HEIGHT
    });
	
	var subtitleLayer = new Kinetic.Layer({
        width: WIN_WIDTH,
        height: WIN_HEIGHT
	});
	
	var gameLayer = new Kinetic.Layer({
		width: WIN_WIDTH,
        height: WIN_HEIGHT
	});

	stage.add(subtitleLayer);
	stage.add(gameLayer);
	stage._subtitleLayer = subtitleLayer;
	stage._gameLayer = gameLayer;


	var eventManager = new EventManager(subtitleLayer);
	var gamerPlayer = new GamerPlayer(eventManager);
	var monkeyPlayer = new MonkeyPlayer(eventManager);
	//var angelPlayer = new AngelPlayer(eventManager);
	
	stage.onFrame(function(frame) {
		eventManager.tell("frame", {frame:frame});
	});
	stage.start();
	
	var currentView = null;
	var currentModel = null;
	var started = false;
	/**
	 * @param iView
	 * @param iModel
	 * @param config
	 * @param {Function=} callback
	 */
	function kickInModule(iView, iModel, mode, config, callback) {
		if (currentView != null)
			currentView.tearDown();
		eventManager.tell("Game.tearDown");
		var view = new iView(eventManager, stage, this, callback);
		var player = null;
		if (mode === GameMode.CHILD_PLAY || mode === GameMode.MONKEY_SEE) {
			player = gamerPlayer;
		} else if (mode === GameMode.MONKEY_DO) {
			player = gamerPlayer;
		}/* else if (mode === GameMode.GUARDIAN_ANGEL) {
			player = angelPlayer;
		}*/
		var model = new Model(eventManager, view, view.init, view.start, iModel, config, player, mode);
		currentView = view;
		currentModel = model;
		view.prepare(model, model.init);
		eventManager.who("catched");
	};
	
	SoundJS.addBatch(soundSources);
	Log.debug("Loading sounds...", "sound");
	SoundJS.onLoadQueueComplete = function() {
	
		/*
		 * ONLY_FISHING = true will start the fishing game immediately. If it
		 * is set to false, the game will start from the beginning (i.e. like
		 * it is supposed to do in a live setting.
		 */
		/** @const */ var ONLY_FISHING = true;
		
		
		
		if (ONLY_FISHING) {
			kickInModule(ReadyToTeachView, ReadyToTeach, null, {});
			//kickInModule(FishingView, FishingGame, GameState.getMode(), {maxNumber: 9, numberFishes: 5});
		} else {
			kickInModule(StartView, Start, {}, function(config) {
				if (config == "login") {
					kickInModule(LoginView, Intro, {}, function() {
						kickInModule(FishingView, FishingGame, GameMode.CHILD_PLAY, {maxNumber: 9, numberFishes: 5});
					});	
				} else {
					kickInModule(NewPlayerView, NewPlayer, {}, function() {
						kickInModule(IntroView, Intro, {}, function() {
							kickInModule(FishingView, FishingGame, GameMode.CHILD_PLAY, {maxNumber: 9, numberFishes: 5});	
						});
					});	
				}
			});
		}

		

	};
	
	eventManager.on("Game.roundDone", function(msg) {
		console.log("Game.roundDone");
		if (GameState.getMode() == GameMode.CHILD_PLAY) {
			kickInModule(ReadyToTeachView, ReadyToTeach, null, {});
		} else if (GameState.getMode() == GameMode.MONKEY_SEE) {
			if (GameState.getMonkeySeeRounds() < 3) {
				GameState.addMonkeySeeRound();
				kickInModule(FishingView, FishingGame, GameMode.MONKEY_SEE, {maxNumber: 9, numberFishes: 5});
			} else {
				console.log("Well done!");
			}
		} else {
			console.log("noo");
		}
		eventManager.print();
	}, "GAME");
	eventManager.on("Game.startGame", function(msg) {
		kickInModule(msg.view, msg.model, msg.mode, {maxNumber: 9, numberFishes: 5});
	}, "GAME");
}

