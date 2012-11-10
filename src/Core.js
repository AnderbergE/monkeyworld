/*----------------------------------------------------------------------------*
 * Core.js                                                                    *
 * General boot strap for the engine. Loads resources (images and sound files)*
 * and finally starts the game engine.                                        *
 *----------------------------------------------------------------------------*/

/**
 * When all .js files are done downloading to the client, we start the boot
 * of the game engine:
 */
window.onload = function() {
	new MW.GameEngineStarter();
};

/**
 * Start the game engine
 * @constructor
 */
MW.GameEngineStarter = function () {
	"use strict";

	console.log("Running game engine starter");

	console.log("Creating KineticJS stage");
	var stage = new Kinetic.Stage({
		container: 'container',
		width: MW.GlobalSettings.width,
		height: MW.GlobalSettings.height
	});

	console.log("Creating basic KineticJS layers");
	var backgroundLayer = new Kinetic.Layer();
	stage.add(backgroundLayer);

	var gameLayer = new Kinetic.Layer();
	stage.add(gameLayer);

	var overlayLayer = new Kinetic.Layer();
	stage.add(overlayLayer);
	
	/** @return {Kinetic.Layer} */
	stage.getDynamicLayer = function() {
		return gameLayer;
	};

	var drawOverlayLayer = false;
	var overlayLayerDrawn = 0;
	var backgroundLayerDrawn = 0;

	stage.pleaseDrawOverlayLayer = function() {
		drawOverlayLayer = true;
	};

	console.log("Setting up game engine");
	new MW.Logger();
	var monkeyWorld = new MW.Game(stage, true);
	var evm = monkeyWorld.evm;
	
	evm.on("Game.miniGameListenersInitiated Game.viewInitiated", function() {
		gameLayer.moveToTop();
		overlayLayer.moveToTop();
	}, "game");

	/**
	 * FPS counter
	 */
	var fps = function() {
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
		var lastFps = 0;
		gameLayer.add(fpsText);
		return {
			showFps: function(frame) {
				if (frame.time - lastFps > 10 || lastFps == 0) {
					var count = Math.round(1000/frame.timeDiff);
					fpsText.setText("FPS: " + count);
					lastFps = frame.time;
				}
			}
		};
	}();
	var kineticAnimation = new Kinetic.Animation({
		func: function (frame) {
			if (MW.GlobalSettings.debug) {
				fps.showFps(frame);
				gameLayer.draw();
			}
			Tween.tick(frame.timeDiff, false);
		},
		node: gameLayer
	});
	kineticAnimation.start();

	/**
	 * Init game resources
	 */
	console.log("Showing welcome screen");
	evm.tell("Game.showLoadingScreen", { time: 1 });
	evm.tell("Game.loadingSounds");

	console.log("Downloading sound files");
	var sound_interval = null;
	var doneLoadingSounds = function() {
		clearInterval(sound_interval);
		
		console.log("Downloading image files");
		var image_interval = setInterval(function() {
			evm.tell("Game.updateImageLoading",
				{ progress: MW.ImageHandler.getProgress() });
		}, 50);
		evm.tell("Game.loadingImages");
		MW.ImageHandler.loadImages(function() {
			clearInterval(image_interval);
			evm.tell("Game.updateImageLoading", { progress: 1 });
			evm.tell("Game.loadingDone");
			console.log("Starting game engine");
			monkeyWorld.start();
		});
	};
	var preload = new PreloadJS(false);
	preload.onComplete = doneLoadingSounds;
	preload.installPlugin(SoundJS);
	sound_interval = setInterval(function() {
		evm.tell("Game.updateSoundLoading", { progress: preload.progress });
	}, 50);
	
	MW.Sound.setStage(stage);
	preload.loadManifest(MW.Sound.getSources());
};

