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
	
	var overlayLayer = new Kinetic.Layer({
        width: WIN_WIDTH,
        height: WIN_HEIGHT
	});
	
	var gameLayer = new Kinetic.Layer({
		width: WIN_WIDTH,
        height: WIN_HEIGHT
	});

	var backgroundLayer = new Kinetic.Layer({
		width: WIN_WIDTH,
        height: WIN_HEIGHT
	});
	stage.add(backgroundLayer);
	stage.add(gameLayer);
	stage.add(overlayLayer);
	stage._subtitleLayer = gameLayer;
	stage._gameLayer = gameLayer;
	stage._backgroundLayer = backgroundLayer;
	stage._drawOverlayLayer = false;
	stage._overlayLayerDrawn = 0;
	stage._backgroundLayerDrawn = 0;
	stage.pleaseDrawOverlayLayer = function() {
		stage._drawOverlayLayer = true;	
	};
	stage._drawBackgroundLayer = false;
	stage.pleaseDrawBackgroundLayer = function() {
		stage._drawBackgroundLayer = true;	
	};
	stage._drawBackgroundLayerStop = true;
	stage.pleaseDrawBackgroundLayerUntilStop = function() {
		stage._drawBackgroundLayer = true;
		stage._drawBackgroundLayerStop = false;
	};
	stage.pleaseStopDrawBackgroundLayer = function() {
		stage._drawBackgroundLayerStop = true;
	};

	var eventManager = new GameEventManager(stage);
	var gamerPlayer = new GamerPlayer(eventManager);
	var monkeyPlayer = new MonkeyPlayer(eventManager);
	var angelPlayer = new AngelPlayer(eventManager);

	var ggv = new GeneralGameView(eventManager, stage, gameState);
	ggv.init();


	var currentModule = null;
	
	/**
	 * FPS counter module
	 */
	var fps = function() {
		var lastFps = 0;
		var fpsText = new Kinetic.Text({
			text: "",
			fontFamily: "Arial",
			textFill: "black",
			textStroke: "white",
			textStrokeWidth: 1,
			fontSize: 18,
			x: 0,
			y: 0
		});
		gameLayer.add(fpsText);
		return {
		showFps: function(frame) {
			if (lastFps == 0 || frame.time - lastFps > 10) {
				var count = Math.round(1000/frame.timeDiff);
				fpsText.setText("FPS: " + count);
				lastFps = frame.time;
			}
		}
		};
	}();
	
	/**
	 * Big Text module
	 */
	var bigText = function() {
		
		var bigShowing = null;
		
		return {
			
		hide: function() {
			bigShowing.setText("");
			stage.pleaseDrawOverlayLayer();
		},
			
		/**
		 * @param {string} text
		 */
		show: function(text) {
			if (bigShowing != null) {
				bigShowing.moveTo(gameLayer);
				stage.pleaseDrawOverlayLayer();
				bigShowing.setText(text);
				bigShowing.setPosition(stage.attrs.width/2, 150); 
			} else {
				bigShowing = new Kinetic.Text({
					x: stage.attrs.width/2,
					y: 150,
					text: text,
					fontSize: 26,
					fontFamily: "Short Stack",
					textFill: "white",
					textStroke: "black",
					align: "center",
					verticalAlign: "middle",
						scale: {x:0.001,y:0.001},
					textStrokeWidth: 1
				});
			}
			gameLayer.add(bigShowing);
			
			Tween.get(bigShowing.attrs.scale).to({x:2, y:2}, 1000).wait(3000).call(function() {
				Tween.get(bigShowing.attrs.scale).to({x: 1, y: 1}, 1000).call(function() {
				});
				Tween.get(bigShowing.attrs).to({y: 50}, 1000).call(function(){
					bigShowing.moveTo(overlayLayer);
					stage.pleaseDrawOverlayLayer();
					//overlayLayer.moveToTop();
					//dynamicOverlayLayer.dynamicRemove(bigShowing);
					//overlayLayer._drawOnce = true;
				});
			});
		}
		};
	}();
	eventManager.on("Game.showBig", function(msg) {
		bigText.show(msg.text);
	}, "game");
	
	eventManager.on("Game.hideBig", function(msg) {
		bigText.hide();
	}, "game");
	
	stage.onFrame(function(frame) {
		fps.showFps(frame); // Update FPS display
		eventManager.tell("frame", {frame:frame});
		gameLayer.draw();
		if (stage._drawOverlayLayer) {
			overlayLayer.draw();
			stage._drawOverlayLayer = false;
		}
		Tween.tick(frame.timeDiff, false);
	});
	stage.start();
	
	var currentView = null;
	/**
	 * @param iView
	 * @param iModel
	 * @param config
	 * @param {Function=} callback
	 */
	function kickInModule(iView, iModel, config, callback) {
		killActiveModule();
		var player = null;
		if (gameState.getMode() === GameMode.CHILD_PLAY || gameState.getMode() === GameMode.MONKEY_SEE) {
			player = gamerPlayer;
		} else if (gameState.getMode() === GameMode.MONKEY_DO) {
			player = monkeyPlayer;
		} else if (gameState.getMode() === GameMode.GUARDIAN_ANGEL) {
			player = angelPlayer;
		}

		
		Log.debug("Creating model...", "model");
		var model = new iModel(eventManager, gameState.getMode());
		if (model.setMode != undefined)
			model.setMode(gameState.getMode());
		if (player != null) {
			model.play(player, eventManager, config);
		}
		Log.debug("Initiating model...", "model");
		var viewConfig = model.init(config);
		
		var view = new iView(eventManager, stage, gameState);
		currentView = view;
		view.init(viewConfig, model);
		eventManager.tell("view.initiated");
		//view.start();
		paused = false;
		model.start();
	};
	
	function killActiveModule() {
		if (currentView != null)
			currentView.tearDown();
		eventManager.tell("Game.tearDown");
		//eventManager.print();
	};
	
	SoundJS.addBatch(soundSources);
	Log.debug("Loading sounds...", "sound");
	loadImages(function() {
	SoundJS.onLoadQueueComplete = function() {
	
			/*
			 * ONLY_FISHING = true will start the fishing game immediately. If it
			 * is set to false, the game will start from the beginning (i.e. like
			 * it is supposed to do in a live setting.
			 */
			/** @const */ var ONLY_FISHING = true;
			
			
			
			if (ONLY_FISHING) {
				//kickInModule(ReadyToTeachView, ReadyToTeach, null, {});
				kickInModule(FishingView, FishingGame, {result: gameState.getResults(), maxNumber: 9, numberFishes: 5});
			} else {
				kickInModule(StartView, Start, {}, function(config) {
					if (config == "login") {
						kickInModule(LoginView, Intro, {}, function() {
							kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});
						});	
					} else {
						kickInModule(NewPlayerView, NewPlayer, {}, function() {
							kickInModule(IntroView, Intro, {}, function() {
								kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});	
							});
						});	
					}
				});
			}
		};
	});
	
	eventManager.on("Game.setMode", function(msg) {
		gameState.setMode(msg.mode);
	}, "game");
	
	eventManager.on("Game.roundDone", function(msg) {
		if (gameState.getMode() == GameMode.CHILD_PLAY) {
			kickInModule(ReadyToTeachView, ReadyToTeach, {});
		} else if (gameState.getMode() == GameMode.MONKEY_SEE) {
			gameState.pushResult(msg.result);
			if (gameState.getMonkeySeeRounds() < gameState.getMaxMonkeySeeRounds()) {
				gameState.addMonkeySeeRound();
				kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});
			} else {
				gameState.setMode(GameMode.MONKEY_DO);
				eventManager.play(Sounds.THANK_YOU_FOR_HELPING);
				kickInModule(SystemMessageView, SystemMessage, {
					msg: Strings.get("THANK_YOU_FOR_HELPING"),
					callback: function() {
						eventManager.tell("Game.getBanana", { callback: function() {
							console.log("results");
							console.log(gameState.getResults());
							kickInModule(FishingView, FishingGame, {result:gameState.getResults()[gameState.getMonkeyDoRounds()-1], maxNumber: 9, numberFishes: 5});
							//gameState.clearResults();
						}});
					}
				});
			}
		} else if (gameState.getMode() == GameMode.MONKEY_DO) {
			if (gameState.getMonkeyDoRounds() < gameState.getMaxMonkeyDoRounds()) {
				gameState.addMonkeyDoRound();
				kickInModule(FishingView, FishingGame, {result:gameState.getResults()[gameState.getMonkeyDoRounds()-1], maxNumber: 9, numberFishes: 5});
			} else {
				killActiveModule();
				eventManager.tell("Game.showSystemConfirmation");
				//gameState.setMode(GameMode.???);
				// end of 
			}
		}
	}, "game");
	eventManager.on("Game.startGame", function(msg) {
		//set mode to msg.mode?
		kickInModule(msg.view, msg.model, {maxNumber: 9, numberFishes: 5});
	}, "game");
	var images = new Array();
	eventManager.on("Game.getBanana", function(msg) {
		gameState.addBanana();
        var banana = new Kinetic.Image({
        	image: images["banana-big"],
        	scale: { x: 0.001, y: 0.001 },
        	centerOffset: { x: 256, y: 256 },
        	x: stage.attrs.width / 2,
        	y: stage.attrs.height / 2
        });

        gameLayer.add(banana);
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
		overlayLayer.moveToTop();
	}, "game");
}

