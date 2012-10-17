/*----------------------------------------------------------------------------*
 * Core.js                                                                    *
 * General boot strap for the engine. Downloads fonts, loads resources        *
 * (images and sound files) and finally starts the game engine.               *
 *----------------------------------------------------------------------------*/

/**
 * When all .js files are done downloading to the client, we start the boot
 * of the game engine:
 */
window.onload = function() {
	new MW.GameEngineStarter();
};

/**
 * Defines Google Web Fonts to use.
 */
WebFontConfig = {
	google: {
	  	families: [
	  		'Nunito::latin',
	  		'Doppio+One::latin',
	  		'Nobile:400,700:latin',
	  		'Galindo::latin'
	  	]
	}
};

/**
 * Fetch Google Web fonts.
 */
(function() {
	var wf = document.createElement('script');
	wf.src = (
		"https:" == document.location.protocol ? "https" : "http") +
		"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
	wf.type = "text/javascript";
	wf.async = "true";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(wf, s);
})();

/**
 * @constructor
 */
MW.GameEngineStarter = function () {
	"use strict"
	var that = this;

	console.log("Running game engine starter");

	console.log("Creating KineticJS stage");
	var stage = new Kinetic.Stage({
		container: 'container',
		width: 1024,
		height: 768
	});

	console.log("Creating basic KineticJS layers");
	/** @type {Kinetic.Layer} */
	var backgroundLayer = new Kinetic.Layer();
	stage.add(backgroundLayer);

	/** @type {Kinetic.Layer} */
	var gameLayer = new Kinetic.Layer();
	stage.add(gameLayer);

	/** @type {Kinetic.Layer} */
	var overlayLayer = new Kinetic.Layer();
	stage.add(overlayLayer);	
	
	stage._subtitleLayer = gameLayer;
	
	/** @return {Kinetic.Layer} */
	stage.getDynamicLayer = function() { return gameLayer; };

	/** @return {Kinetic.Layer} */
	stage.getBackgroundLayer = function() { return backgroundLayer; };

	/** @return {Kinetic.Layer} */
	stage.getOverlayLayer = function() { return overlayLayer; };

	var drawOverlayLayer = false;
	var overlayLayerDrawn = 0;
	var backgroundLayerDrawn = 0;

	stage.pleaseDrawOverlayLayer = function() {
		drawOverlayLayer = true;
	};

	console.log("Setting up game engine");
	/** @type {MW.Game} */
	var monkeyWorld = new MW.Game(stage, true, !MW.GlobalSettings.debug);
	var evm = monkeyWorld.evm;

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
		var on = true;
		evm.on(MW.Event.TRIGGER_FPS, function () {
			if (on) {
				console.info("Turning off FPS display");
				gameLayer.remove(fpsText);
				on = false;
			} else {
				console.info("Turning on FPS display");
				gameLayer.add(fpsText);
				on = true;
			}
		}, "game");
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

	var kineticAnimation = new Kinetic.Animation({
		func: function (frame) {
			if (MW.GlobalSettings.debug)
				fps.showFps(frame);
			evm.tell("frame", {frame:frame});
			gameLayer.draw();
			if (stage._drawOverlayLayer) {
				overlayLayer.draw();
				stage._drawOverlayLayer = false;
			}
			Tween.tick(frame.timeDiff, false);
		},
		node: gameLayer
	});
	kineticAnimation.start();

	evm.on("Game.miniGameListenersInitiated Game.viewInitiated", function() {
		gameLayer.moveToTop();
		overlayLayer.moveToTop();
	}, "game");

	var initTime = MW.GlobalSettings.debug ? 0 : 2000;

	console.log("Showing welcome screen");
	evm.tell("Game.showLoadingScreen", { time: initTime });

	setTimeout(function() {
		load();
	}, initTime);

	var load = function() {
		evm.tell("Game.loadingSounds");
	
		var sound_interval = null;
		var image_interval = null;
		console.log("Downloading sound files");
		var doneLoadingSounds = function() {
			clearInterval(sound_interval);
			image_interval = setInterval(function() {
				evm.tell("Game.updateImageLoading", { progress: MW.ImageHandler.getProgress() });
			}, 50);
			evm.tell("Game.loadingImages");
			MW.ImageHandler.loadImages(function() {
				console.log("Downloading image files");
				clearInterval(image_interval);
				evm.tell("Game.updateImageLoading", { progress: 1 });
						var wait = MW.GlobalSettings.debug ? 0 : 1000;
						setTimeout(function() {
							evm.tell("Game.loadingDone");
							console.log("Starting game engine");
							monkeyWorld.start();
						}, wait);
			});
		};
		var preload = new PreloadJS(false);
		preload.onComplete = doneLoadingSounds;
		preload.installPlugin(SoundJS);
		sound_interval = setInterval(function() {
			evm.tell("Game.updateSoundLoading", { progress: preload.progress });
		}, 50);
		
		MW.Sound.setStage(stage);
		evm.on(MW.Event.TRIGGER_SUBTITLES, function () {
			MW.Sound.triggerSubtitles();
		}, "game");
		preload.loadManifest(MW.Sound.getSources());
	};
};

