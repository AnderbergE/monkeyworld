var game = null;
window["egame"] = null;
window.onload = function() {
	game = new Game(new GameState());
	window["egame"] = game;
};


WebFontConfig = {
  google: { families: [ 'Nunito::latin', 'Doppio+One::latin', 'Nobile:400,700:latin' ] }
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
//	var resizeGame = function() {
//		var w = window.innerWidth - 10;
//		var h = window.innerHeight - 10;
//		
//		var WIN_WIDTH = w;
//		var WIN_HEIGHT = WIN_WIDTH / 4 * 3;	
//		
//		if (WIN_HEIGHT > h) {
//			WIN_HEIGHT = h;
//			WIN_WIDTH = WIN_HEIGHT / 3 * 4;	
//		}
//		
//		
//		stage.attrs.width = (WIN_WIDTH);
//		stage.attrs.height = (WIN_HEIGHT);
//		if (WIN_WIDTH < w) {
//			var container = document.getElementById("container");
//			container.style.left = Math.round((w - WIN_WIDTH) / 2) + "px";
//		}
//		
//		if (WIN_HEIGHT < h) {
//			var container = document.getElementById("container");
//			container.style.top = Math.round((h - WIN_HEIGHT) / 2) + "px";
//		}
//	};
//	resizeGame();

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
	//setUpButtons();
	
	Sound.setStage(stage);
	var evm = new GameEventManager(stage);
	MW.GlobalObject.prototype.evm = evm;
	
	//ViewModule.prototype.evm = evm;
	//ViewModule.stage = stage;
	ViewModule.prototype.stage = stage;
	LadderView.prototype.stage = stage;
	LadderView.prototype.evm = evm;
	
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
		if (MW.debug)
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

	evm.on("Game.miniGameListenersInitiated Game.viewInitiated", function() {
		gameLayer.moveToTop();
		overlayLayer.moveToTop();
	}, "game");
	
	evm.tell("Game.showLoadingScreen");
	evm.tell("Game.loadingSounds");

	var sound_interval = null;
	var image_interval = null;
	Log.debug("Loading sounds...", "game");
	var doneLoadingSounds = function() {
		clearInterval(sound_interval);
		image_interval = setInterval(function() {
			evm.tell("Game.updateImageLoading", { progress: _img_progress });
		}, 50);
		Log.debug("Sounds loaded.", "game");
		evm.tell("Game.loadingImages");
		loadImages(function() {
			clearInterval(image_interval);
			evm.tell("Game.updateImageLoading", { progress: 1 });
			Log.debug("Images loaded.", "game");
//			Log.debug("Loading dummy...", "game");
//			var i = 0;
//			var dummyInterval = null;
//			var dummyUpdateFunction = function() {
//				evm.tell("Game.updateImageLoading", { progress: i/10 });
//				if (++i === 10) {
//					clearInterval(dummyInterval);
//					Log.debug("Dummy loaded.", "game");
					var wait = MW.debug ? 0 : 1000;
					setTimeout(function() {
						evm.tell("Game.loadingDone");
						monkeyWorld.start();
					}, wait);
//				}
//			};
//			dummyInterval = setInterval(dummyUpdateFunction, 400);

			/*
			 * This is where the actual game kicks in
			 */
//			monkeyWorld.start();
		});
	};
	var preload = new PreloadJS(false);
	
	preload.onComplete = doneLoadingSounds;
	preload.installPlugin(SoundJS);
	sound_interval = setInterval(function() {
		evm.tell("Game.updateSoundLoading", { progress: preload.progress });
	}, 50);
	
	preload.loadManifest(soundSources);
	
	this.restart = function() {
		monkeyWorld.restart();
	};
}

