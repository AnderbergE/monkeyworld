// To prevent SoundJS producing error message. Bug in SoundJS compilation?
SoundJS.testAudioStall = function(event) {};

var game = null;
window["egame"] = null;
window.onload = function() {
	game = new Game(new GameState());
	window["egame"] = game;
};


var WebFontConfig = {
  google: { families: [ 'Nunito::latin', 'Doppio+One::latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

/**
 * @constructor
 */
function Game(gameState) {

//	/** @const */ var WIN_WIDTH = 1024;
//	/** @const */ var WIN_HEIGHT = 768;
	
	var settingsPanel = new SettingsPanel(Settings);
	
	Settings.setJSON(JSON.parse($.cookie("monkeyWorldSettings")));
	
	this["applySettings"] = function() {
		settingsPanel.apply();
		$.cookie("monkeyWorldSettings", JSON.stringify(Settings.json()));
	};
	
	this["hideSettings"] = function() {
		settingsPanel.hide();
	};
	
	this["showSettings"] = function() {
		settingsPanel.show();
	};
	
	var stageConfig = {
        container: 'container',
        width: 1024,
        height: 768
	};
	var stage = new Kinetic.Stage(stageConfig);
console.log("defined stage");
	var resizeGame = function() {
		var w = window.innerWidth - 10;
		var h = window.innerHeight - 10;
		
		var WIN_WIDTH = w;
		var WIN_HEIGHT = WIN_WIDTH / 4 * 3;	
		
		if (WIN_HEIGHT > h) {
			WIN_HEIGHT = h;
			WIN_WIDTH = WIN_HEIGHT / 3 * 4;	
		}
		
		
		stage.attrs.width = (WIN_WIDTH);
		stage.attrs.height = (WIN_HEIGHT);
		if (WIN_WIDTH < w) {
			var container = document.getElementById("container");
			container.style.left = Math.round((w - WIN_WIDTH) / 2) + "px";
		}
		
		if (WIN_HEIGHT < h) {
			var container = document.getElementById("container");
			container.style.top = Math.round((h - WIN_HEIGHT) / 2) + "px";
		}
	};
	
	//resizeGame();
	stage._mwunit = stage.getWidth() / 1024;
	
	/* ===== Layers ==========================================================*/
	/** @type {Kinetic.Layer} */ var backgroundLayer = new Kinetic.Layer();
	/** @type {Kinetic.Layer} */ var gameLayer       = new Kinetic.Layer();
	/** @type {Kinetic.Layer} */ var overlayLayer    = new Kinetic.Layer();
	
	stage.add(backgroundLayer);
	stage.add(gameLayer);
	stage.add(overlayLayer);
	
	/** @private */ stage._backgroundLayer = backgroundLayer;
	/** @private */ stage._gameLayer = gameLayer;
	/** @private */ stage._overlayLayer = overlayLayer;
	
	/** @private */ stage._subtitleLayer = gameLayer;
	
	/** @return {Kinetic.Layer} */ stage.getDynamicLayer = function() { return this._gameLayer; };
	/** @return {Kinetic.Layer} */ stage.getBackgroundLayer = function() { return this._backgroundLayer; };
	/** @return {Kinetic.Layer} */ stage.getOverlayLayer = function() { return this._overlayLayer; };
	
	stage._drawOverlayLayer = false;
	stage._overlayLayerDrawn = 0;
	stage._backgroundLayerDrawn = 0;

	stage.pleaseDrawOverlayLayer = function() {
		stage._drawOverlayLayer = true;
	};


	
	var settingsButton = null;
	var restartButton = null;
	var that = this;

	function setUpButtons() {
		if (settingsButton != null) gameLayer.remove(settingsButton);
		if (restartButton != null) gameLayer.remove(restartButton);
		gameLayer.add((settingsButton = new Kinetic.Button({
			x: stage.getWidth() - 100 * stage._mwunit,
			y: 3,
			width: 100 * stage._mwunit,
			height: 20 * stage._mwunit,
			fontSize: 11 * stage._mwunit,
			text: Strings.get("SETTINGS"),
			callback: function() {
				that["showSettings"]();
			}
		})));
		gameLayer.add((restartButton = new Kinetic.Button({
			x: stage.getWidth() - 203 * stage._mwunit,
			y: 3,
			width: 100 * stage._mwunit,
			height: 20 * stage._mwunit,
			fontSize: 11 * stage._mwunit,
			text: Strings.get("RESTART"),
			callback: function() {
				//TODO: move this
				that.restart();
			}
		})));
	}
	setUpButtons();
	
	Sound.setStage(stage);
	var evm = new GameEventManager(stage);
	MW.GlobalObject.prototype.evm = evm;
	
	//ViewModule.prototype.evm = evm;
	//ViewModule.stage = stage;
	ViewModule.prototype.stage = stage;
	LadderView.prototype.stage = stage;
	LadderView.prototype.evm = evm;
	
	//StageHandler.setStage(stage);
	console.log("set stage");
	
//	var gamerPlayer = new GamerPlayer();
//	var monkeyPlayer = new MonkeyPlayer();
//	var angelPlayer = new AngelPlayer();

	/** @type {MW.Game} */
	var monkeyWorld = new MW.Game(true, Ladder);
	MW.GlobalObject.prototype.game = monkeyWorld;
	LadderView.prototype.game = monkeyWorld;
	new MonkeyWorldView(stage, gameState, monkeyWorld);

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
//		killActiveModule();
//		var player = null;
//		if (gameState.getMode() === GameMode.CHILD_PLAY || gameState.getMode() === GameMode.MONKEY_SEE) {
//			player = gamerPlayer;
//		} else if (gameState.getMode() === GameMode.MONKEY_DO) {
//			player = monkeyPlayer;
//		} else if (gameState.getMode() === GameMode.GUARDIAN_ANGEL) {
//			player = angelPlayer;
//		}
//
//		
//		Log.debug("Creating model...", "game");
//		var l_model = new iModel(gameState);
//		Log.debug("Initiating model...", "game");
//		if (player != null) {
//			Log.debug("Requesting player to play...", "game");
//			if (gameState.getMode() === GameMode.MONKEY_DO) {
//				l_model.play(player, gameState.getResults()[gameState.getMonkeyDoRounds()-1]);
//			} else {
//				l_model.play(player);
//			}
//		}
//
//
//		new iView(gameState, l_model).setup();
//		evm.tell("Game.initiate");
//		l_model.start();
//		modelModule = l_model;
//		evm.tell("Game.start");
//		gameLayer.moveToTop();
//		overlayLayer.moveToTop();
	};

	evm.on("Game.miniGameListenersInitiated", function() {
		gameLayer.moveToTop();
		overlayLayer.moveToTop();
	}, "game");
	
	function killActiveModule() {
//		console.log("killActiveModule");
//		modelModule.tearDown();
//		modelModule.resetMistake();
//		modelModule.resetActions();
//		modelModule = noModule;
//		evm.tell("Game.tearDown");
//		evm.tell("Game.viewTearDown");
//		evm.print();
	};
	evm.tell("Game.loadingSounds");

	var sound_interval = null;
	var image_interval = null;
	Log.debug("Loading sounds...", "Game");
	var doneLoadingSounds = function() {
		clearInterval(sound_interval);
		image_interval = setInterval(function() {
			evm.tell("Game.updateImageLoading", { progress: _img_progress });
		}, 50);
		Log.debug("Sounds loaded.", "game");
		evm.tell("Game.loadingImages");
		loadImages(function() {
			evm.tell("Game.loadingDone");
			clearInterval(image_interval);
			
			/*
			 * This is where the actual game kicks in
			 */
			monkeyWorld.start();
		});
	};
	var preload = new PreloadJS(false);
	
	preload.onComplete = doneLoadingSounds;
	preload.installPlugin(SoundJS);
	sound_interval = setInterval(function() {
		evm.tell("Game.updateSoundLoading", { progress: preload.progress });
	}, 50);
	
	preload.loadManifest(soundSources);
	
	
	
	evm.on("Game.setMode", function(msg) {
		gameState.setMode(msg.mode);
	}, "game");
	
	evm.on("Game.nextRound", function(msg) {
//		if (gameState.getMode() == GameMode.CHILD_PLAY) {
//			var done = function() {
//				kickInModule(FishingView, FishingGame, fishingGameConfig);
//			};
//			var readyToTeach = function() {
//				gameState.setMode(GameMode.MONKEY_SEE);
//				evm.tell("Game.getBanana", { callback: done });
//			};
//			var notReadyToTeach = function() {
//				done();
//			};
//			evm.tell("Game.readyToTeach", { yes: readyToTeach, no: notReadyToTeach });
//		} else if (gameState.getMode() == GameMode.MONKEY_SEE) {
//			gameState.pushResult(modelModule.getActions());
//			if (modelModule.madeMistake()) {
//				gameState.reportMistake();
//			}
//			modelModule.resetActions();
//			if (gameState.getMonkeySeeRounds() < gameState.getMaxMonkeySeeRounds()) {
//				gameState.addMonkeySeeRound();
//				kickInModule(FishingView, FishingGame, fishingGameConfig);
//			} else {
//				killActiveModule();
//				gameState.setMode(GameMode.MONKEY_DO);
//				Sound.play(Sounds.THANK_YOU_FOR_HELPING);
//				evm.tell("Game.thankYouForHelpingMonkey", { callback: function() {
//					if (!gameState.hasSeeBanana()) {
//						gameState.gotSeeBanana();
//						evm.tell("Game.getBanana", { callback: function() {
//							kickInModule(FishingView, FishingGame, fishingGameConfig);
//						}});
//					} else {
//						kickInModule(FishingView, FishingGame, fishingGameConfig);
//					}
//				}});
//			}
//		} else if (gameState.getMode() == GameMode.MONKEY_DO) {
//			if (gameState.getMonkeyDoRounds() < gameState.getMaxMonkeyDoRounds()) {
//				gameState.addMonkeyDoRound();
//				kickInModule(FishingView, FishingGame, fishingGameConfig);
//			} else {
//				killActiveModule();
//				if (!gameState.madeMistake()) {
//					evm.tell("Game.showHappySystemConfirmation", { callback: function() {
//						evm.tell("Game.getBanana", { callback: function() {
//							setTimeout(function() {
//								evm.tell("Game.getBanana", { callback: function() {
//									setTimeout(function() {
//										evm.tell("Game.eatBananas");
//									}, 1500);
//								}});
//							}, 200);	
//						}});
//					}});
//				} else {
//					evm.tell("Game.showSadSystemConfirmation", { callback: function() {
//						if (gameState.timeForHelp()) {
//							gameState.resetMistakes();
//							gameState.setMode(GameMode.GUARDIAN_ANGEL);
//							evm.tell("Game.introduceBubba", { callback: function() {
//								kickInModule(FishingView, FishingGame, fishingGameConfig);	
//							}});
//						} else {
//							gameState.addNoHelpRound();
//							gameState.setMode(GameMode.MONKEY_SEE);
//							gameState.resetMonekyRounds();
//							kickInModule(FishingView, FishingGame, fishingGameConfig);
//						}
//					}});
//				}
//			}
//		} else if (gameState.getMode() == GameMode.GUARDIAN_ANGEL) {
//			gameState.resetMonekyRounds();
//			gameState.resetHelpRounds();
//			gameState.setMode(GameMode.MONKEY_SEE);
//			kickInModule(FishingView, FishingGame, fishingGameConfig);
//		}
	}, "game");
//	evm.on("Game.startGame", function(msg) {
//		kickInModule(msg.view, msg.model, fishingGameConfig);
//	}, "game");
	
	this.restart = function() {
//		//killActiveModule();
//		gameState = new GameState();
//		kickInModule(FishingView, FishingGame, fishingGameConfig);
//		_produce_sounds();
//		setUpButtons();
//		gameState.useSettings();
		monkeyWorld.restart();
	};
}

