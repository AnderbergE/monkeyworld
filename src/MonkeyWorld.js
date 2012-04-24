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

	var evm = new GameEventManager(stage);
	var gamerPlayer = new GamerPlayer(evm);
	var monkeyPlayer = new MonkeyPlayer(evm);
	var angelPlayer = new AngelPlayer(evm);

	var ggv = new GeneralGameView(evm, stage, gameState);
	ggv.init();

	var noModule = new NoModule();
	var modelModule = noModule;
	
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
				});
			});
		}
		};
	}();
	evm.on("Game.showBig", function(msg) {
		bigText.show(msg.text);
	}, "game");
	
	evm.on("Game.hideBig", function(msg) {
		bigText.hide();
	}, "game");
	
	stage.onFrame(function(frame) {
		fps.showFps(frame); // Update FPS display
		evm.tell("frame", {frame:frame});
		modelModule.onFrame(frame);
		gameLayer.draw();
		if (stage._drawOverlayLayer) {
			overlayLayer.draw();
			stage._drawOverlayLayer = false;
		}
		Tween.tick(frame.timeDiff, false);
	});
	stage.start();
	
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

		
		Log.debug("Creating model...", "game");
		var l_model = new iModel(evm, gameState, config);
		Log.debug("Initiating model...", "game");
		l_model.init();
		if (player != null) {
			Log.debug("Requesting player to play...", "game");
			l_model.play(player, evm, config);
		}


		new iView(evm, stage, gameState, l_model);
		evm.tell("Game.initiate");
		evm.tell("view.initiated");
		l_model.start();
		modelModule = l_model;
		evm.tell("Game.start");
		gameLayer.moveToTop();
		overlayLayer.moveToTop();
	};
	
	function killActiveModule() {
		modelModule.resetMistake();
		modelModule.resetActions();
		modelModule = noModule;
		evm.tell("Game.tearDown");
		//evm.print();
	};
	
	evm.tell("Game.loading");
	SoundJS.addBatch(soundSources);
	Log.debug("Loading sounds...", "sound");
	loadImages(function() {
	SoundJS.onLoadQueueComplete = function() {
		evm.tell("Game.loadingDone");
			/*
			 * ONLY_FISHING = true will start the fishing game immediately. If it
			 * is set to false, the game will start from the beginning (i.e. like
			 * it is supposed to do in a live setting.
			 */
			/** @const */ var ONLY_FISHING = true;
			
			if (ONLY_FISHING) {
				kickInModule(FishingView, FishingGame, {result: gameState.getResults(), maxNumber: 9, numberFishes: 5});
			} else {
				evm.tell("Game.eatBananas");
			}
		};
	});
	
	evm.on("Game.setMode", function(msg) {
		gameState.setMode(msg.mode);
	}, "game");
	
	evm.on("Game.nextRound", function(msg) {
		if (gameState.getMode() == GameMode.CHILD_PLAY) {
			var done = function() {
				kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});
			};
			var readyToTeach = function() {
				gameState.setMode(GameMode.MONKEY_SEE);
				evm.tell("Game.getBanana", { callback: done });
			};
			var notReadyToTeach = function() {
				done();
			};
			evm.tell("Game.readyToTeach", { yes: readyToTeach, no: notReadyToTeach });
		} else if (gameState.getMode() == GameMode.MONKEY_SEE) {
			gameState.pushResult(modelModule.getActions());
			if (modelModule.madeMistake()) {
				gameState.reportMistake();
			}
			modelModule.resetActions();
			if (gameState.getMonkeySeeRounds() < gameState.getMaxMonkeySeeRounds()) {
				gameState.addMonkeySeeRound();
				kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});
			} else {
				killActiveModule();
				gameState.setMode(GameMode.MONKEY_DO);
				evm.play(Sounds.THANK_YOU_FOR_HELPING);
				evm.tell("Game.thankYouForHelpingMonkey", { callback: function() {
					if (!gameState.hasSeeBanana()) {
						gameState.gotSeeBanana();
						evm.tell("Game.getBanana", { callback: function() {
							kickInModule(FishingView, FishingGame, {result:gameState.getResults()[gameState.getMonkeyDoRounds()-1], maxNumber: 9, numberFishes: 5});
						}});
					} else {
						kickInModule(FishingView, FishingGame, {result:gameState.getResults()[gameState.getMonkeyDoRounds()-1], maxNumber: 9, numberFishes: 5});
					}
				}});
			}
		} else if (gameState.getMode() == GameMode.MONKEY_DO) {
			if (gameState.getMonkeyDoRounds() < gameState.getMaxMonkeyDoRounds()) {
				gameState.addMonkeyDoRound();
				kickInModule(FishingView, FishingGame, {result:gameState.getResults()[gameState.getMonkeyDoRounds()-1], maxNumber: 9, numberFishes: 5});
			} else {
				killActiveModule();
				if (!gameState.madeMistake()) {
					evm.tell("Game.showHappySystemConfirmation", { callback: function() {
						evm.tell("Game.getBanana", { callback: function() {
							setTimeout(function() {
								evm.tell("Game.getBanana", { callback: function() {
									setTimeout(function() {
										evm.tell("Game.eatBananas");
									}, 1500);
								}});
							}, 200);	
						}});
					}});
				} else {
					evm.tell("Game.showSadSystemConfirmation", { callback: function() {
						if (gameState.timeForHelp()) {
							gameState.resetMistakes();
							gameState.setMode(GameMode.GUARDIAN_ANGEL);
							evm.tell("Game.introduceBubba", { callback: function() {
								kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});	
							}});
						} else {
							gameState.addNoHelpRound();
							gameState.setMode(GameMode.MONKEY_SEE);
							gameState.resetMonekyRounds();
							kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});
						}
					}});
				}
			}
		} else if (gameState.getMode() == GameMode.GUARDIAN_ANGEL) {
			gameState.resetMonekyRounds();
			gameState.resetHelpRounds();
			gameState.setMode(GameMode.MONKEY_SEE);
			kickInModule(FishingView, FishingGame, {maxNumber: 9, numberFishes: 5});
		}
	}, "game");
	evm.on("Game.startGame", function(msg) {
		//set mode to msg.mode?
		kickInModule(msg.view, msg.model, {maxNumber: 9, numberFishes: 5});
	}, "game");
}

