// To prevent SoundJS producing error message. Bug in SoundJS compilation?
SoundJS.testAudioStall = function(event) {};

window.onload = function() {
	new Game(new GameState());
};


/**
 * @constructor
 */
function Game(gameState) {

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
	 * @param {GameMode|null} mode
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
			player = monkeyPlayer;
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
				kickInModule(FishingView, FishingGame, gameState.getMode(), {maxNumber: 9, numberFishes: 5});
			} else {
				kickInModule(StartView, Start, GameMode.CHILD_PLAY, {}, function(config) {
					if (config == "login") {
						kickInModule(LoginView, Intro, null, {}, function() {
							kickInModule(FishingView, FishingGame, GameMode.CHILD_PLAY, {maxNumber: 9, numberFishes: 5});
						});	
					} else {
						kickInModule(NewPlayerView, NewPlayer, null, {}, function() {
							kickInModule(IntroView, Intro, null, {}, function() {
								kickInModule(FishingView, FishingGame, GameMode.CHILD_PLAY, {maxNumber: 9, numberFishes: 5});	
							});
						});	
					}
				});
			}

		});

	};
	
	eventManager.on("Game.setMode", function(msg) {
		gameState.setMode(msg.mode);
	}, "game");
	
	eventManager.on("Game.roundDone", function(msg) {
		if (gameState.getMode() == GameMode.CHILD_PLAY) {
			kickInModule(ReadyToTeachView, ReadyToTeach, null, {});
		} else if (gameState.getMode() == GameMode.MONKEY_SEE) {
			gameState.pushResult(msg.result);
			if (gameState.getMonkeySeeRounds() < gameState.getMaxMonkeySeeRounds()) {
				gameState.addMonkeySeeRound();
				kickInModule(FishingView, FishingGame, GameMode.MONKEY_SEE, {maxNumber: 9, numberFishes: 5});
			} else {
				gameState.setMode(GameMode.MONKEY_DO);
				eventManager.play(Sounds.THANK_YOU_FOR_HELPING);
				kickInModule(SystemMessageView, SystemMessage, null,{
					msg: Strings.get("THANK_YOU_FOR_HELPING"),
					callback: function() {
						eventManager.tell("Game.getBanana", { callback: function() {
							kickInModule(FishingView, FishingGame, GameMode.MONKEY_DO, {result:gameState.getResults()[gameState.getMonkeyDoRounds()-1], maxNumber: 9, numberFishes: 5});
							//gameState.clearResults();
						}});
					}
				});
			}
		} else if (gameState.getMode() == GameMode.MONKEY_DO) {
			if (gameState.getMonkeyDoRounds() < gameState.getMaxMonkeyDoRounds()) {
				gameState.addMonkeyDoRound();
				kickInModule(FishingView, FishingGame, GameMode.MONKEY_DO, {result:gameState.getResults()[gameState.getMonkeyDoRounds()-1], maxNumber: 9, numberFishes: 5});
			} else {
				//gameState.setMode(GameMode.???);
				// end of 
			}
		}
	}, "game");
	eventManager.on("Game.startGame", function(msg) {
		kickInModule(msg.view, msg.model, msg.mode, {maxNumber: 9, numberFishes: 5});
	}, "game");
	var images = new Array();
	eventManager.on("Game.getBanana", function(msg) {
		gameState.addBanana();
        var banana = new Kinetic.Image({
        	image: images["banana-big"],
        	scale: { x: 0.3, y: 0.3 },
        	centerOffset: { x: 256, y: 256 },
        	x: stage.attrs.width / 2,
        	y: stage.attrs.height / 2
        });

        gameLayer.add(banana);
        gameLayer.moveToTop();
        eventManager.play(Sounds.GET_BANANA);
        /*banana.transitionTo({
        	rotation: -Math.PI / 2,
			scale: {x: 2, y: 2},
			duration: 1
        });*/
        Tween.get(banana.attrs).to({rotation: Math.PI * 2}, 1000).wait(1500)
        .to({
        	rotation: -Math.PI / 2,
        	x: stage.attrs.width - 50 - (gameState.getBananas()-1)*48,
			y: 50
        }, 1000);
        
        Tween.get(banana.attrs.scale).to({ x: 2, y: 2 }, 1000).wait(1500)
        .to({
        	x: 0.125, y: 0.125
        }, 1000).call(function(){
        	banana.attrs.image = images["banana-small"];
        }).wait(1500).call(function() {msg.callback()});
	}, "game");
	
	eventManager.on("view.initiated", function(msg) {
		gameLayer.moveToTop();
	}, "game");
}

