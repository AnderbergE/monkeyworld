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
	
	this.getBananas = function() {
		return bananas;
	}
});

/**
 * @constructor
 */
function Game() {

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
		gameLayer.draw();
		Tween.tick(frame.timeDiff, false);
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
	
		eventManager.loadImages({
			"monkey": "Gnome-Face-Monkey-64.png",
			"green": "1333364667_Circle_Green.png",
			"red": "1333364683_Circle_Red.png",
			"person-yes": "Accept-Male-User.png",
			"person-no": "Remove-Male-User.png",
			"banana-big": "1333448754_Banana.png",
			"banana-small": "1333448736_Banana64.png"
		}, images, function() {
			/*
			 * ONLY_FISHING = true will start the fishing game immediately. If it
			 * is set to false, the game will start from the beginning (i.e. like
			 * it is supposed to do in a live setting.
			 */
			/** @const */ var ONLY_FISHING = true;
			
			
			
			if (ONLY_FISHING) {
				//kickInModule(ReadyToTeachView, ReadyToTeach, null, {});
				kickInModule(FishingView, FishingGame, GameState.getMode(), {maxNumber: 9, numberFishes: 5});
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

		});

	};
	
	eventManager.on("Game.roundDone", function(msg) {
		if (GameState.getMode() == GameMode.CHILD_PLAY) {
			kickInModule(ReadyToTeachView, ReadyToTeach, null, {});
		} else if (GameState.getMode() == GameMode.MONKEY_SEE) {
			if (GameState.getMonkeySeeRounds() < 3) {
				GameState.addMonkeySeeRound();
				kickInModule(FishingView, FishingGame, GameMode.MONKEY_SEE, {maxNumber: 9, numberFishes: 5});
			} else {
				eventManager.play(Sounds.THANK_YOU_FOR_HELPING);
				kickInModule(SystemMessageView, SystemMessage, null,{
					msg: Strings.get("THANK_YOU_FOR_HELPING"),
					callback: function() {
						eventManager.tell("Game.getBanana", { callback: function() {
							// enter monkey do!
						}});
					}
				});
			}
		}
	}, "game");
	eventManager.on("Game.startGame", function(msg) {
		kickInModule(msg.view, msg.model, msg.mode, {maxNumber: 9, numberFishes: 5});
	}, "game");
	var images = new Array();
	eventManager.on("Game.getBanana", function(msg) {
		GameState.addBanana();
        var banana = new Kinetic.Image({
        	image: images["banana-big"],
        	scale: { x: 0, y: 0 },
        	centerOffset: { x: 256, y: 256 },
        	x: stage.width / 2,
        	y: stage.height / 2
        });
                
        gameLayer.add(banana);
        eventManager.play(Sounds.GET_BANANA);
        Tween.get(banana).to({rotation: Math.PI * 2}, 1000).wait(1500)
        .to({
        	rotation: -Math.PI / 2,
        	x: stage.width - 50 - (GameState.getBananas()-1)*48,
			y: 50
        }, 1000);
        
        Tween.get(banana.scale).to({ x: 2, y: 2 }, 1000).wait(1500)
        .to({
        	x: 0.125, y: 0.125
        }, 1000).call(function(){
        	banana.image = images["banana-small"];
        }).wait(1500).call(function() {msg.callback()});
	}, "game");
	
	eventManager.on("view.initiated", function(msg) {
		gameLayer.moveToTop();
	}, "game");
}

