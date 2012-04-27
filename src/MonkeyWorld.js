// To prevent SoundJS producing error message. Bug in SoundJS compilation?
SoundJS.testAudioStall = function(event) {};

var game = null;
window["egame"] = null;
window.onload = function() {

	
	game = new Game(new GameState());
	window["egame"] = game;
};


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
	
	document.body.style.backgroundImage = "background-image: linear-gradient(bottom, rgb(0,77,0) 24%, rgb(92,250,174) 74%, rgb(0,204,255) 87%)";
	
	resizeGame();
	stage._mwunit = stage.getWidth() / 1024;
	//window.addEventListener('resize', resizeGame, false);
	//window.addEventListener('orientationchange', resizeGame, false);

	/*c = document.getElementById("container");
	w = document.getElementById("wrapper");
	c.style.width = WIN_WIDTH;
	c.style.height = WIN_HEIGHT;
	w.style.width = WIN_WIDTH;*/
	//w.style.height = WIN_HEIGHT;
	
	var overlayLayer = new Kinetic.Layer();
	
	var gameLayer = new Kinetic.Layer();

	var backgroundLayer = new Kinetic.Layer();
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

	/**
	 * @constructor
	 * @extends {Kinetic.Shape}
	 */
	Kinetic.Button = function(config) {
		if (config.width === undefined) config.width = 100 * stage._mwunit;
		if (config.height === undefined) config.height = 20 * stage._mwunit;
		var button = new Kinetic.Group({
			x: config.x,
			y: config.y,
			width: config.width,
			height: config.height
		});
		var _rect = new Kinetic.Rect({
			x: 0, y: 0,
			width: config.width, height: config.height,
			fill: "#ccc",
			strokeWidth: 1,
			stroke: "white"
		});
		var _text = new Kinetic.Text({
			text: config.text,
			fontFamily: "Arial",
			textFill: "black",
			fontSize: 10 * stage._mwunit,
			x: config.width / 2,
			y: config.height / 2,
			verticalAlign: "middle",
			align: "center"
		});
		button.add(_rect);
		button.add(_text);
		button.on("mousedown touchstart", config.callback);
		return button;
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
			text: Strings.get("SETTINGS"),
			callback: function() {
				that["showSettings"]();
			}
		})));
		gameLayer.add((restartButton = new Kinetic.Button({
			x: stage.getWidth() - 203 * stage._mwunit,
			y: 3,
			width: 100 * stage._mwunit,
			text: Strings.get("RESTART"),
			callback: function() {
				that.restart();
			}
		})));
	}
	setUpButtons();
	
	Sound.setStage(stage);
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
				bigShowing.setPosition(stage.attrs.width/2, 150 * stage._mwunit); 
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
				Utils.scaleShape(bigShowing, stage._mwunit);
			}
			gameLayer.add(bigShowing);
			
			Tween.get(bigShowing.attrs.scale).to(Utils.scaleShape({x:2, y:2}, stage._mwunit), 1000).wait(3000).call(function() {
				Tween.get(bigShowing.attrs.scale).to(Utils.scaleShape({x: 1, y: 1}, stage._mwunit), 1000).call(function() {
				});
				Tween.get(bigShowing.attrs).to({y: 50*stage._mwunit }, 1000).call(function(){
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
		if (player != null) {
			Log.debug("Requesting player to play...", "game");
			if (gameState.getMode() === GameMode.MONKEY_DO) {
				l_model.play(player, evm, gameState.getResults()[gameState.getMonkeyDoRounds()-1]);
			} else {
				l_model.play(player, evm);
			}
		}


		new iView(evm, stage, gameState, l_model);
		evm.tell("Game.initiate");
		l_model.start();
		modelModule = l_model;
		evm.tell("Game.start");
		gameLayer.moveToTop();
		overlayLayer.moveToTop();
	};
	
	function killActiveModule() {
		modelModule.tearDown();
		modelModule.resetMistake();
		modelModule.resetActions();
		modelModule = noModule;
		evm.tell("Game.tearDown");
		evm.tell("Game.viewTearDown");
	};
	
	var fishingGameConfig = { maxNumber: 9, numberFishes: 7, targetNumber: 3, numberCorrect: 1 };
	
	evm.tell("Game.loadingSounds");
	//PreloadJS.initialize();
	

	var sound_interval = null;
	var image_interval = null;
	//SoundJS.addBatch(soundSources);
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
			 * ONLY_FISHING = true will start the fishing game immediately. If it
			 * is set to false, the game will start from the beginning (i.e. like
			 * it is supposed to do in a live setting.
			 */
			/** @const */ var ONLY_FISHING = true;
			
			if (ONLY_FISHING) {
				kickInModule(FishingView, FishingGame, fishingGameConfig);
			} else {
				evm.tell("Game.eatBananas");
			}
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
		if (gameState.getMode() == GameMode.CHILD_PLAY) {
			var done = function() {
				kickInModule(FishingView, FishingGame, fishingGameConfig);
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
				kickInModule(FishingView, FishingGame, fishingGameConfig);
			} else {
				killActiveModule();
				gameState.setMode(GameMode.MONKEY_DO);
				Sound.play(Sounds.THANK_YOU_FOR_HELPING);
				evm.tell("Game.thankYouForHelpingMonkey", { callback: function() {
					if (!gameState.hasSeeBanana()) {
						gameState.gotSeeBanana();
						evm.tell("Game.getBanana", { callback: function() {
							kickInModule(FishingView, FishingGame, fishingGameConfig);
						}});
					} else {
						kickInModule(FishingView, FishingGame, fishingGameConfig);
					}
				}});
			}
		} else if (gameState.getMode() == GameMode.MONKEY_DO) {
			if (gameState.getMonkeyDoRounds() < gameState.getMaxMonkeyDoRounds()) {
				gameState.addMonkeyDoRound();
				kickInModule(FishingView, FishingGame, fishingGameConfig);
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
								kickInModule(FishingView, FishingGame, fishingGameConfig);	
							}});
						} else {
							gameState.addNoHelpRound();
							gameState.setMode(GameMode.MONKEY_SEE);
							gameState.resetMonekyRounds();
							kickInModule(FishingView, FishingGame, fishingGameConfig);
						}
					}});
				}
			}
		} else if (gameState.getMode() == GameMode.GUARDIAN_ANGEL) {
			gameState.resetMonekyRounds();
			gameState.resetHelpRounds();
			gameState.setMode(GameMode.MONKEY_SEE);
			kickInModule(FishingView, FishingGame, fishingGameConfig);
		}
	}, "game");
	evm.on("Game.startGame", function(msg) {
		kickInModule(msg.view, msg.model, fishingGameConfig);
	}, "game");
	
	this.restart = function() {
		//killActiveModule();
		gameState = new GameState();
		kickInModule(FishingView, FishingGame, fishingGameConfig);
		_produce_sounds();
		setUpButtons();
		gameState.useSettings();
	};
	
	this.saveState = function() {
		
	};
	
	this.loadState = function() {
		
	};
}

