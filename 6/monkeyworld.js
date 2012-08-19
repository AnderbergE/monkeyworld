var MW = {};
Kinetic.MW = {};

var game = null;

window["egame"] = null;
window.onload = function() {
	game = new Game();
	window["egame"] = game;
};


WebFontConfig = {
  google: { families: [ 'Nunito::latin', 'Doppio+One::latin', 'Nobile:400,700:latin', 'Galindo::latin' ] }
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
function Game() {

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
        width: 1010,
        height: 660
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
			text: MW.Strings.get("SETTINGS"),
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
			text: MW.Strings.get("RESTART"),
			callback: function() {
				//TODO: move this
				that.restart();
			}
		})));
	}
	//setUpButtons();
	
	/** @type {MW.Game} */
	var monkeyWorld = new MW.Game(stage, true, !MW.debug);
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
	
	stage.onFrame(function(frame) {
		if (MW.debug)
			fps.showFps(frame); // Update FPS display
		evm.tell("frame", {frame:frame});
//		modelModule.onFrame(frame);
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

	var initTime = MW.debug ? 0 : 2000;
	evm.tell("Game.showLoadingScreen", { time: initTime });
	setTimeout(function() {
		load();
	}, initTime);
	
	var load = function() {
		
		evm.tell("Game.loadingSounds");
	
		var sound_interval = null;
		var image_interval = null;
		Log.debug("Loading sounds...", "game");
		var doneLoadingSounds = function() {
			clearInterval(sound_interval);
			image_interval = setInterval(function() {
				evm.tell("Game.updateImageLoading", { progress: MW.ImageHandler.getProgress() });
			}, 50);
			Log.debug("Sounds loaded.", "game");
			evm.tell("Game.loadingImages");
			MW.ImageHandler.loadImages(function() {
				clearInterval(image_interval);
				evm.tell("Game.updateImageLoading", { progress: 1 });
				Log.debug("Images loaded.", "game");
						var wait = MW.debug ? 0 : 1000;
						setTimeout(function() {
							evm.tell("Game.loadingDone");
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
	
	this.restart = function() {
		monkeyWorld.restart();
	};
}

/**
 * @enum {string}
 */
MW.Event = {
	FRAME: "frame",
	
	TRIGGER_SUBTITLES: "TRIGGER_SUBTITLES",
	TRIGGER_SCORE:     "TRIGGER_SCORE",
	TRIGGER_FPS:       "TRIGGER_FPS",
	
	MINIGAME_INITIATED: "miniGameInitiated",
	MINIGAME_STARTED: "miniGameStarted",
	MINIGAME_ENDED: "miniGameDone",
	LEARNING_TRACK_UPDATE: "learningTrackUpdate",
	BACKEND_SCORE_UPDATE_MODE: "backendScoreUpdateMode",
	BACKEND_SCORE_UPDATE_MINIGAME: "backendScoreGameUpdateMiniGame",
	PITCHER_LEVEL_ADD_BEFORE: "setPitcherLevelBefore",
	PITCHER_LEVEL_ADD: "setPitcherLevel",
	PITCHER_LEVEL_SET_DROP_ORIGIN: "setPitcherLevelSetDropOrigin",
	PITCHER_LEVEL_RESET: "resetPitcherLevel",
	
//	MG_TREE_GAME_SET_PARCELS: "treeGameSetParcels",
	MG_LADDER_PLACE_TARGET:           "MG_LADDER_PLACE_TARGET",
	MG_LADDER_HELPER_APPROACH_TARGET: "MG_LADDER_HELPER_APPROACH_TARGET",
	MG_LADDER_PICKED:                 "Ladder.picked",
	MG_LADDER_ALLOW_INTERRUPT:        "MG_LADDER_ALLOW_INTERRUPT",
	MG_LADDER_FORBID_INTERRUPT:       "MG_LADDER_FORBID_INTERRUPT",
	MG_LADDER_READY_TO_PICK:          "Ladder.readyToPick",
	MG_LADDER_RESET_SCENE:            "Ladder.resetScene",
	MG_LADDER_GET_TARGET:             "Ladder.getTarget",
	MG_LADDER_HAS_TARGET:             "Ladder.hasTarget",
	MG_LADDER_CONFIRM_TARGET:         "Ladder.confirmTarget",
	MG_LADDER_CHEER:                  "Ladder.cheer",
	MG_LADDER_IGNORE_INPUT:           "MG_LADDER_IGNORE_INPUT",
	MG_LADDER_ACKNOWLEDGE_INPUT:      "MG_LADDER_ACKNOWLEDGE_INPUT",
	MG_LADDER_FORBID_GAMER_INPUT:     "MG_LADDER_FORBID_GAMER_INPUT",
	MG_LADDER_ALLOW_GAMER_INPUT:      "MG_LADDER_ALLOW_GAMER_INPUT",
	MG_LADDER_GET_TREAT:              "MG_LADDER_GET_TREAT",
	
	WATER_GARDEN: "Game.waterGarden",
	GARDEN_WATERED: "Game.gardenWatered"
};
/**
 * @constructor
 */
MW.EventManager = function(stage) {
	
	/**
	 * @type {Object.<string, Array>}
	 */
	var listeners = {};
	var toForget = new Array();
	var telling = 0;
	
	this.wevm = function() { return "GameEventManager"; };
	
	/**
	 * @param {string} type
	 * @param {Function} callback
	 * @param {string} name
	 */
	this.on = function(type, callback, name) {
		var types = type.split(" ");
		for (var i = 0; i < types.length; i++) {
			if (!(types[i] in listeners))
				listeners[types[i]] = new Array();
			listeners[types[i]].push(callback);
			callback._caller = name;
			var _name = name === undefined ? "unnamed" : name;
			Log.debug(_name + " registerd " + types[i], "evm");
		}
	};
	
	/**
	 * @param {string} type
	 * @param {string} name
	 */
	this.off = function(type, name) {
		for (var i = 0; i < listeners[type].length; i++) {
			if (listeners[type][i]._caller === name) {
				listeners[type].splice(i, 1);
			}
		}
		if (listeners[type].length == 0) {
			delete listeners[type];
		}
	};
	
	this.print = function () {
		console.log("-------EVENT MANAGER STATE-----------------");
		for (var key in listeners) {
			console.log("key: " + key);
			for (var j = 0; j < listeners[key].length; j++) {
				console.log("   " + listeners[key][j]._caller);
			}
		}
		console.log("-------------------------------------------");
	};
	
	this.who = function(type) {
		if (!(type in listeners))
			return;
		for (var i = 0; i < listeners[type].length; i++) {
			Log.debug(listeners[type][i]._caller + " listens to " + type);
		}
	};
	
	/**
	 * @param {string} name
	 */
	this.forget = function(name) {
		if (telling > 0) {
			toForget.push(name);
			return;
		}
		var sum = 0;
		for (var key in listeners) {
			var total = listeners[key].length;
			for (var i = 0; i < total; i++) {
				if (listeners[key][i]._caller === name) {
					listeners[key].splice(i, 1);
					i--;
					total--;
					sum++;
				}
			}
			if (listeners[key].length == 0) {
				delete listeners[key];
			}
		}
		Log.debug("Forgot " + sum + " event registred by " + name, "evm");
	};
	
	/**
	 * @param {string} type
	 * @param {Object=} message
	 * @param {boolean=} debug
	 */
	this.tell = function(type, message, debug) {
		telling++;
		var bucket = listeners[type];
		if (bucket != undefined) {
			for (var i = 0; i < bucket.length; i++) {
				var callback = bucket[i];
				if (debug != undefined && debug)
					Log.debug("      " + bucket[i]._caller);
				callback(message);
			}
		}
		telling--;
		if (telling == 0 && toForget.length > 0) {
			for (var i = 0; i < toForget.length; i++) {
				this.forget(toForget[i]);
			}
			toForget = new Array();
		}
	};
	
	this.tellArguments = function (next, wait, type, args) {
		var debug = true;
		telling++;
		var bucket = listeners[type];
		if (bucket != undefined) {
			for (var i = 0; i < bucket.length; i++) {
				var callback = bucket[i];
				if (debug != undefined && debug)
					Log.debug("      " + bucket[i]._caller);
				callback(next, args);
				if (!wait)
					next();
			}
		}
		telling--;
		if (telling == 0 && toForget.length > 0) {
			for (var i = 0; i < toForget.length; i++) {
				this.forget(toForget[i]);
			}
			toForget = new Array();
		}
	};

	this.tellWait = function (type, callback, message) {
		this.tellArguments(callback, true, type, message);
	};
	
	this.loadImages = function(imageSources, images, callback) {
		Log.debug("Loading images...", "view");
		var loadedImages = 0;
		var numImages = Object.size(imageSources);
		for (var src in imageSources) {
            images[src] = new Image();
            images[src].onload = function(){
                if (++loadedImages >= numImages) {
                	callback();
                }
            };
            images[src].src = "../res/img/" + imageSources[src];
        }
	};
};

/**
 * @constructor
 * @extends {MW.EventManager}
 */
MW.NoEventManager = function() {
	
	this.wevm = function() { return "NoEventManager"; };
	
	/**
	 * @param {string} type
	 * @param {Function} callback
	 * @param {string} name
	 */
	this.on = function(type, callback, name) {};
	
	/**
	 * @param {string} type
	 * @param {Object=} message
	 * @param {boolean=} debug
	 */
	this.tell = function(type, message, debug) {};
	
	/**
	 * @param {string} type
	 * @param {string} name
	 */
	this.off = function(type, name) {};
	
	/**
	 * @param {string} name
	 */
	this.forget = function(name) {};
};
///**
// * MonkeyWorld namespace
// * @namespace
// */
////var MW = {};

MW.debug = true;
MW.testing = false;

/**
 * @enum {string}
 */
MW.GameMode = {
	CHILD_PLAY: "Child Play",
	AGENT_SEE: "Monkey See",
	AGENT_DO: "Monkey Do"
};

/**
 * @extends {Kinetic.Stage}
 * @constructor
 */
Kinetic.NoStage = function() {};
Kinetic.NoStage.getWidth = function(){};


/**
 * @constructor
 */
MW.GlobalObject = function(tag) {
	this._tag = tag;
	var that = this;
	
	document.onkeypress = function(event) {
		if (event.keyCode === 117/* U */) {
			that.tell(MW.Event.TRIGGER_SUBTITLES);
		} else if (event.keyCode === 105/* I */) {
			that.tell(MW.Event.TRIGGER_SCORE);
		} else if (event.keyCode === 111/* O */) {
			that.tell(MW.Event.TRIGGER_FPS);
		} else if (event.keyCode === 115) {
			that.tell(MW.Event.PITCHER_LEVEL_ADD, { callback: function () {} });
		} else {
			console.info("Unhandles key: " + event.keyCode);
		}
	};
	
	/**
	 * Register a listener to the event manager.
	 * @param {string} type
	 * @param {Function} fnc
	 * @param {string=} tag
	 */
	this.on = function(type, fnc, tag) {
		this.evm.on(type, fnc, tag === undefined ? this._tag : tag);
	};
	
	/**
	 * @param {string} type
	 * @param {string=} tag
	 */
	this.off = function(type, tag) {
		this.evm.off(type, tag === undefined ? this._tag : tag);
	};
	
	/**
	 * Forget all listeners registered on the event manager.
	 * @param {string=} tag
	 */
	this.forget = function(tag) {
		this.evm.forget(tag === undefined ? this._tag : tag);
	};
	
	/**
	 * Tell the event manager that an event happened. It will be propagated to
	 * all listeners.
	 * @param {string} type
	 * @param {Object=} msg
	 * @param {boolean=} debug
	 */
	this.tell = function(type, msg, debug) {
		if (debug != undefined && debug)
			Log.debug("Out: " + type, this._tag);
		this.evm.tell(type, msg, debug);
	};
	
	this.tellWait = function (type, callback, msg) {
		Log.debug("Out: " + type, this._tag);
		this.evm.tellWait(type, callback, msg);
	};

	this.sendable_ = function (waitable, event, var_args) {
		return function (callback) {
			Log.debug("Out: " + event, this._tag);
			that.evm.tellArguments(callback, waitable, event, var_args);
		};
	};
	
	this.sendable = function (event, var_args) {
		return that.sendable_(false, event, var_args);
	};
	
	this.waitable = function (event, var_args) {
		return that.sendable_(true, event, var_args);
	};
	
	this.wevm = function() {
		console.log(this.evm.wevm());
	};
	
	/**
	 * @param {string} tag
	 */
	this.tag = function(tag) {
		this._tag = tag;
	};

};

MW.GlobalObject.prototype.evm  = new MW.NoEventManager();
MW.GlobalObject.prototype.stage = new Kinetic.NoStage();
MW.GlobalObject.prototype.game = null;

/**
 * @constructor
 */
MW.MiniGameResult = function() {
	
	/**
	 * @type {Array.<MW.MiniGameRoundResult>}
	 */
	var results = new Array();
	
	/**
	 * @param {MW.MiniGameRoundResult} roundResult
	 */
	this.pushResult = function(roundResult) {
		results.push(roundResult);
	};
	
	/**
	 * Get the results of specified round 
	 * @param {number} round
	 */
	this.getResult = function(round) {
		var index = round - 1;
		if (index < 0 || index >= results.length) {
			throw "MonkeyWorld.NoSuchRoundException ("+round+")";
		}
		return results[index];
	};
};

/**
 * @constructor
 */
MW.MiniGameRoundResult = function() {
	/**
	 * @type {boolean}
	 */
	var madeMistake = false;
	
	/**
	 * @type {Array.<*>}
	 */
	var actions = new Array();
	
	/**
	 * Report that a mistake has been made.
	 */ 
	this.reportMistake = function() {
		Log.debug("Got mistake report", "game");
		madeMistake = true;
	};
	
	/**
	 * Returns true if a mistake has been made.
	 * @returns {boolean}
	 */
	this.madeMistake = function() { return madeMistake; };
	
	/**
	 * @param {*} action
	 */
	this.pushAction = function(action) {
		actions.push(action);
	};
	
	this.popAction = function() {
		actions.splice(actions.length - 1);
	};
	
	/**
	 * @return {Array.<*>}
	 */
	this.getActions = function() {
		return actions;
	};
};

/**
 * @extends {MW.MiniGameResult}
 * @constructor
 */
MW.NoMiniGameResult = function() {
	this.pushResult = function() {
		throw "MonkeyWorld.NoMiniGameResultException";
	};
	this.getResult = function() {
		throw "MonkeyWorld.NoMiniGameResultException";
	};
};
/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {string} tag
 */
MW.Module = function(tag) {
	MW.GlobalObject.call(this, tag);
	var module = this;
	var timeoutController = new TimeoutController();
	
	var tearDowns = new Array();
	var setups = new Array();
	
	this.addTearDown = function(fnc) {
		tearDowns.push(fnc);
	};
	
	this.tearDown = function() {
		if (tearDowns === null)
			throw {
				name: "MW.TearDownAlreadyCalledException",
				message: "This module (" + tag + ") has " +
				         "already been teared down."
			};
		timeoutController.teardown();
		module.forget();
		for (var i = 0; i < tearDowns.length; i++) {
			tearDowns[i]();
			tearDowns[i] = null;
		};
		tearDowns = null;
	};
	
	this.addSetup = function(fnc) {
		setups.push(fnc);
	};
	
	this.setup = function() {
		if (setups === null)
			throw {
				name: "MW.SetupAlreadyCalledException",
				message: "This module (" + tag + ") has " +
				         "already been setted up."
			};
		for (var i = 0; i < setups.length; i++) {
			setups[i]();
			setups[i] = null;
		};
		setups = null;
	};
	
	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @return {number}
	 */
	this.setTimeout = function(fnc, time) {
		return timeoutController.setTimeout(fnc, time);
	};

	/**
	 * @param {Function} fnc
	 * @param {number} time
	 * @return {number}
	 */
	this.setInterval = function(fnc, time) {
		return timeoutController.setInterval(fnc, time);
	};
	
	/**
	 * @param {number} id
	 */
	this.clearTimeout = function(id) {
		timeoutController.clearTimeout(id);
	};

	/**
	 * @param {number} id
	 */
	this.clearInterval = function(id) {
		timeoutController.clearInterval(id);
	};

	/**
	 * @constructor
	 * @private
	 */
	function TimeoutController() {
		
		var timeouts = new Array();
		
		/**
		 * @param {Function} fnc
		 * @param {number} time
		 * @return {number}
		 */
		this.setTimeout = function(fnc, time) {
			var handler = setTimeout(fnc, time);
			timeouts.push(handler);
			return handler;
		};
		
		/**
		 * @param {Function} fnc
		 * @param {number} time
		 * @returns {number}
		 */
		this.setInterval = function(fnc, time) {
			var handler = setInterval(fnc, time);
			timeouts.push(handler);
			return handler;
		};
		
		/**
		 * @param {number} id
		 */
		this.clearTimeout = function(id) {
			timeouts.remove(id);
			clearTimeout(id);
		};
		
		/**
		 * @param {number} id
		 */
		this.clearInterval = function(id) {
			timeouts.remove(id);
			clearInterval(id);
		};
		
		/**
		 * 
		 */
		this.teardown = function() {
			for (var i = 0; i < timeouts.length; i++) {
				clearTimeout(timeouts[i]);
			}
			delete timeouts;
			timeouts = new Array();
		};
	};
};
/** @enum {string} */ var Language = { SWEDISH: "sv", ENGLISH: "en" }; 

/** @enum {string|number} */
var GlobalSettings = {
	/** @type {Language} */ LANGUAGE: Language.SWEDISH
};

/**
 * @constructor
 */
function SettingsObject() {
	var settings = {
		"global": {
			"language": {
				_value: "en"
			},
			"monkeySeeRounds": {
				_value: 1
			},
			"triesBeforeGuardianAngel": {
				_value: 3
			}
		},
		
		"miniGames": {
			"fishingGame": {
				"targetNumber": {
					_value: 2
				},
				"numberCorrect": {
					_value: 1
				},
				"numberOfFish": {
					_value: 7
				},
				"maxNumber": {
					_value: 9
				}
			},
			
			"ladder": {
				"targetNumber": {
					_value: -1
				}
			}
		}
	};
	
	this.json = function() { return settings; };
	this.get = function(args) {
		var current = settings;
		for (var i = 0; i < arguments.length; i++) {
			current = current[arguments[i]];
		}
		return current._value;
	};
	
	this.set = function(args) {
		var current = settings;
		for (var i = 0; i < arguments.length - 1; i++) {
			current = current[arguments[i]];
		}
		current._value = arguments[arguments.length - 1];
	};
	
	this.setJSON = function(obj) {
		if (obj === null) return;
		settings = obj;
	};
	
	this.set2 = function(arg, val) {
		var args = arg.split("-");
		var current = settings;
		for (var i = 0; i < args.length; i++) {
			current = current[args[i]];
		}
		current._value = val;
	};
}
var Settings = new SettingsObject();

/**
 * @constructor
 */
function SettingsPanel(settings) {
	
	/** @const */ var SETTINGS_PANEL_ID = "#settings-panel-content";
	var panel = $(SETTINGS_PANEL_ID);
	
	var _widget = function(setting, id) {
		var html = "";
		html += "<input type=\"text\" id=\"" + id + "\" value=\"" + setting._value + "\" />";
		return html;
	};
	
	var _title = function(name, level, pre) {
		var html = "";
		if (pre === undefined) pre = ""; else pre += "_";
		var lookFor = "SETTINGS_" + (pre + name).toUpperCase().replace("-", "_") + "_LABEL";
		var title = MW.Strings.get(lookFor);
		if (title != null)
			html += "<h" + level + ">" + title + "</h" + level + ">";
		return html;
	};
	
	var _list = function(json, level, pre) {
		var html = "";
		html += "<ul>";
		for (var key in json) {
			if (typeof json[key] === "object" && json[key]._value === undefined) {
				html += _title(key, level + 1, pre);
				html += _list(json[key], level + 1, pre + "-" + key);
				continue;
			}
			html += "<li>";
			html += _title(key, level + 1, pre);
			html += _widget(json[key], pre + "-" + key) + "</li>";
		}
		html += "</ul>";
		return html;
	};
	
	var _init = function() {
		$("#settings-panel").append("<div id=\"settings-panel-content\">");
		panel = $(SETTINGS_PANEL_ID);
		panel.append("<h1>" + MW.Strings.get("SETTINGS_LABEL") + "</h1>");
		panel.append("<form>");
		var settingsJSON = settings.json();
		
		for (var key in settingsJSON) {
			panel.append(_title(key, 2, ""));
			panel.append(_list(settingsJSON[key], 2, key));
		}
		var gamestr = "'egame'";
		var applystr = "'applySettings'";
		var hidestr = "'hideSettings'";
		
		var hidef = "window[" + gamestr + "][" + hidestr + "]()";
		var applyf = "window[" + gamestr + "][" + applystr + "]()";
		
		panel.append("<button type=\"button\" onclick=\"" + hidef + "\">" + MW.Strings.get("SETTINGS_CANCEL") + "</button>");
		panel.append("<button type=\"button\" onclick=\"" + applyf + ";" + hidef + "\">" + MW.Strings.get("SETTINGS_APPLY") + "</button>");
		//panel.append("<button type=\"button\" onclick=\"game.hideSettings();\">" + MW.Strings.get("SETTINGS_HIDE") + "</button>");
		panel.append("</form>");
		panel.append("</div>");
	};
	
	var _apply_object = function(object, name, pre) {
		for (var key in object) {
			if (typeof object[key] === "object" && object[key]._value === undefined)
				_apply_object(object[key], key, pre + "-" + key);
			else if (object[key]._value != undefined) {
				var val = $("#" + pre + "-" + key).val();
				Settings.set2(pre + "-" + key, val);
			}
		}
	};
	
	var _apply = function() {
		var json = settings.json();
		for (var key in json) {
			if (typeof json[key] === "object") _apply_object(json[key], key, key);
		}
		panel.remove();
		_init();
	};
	
	this.apply = function() { _apply(); };
	
	/**
	 * Shows the settings panel
	 */
	this.show = function() {
		_init();
		$("#settings-panel").show();
	};
	
	this.hide = function() {
		panel.remove();
		$("#settings-panel").hide();
	};
	
}MW.MonkeyAgent = function () {

};

MW.MouseAgent = function () {

};

/**
 * @constructor
 * @extends {MW.Module}
 */
MW.AgentChooser = function(done) {
	MW.Module.call(this, "AgentChooser");
	var chooser = this;
	
	var agents = [
		{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView },
		{ model: MW.MouseAgent, view: MW.MouseAgentView },
		{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView },
		{ model: MW.MonkeyAgent, view: MW.MonkeyAgentView }
	];

	/**
	 * Get an array representing the available agents.
	 * @returns {Array}
	 */
	chooser.getAgents = function() { return agents; };

	/**
	 * Choose an agent
	 * @param agent
	 */
	chooser.choose = function(agent) {
		done(agent);
	};
};
/**
 * @constructor
 * @param {Object} configuration
 * @param {MW.LearningTrack} learningTrack
 */
MW.MinigameLauncher = function(configuration, learningTrack) {
	var _configuration = configuration;
	var _learningTrack = learningTrack;
	this.getConfiguration = function() { return _configuration; };
	this.getLearningTrack = function() { return _learningTrack; };
};

/**
 * @constructor
 * @extends {MW.GlobalObject}
 * @param {Kinetic.Stage} stage
 * @param {boolean=}      useViews         Defaults to true. Useful to falsify
 *                                         when testing.
 * @param {boolean=}      useAgentChooser  Defaults to true. Falsify when
 *                                         testing.
 * @param {Object=}       startGame        
 */
MW.Game = function(stage, useViews, useAgentChooser, startGame) {
	/** @const @type {MW.Game}      */ var that = this;
	MW.GlobalObject.call(this, "Game");
	this.evm = new MW.EventManager(stage);
	this.stage = stage;
	this.game = this;
	
	/**
	 * @param {Function} object to create
	 * @param {*=} arg1
	 * @param {*=} arg2
	 * @param {*=} arg3
	 * @param {*=} arg4
	 */
	var newObject = function(object, arg1, arg2, arg3, arg4) {
		/*
		 * TODO: Think real hard about if this is a good way to give
		 * everyone access to the EventManager, MW.Game and
		 * Kinetic.Stage objects. If using ordinary constructors
		 * instead, this whole method is not necessary any more, since 
		 * the caller can use the keyword 'new' instead.
		 */
		object.prototype.evm = that.evm;
		object.prototype.game = that;
		object.prototype.stage = stage;
		
		/*
		 * TODO: Find out how to achieve this with apply(...) instead.
		 */
		var tmp = null;
		if (arg1 === undefined)
			tmp = new object();
		else if (arg1 != undefined && arg2 === undefined)
			tmp = new object(arg1);
		else if (arg2 != undefined && arg3 === undefined)
			tmp = new object(arg1, arg2);
		else if (arg3 != undefined && arg4 === undefined)
			tmp = new object(arg1, arg2, arg3);
		else
			tmp = new object(arg1, arg2, arg3, arg4);
		return tmp;
	};
	
	var
		/** @const @type {MW.Minigame} */
		NO_MINI_GAME    = new MW.NoMinigame(),
		/** @const @type {MW.NoMiniGameResult} */
		NO_RESULT       = new MW.NoMiniGameResult();
	/** @const @type {GamerPlayer}         */ var GAMER           = newObject(GamerPlayer);
	/** @const @type {MonkeyPlayer}        */ var AGENT           = newObject(MonkeyPlayer);
	
	/** @const @type {MW.NoLearningTrack}     */ var NO_TRACK     = new MW.NoLearningTrack();
	/** @const @type {MW.RegularLearningTrack}*/ var REGULAR_TRACK= new MW.RegularLearningTrack();
	/** @const @type {MW.MediumLearningTrack} */ var MEDIUM_TRACK = new MW.MediumLearningTrack();
	/** @const @type {MW.FastLearningTrack}   */ var FAST_TRACK   = new MW.FastLearningTrack();
	
	/** @type {MW.GameMode}                */ var gameMode        = MW.GameMode.AGENT_SEE; 
	/** @type {MW.Minigame}                */ var miniGame        = NO_MINI_GAME;
	/** @type {Function} @constructor      */ var miniGameView    = null;
	                                          var currentMiniGameView = null;
	                                          var miniGameHandlerView = null;
	/** @type {Function}                   */ var miniGameStarter = null;
	/** @type {MW.Player}                  */ var player          = GAMER;
	/** @type {number}                     */ var _round          = 1;
	/** @type {MW.MiniGameResult}          */ var result          = NO_RESULT;
	/** @type {number}                     */ var miniGameScore   = 0;
	                                          var currentConfiguration = null;
	                                          var waterDrops      = 0;
	                                          var gardenVerdure   = 0;
	                                          var agentView       = null;
	
	/** @type {MW.LearningTrack}           */ var _learningTrack  = NO_TRACK;
	/** @type {Array.<MW.MinigameLauncher>} */ var minigameArray = new Array();


	if (startGame != undefined) {
		var h = new MW.MinigameLauncher(startGame, REGULAR_TRACK);
		minigameArray.push(h);
		console.log(h.getConfiguration());
	}
	
	/*====================================================================*/
	/*=== CONSTRUCTOR ====================================================*/
	/*====================================================================*/
	
	if (useViews === undefined) useViews = true;
	if (useAgentChooser === undefined) useAgentChooser = true;
	//this.on("frame", function(msg) { miniGame.onFrame(msg.frame); });
	if (useViews)
		newObject(MonkeyWorldView);

	
	/*====================================================================*/
	/*=== PRIVATE ========================================================*/
	/*====================================================================*/
	
	/**
	 * Set the current round to specified number. It is recommended to use
	 * this function above accessing the _round variable directly, since
	 * this function will make boundary checks. It throws an exception if
	 * the upper or lower round boundary is violated. 
	 * @param {number} round
	 */
	var setRound = function(round) {
		if (round > Settings.get("global", "monkeySeeRounds") &&
		    (gameMode === MW.GameMode.AGENT_SEE ||
		     gameMode === MW.GameMode.AGENT_DO)) {
			throw "MonkeyWorld.MiniGameRoundOverMaxLimit";
		} else if (round < 1){
			throw "MonkeyWorld.MiniGameRoundUnderMinLimit";
		} else {
			_round = round; 
		}
	};
	
	/**
	 * @param {MW.LearningTrack} learningTrack
	 */
	var setLearningTrack = function(learningTrack) {
		_learningTrack = learningTrack;
		that.tell(MW.Event.LEARNING_TRACK_UPDATE, { learningTrack: learningTrack }, true);
	};
	
	/**
	 * @returns {MW.LearningTrack}
	 */
	var getLearningTrack = function() {
		return _learningTrack;
	};
	
	/**
	 * Add one round to the current mini game
	 */
	var addRound = function() {
		setRound(_round + 1);
	};
	
	/**
	 * Decide when it's time and how to play the current game next time.
	 */
	var decideNextOfSameGame = function(config, score) {
		if (score > 26 && score <= 30) {
			//reps = 2;
			// TODO: randomize this push
			minigameArray.push(new MW.MinigameLauncher(config, FAST_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, FAST_TRACK));
		} else if (score > 22 && score <= 26 ) {
			//reps = 3;
			// TODO: randomize this push
			minigameArray.push(new MW.MinigameLauncher(config, MEDIUM_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, MEDIUM_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, MEDIUM_TRACK));
		} else if (score >= 0 && score <= 22) {
			//reps = 5;
			// TODO: randomize this push
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config.category.variations[0], REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
			minigameArray.push(new MW.MinigameLauncher(config, REGULAR_TRACK));
		} else {
			throw "MW.NoSuchMinigameScore";
		}
	};
	
	/**
	 * Set the current minigame score to <code>score</code>.
	 */
	var setMinigameScore = function(score) {
		miniGameScore = score;
		that.tell(MW.Event.BACKEND_SCORE_UPDATE_MINIGAME, { score: miniGameScore });
	};
	
	/**
	 * Add <code>score</code> to the current minigame's total scoring. 
	 */
	var addMinigameScore = function(score) {
		setMinigameScore(miniGameScore + score);
	};
	
	/**
	 * Calculate what the next game mode, round and player should be.
	 */
	var getNextState = function() {
		if (gameMode === MW.GameMode.CHILD_PLAY) {
			gameMode = MW.GameMode.AGENT_SEE;
			startMiniGame();
		} else if (gameMode === MW.GameMode.AGENT_SEE) {
			var _result = miniGame.getResult();
			result.pushResult(_result);
			gameMode = MW.GameMode.AGENT_DO;
			player = AGENT;
			startMiniGame();
		} else if (gameMode === MW.GameMode.AGENT_DO) {
			if (_round === Settings.get("global", "monkeySeeRounds")) {
				setRound(1);
				gameMode = MW.GameMode.CHILD_PLAY;
				player = GAMER;
				stopMiniGame();
				decideNextOfSameGame(currentConfiguration, miniGameScore);
				selectMinigame();
			} else {
				addRound();
				startMiniGame();
			}
		}
	};
	
	var selectMinigame = function() {
		result = new MW.MiniGameResult();
		player = GAMER;
//		gameMode = MW.GameMode.CHILD_PLAY;
		gameMode = MW.GameMode.AGENT_SEE;
//		minigameHandler = newObject(MW.MinigameHandler);
		if (useViews) {
			miniGameHandlerView = newObject(MW.MinigameHandlerView);
			miniGameHandlerView.setup();
		}
		chooseMiniGame(function() {
			setMinigameScore(0);
			startMiniGame();
			that.tell(MW.Event.MINIGAME_STARTED, {}, true);
		});
	};
	
	var chooseMiniGame = function(callback) {
		if (minigameArray.length > 0) {
			var launcher = minigameArray[0];
			minigameArray.splice(0);
			var configuration = launcher.getConfiguration();
			setLearningTrack(launcher.getLearningTrack());
			currentConfiguration = configuration;
			miniGameStarter = function() {
				miniGame = newObject(configuration.game);
				miniGameView = configuration.view;
			};
			callback();
		} else if (startGame === undefined) {
			that.tell("Game.showMiniGameChooser", {
				callback: function(choice) {
					currentConfiguration = choice;
					miniGameStarter = function() {
						that.tell("Game.hideMiniGameChooser");
						miniGame = newObject(choice.game);
						miniGameView = choice.view;					
					};
					setLearningTrack(REGULAR_TRACK);
					callback();
				},
				games: MW.MinigameConfiguration
			});
		}
	};
	
	/**
	 * Start the current mini game.
	 */
	var startMiniGame = function() {
		//that.evm.print();
		miniGameStarter();
		miniGame.setup();
		if (useViews) {
			currentMiniGameView = newObject(miniGameView, miniGame);
			currentMiniGameView.setup();
			that.tell("Game.miniGameListenersInitiated");
		}
		if (gameMode === MW.GameMode.AGENT_DO) {
			var actions = result.getResult(_round).getActions();
			miniGame.play(player, actions);
		} else {
			miniGame.play(player);
		}
	};
	
	/**
	 * Stop the current mini game.
	 */
	var stopMiniGame = function () {
		that.tell("Game.stopMiniGame");
		if (useViews)
			miniGameHandlerView.tearDown();
		miniGame.stop();
		miniGame.tearDown();
		delete miniGame;
		miniGameScore = 0;
		miniGame = NO_MINI_GAME;
		that.tell(MW.Event.MINIGAME_ENDED);
	};

	/**
	 * @param {Function=} callback
	 */
	var waterGarden = function (callback) {
		var afterWatering = function () {
			gardenVerdure += waterDrops;
			waterDrops = 0;
			that.tell(MW.Event.PITCHER_LEVEL_RESET);
			gardenView.tearDown();
			that.tell(MW.Event.GARDEN_WATERED);
			if (callback != undefined)
				callback();
		};
		if (useViews) {
			var gardenView = newObject(MW.GardenView);
			gardenView.setup();
			that.tell(MW.Event.WATER_GARDEN, {
				callback: function () {
					afterWatering();
				}
			});
		} else {
			afterWatering();
		}
	};
	
	var demonstrateGarden = function (callback) {
		if (useViews && !MW.debug) {
			var gardenView = newObject(MW.GardenView);
			gardenView.setup();
			that.tell("Game.viewInitiated");
			that.tell("Game.demonstrateGarden", {
				callback: function () {
					gardenView.tearDown();
					callback();				
				}
			});
		} else {
			callback();
		}
	};

	var playIntroduction = function (callback) {
		if (useViews && !MW.debug) {
			var introductionView = newObject(
				MW.IntroductionView,
				function () {
					introductionView.tearDown();
					demonstrateGarden(callback)
				}
			);
			introductionView.setup();
			that.tell("Game.viewInitiated");
		} else {
			demonstrateGarden(callback);
		}
	};

	/*====================================================================*/
	/*=== PUBLIC =========================================================*/
	/*====================================================================*/
	
	/**
	 * Tell the game that a mini game has finished
	 */
	this.miniGameDone = function() {
		if (miniGame === NO_MINI_GAME) {
			throw {
				name: "MonkeyWorld.NoActiveMiniGameException",
				message: "There is no active minigame"
			};
		}
		if (useViews)
			currentMiniGameView.tearDown();
		addMinigameScore(miniGame.getBackendScore());
		getNextState();
	};
	
	/**
	 * Get the current game mode.
	 * @return {MW.GameMode}
	 */
	this.getMode = function() {
		return gameMode;
	};
	
	/**
	 * Get the current round.
	 * @return {number}
	 */
	this.getRound = function() {
		return _round;
	};
	
	/**
	 * Get the current score.
	 * @return {number}
	 */
	this.getScore = function() {
		return miniGameScore;
	};
	
	this.getAgentView = function () {
		return agentView;
	};
	
	/**
	 * Start the Monkey World game
	 */
	this.start = function() {
		var chooser = null;
		var chooserView = null;
		
		playIntroduction(/* then */function () {
			if (useAgentChooser) {
				chooser = newObject(
					MW.AgentChooser,
					function(agent) {
						chooser.tearDown();
						if (chooserView != null)
							chooserView.tearDown();
						agentView = new agent.view();
						selectMinigame();
					}
				);
				if (useViews) {
					chooserView = newObject(MW.AgentChooserView, chooser);
					chooserView.setup();
					that.tell("Game.viewInitiated");
				}
			} else {
				agentView = new MW.MouseAgentView();
				selectMinigame();
			}
		});
	};

	/**
	 * Stops the Monkey World game
	 */
	this.stop = function() {
		stopMiniGame();
		gameMode = MW.GameMode.CHILD_PLAY;
		setRound(1);
		player = GAMER;
		result = NO_RESULT;
		this.tell("Game.stop");
	};

	/**
	 * Restart the Monkey World game.
	 */
	this.restart = function() {
		this.stop();
		this.start();
	};

	this.addWaterDrop = function (callback) {
		console.log("addWaterDrop");
		that.tell(MW.Event.PITCHER_LEVEL_ADD_BEFORE);
		that.tell(MW.Event.PITCHER_LEVEL_ADD, { callback: function () {
			if (waterDrops === 6) {
				console.log("OK");
				waterGarden(callback);
			} else {
				if (callback != undefined)
					callback();
			}
		}});
		waterDrops += 1;
		console.log(waterDrops);
	};

	this.getWaterDrops = function () {
		return waterDrops;
	};

	this.getGardenVerdure = function () {
		return gardenVerdure;
	};

	/**
	 * Returns the current mini game.
	 * @return {MW.Minigame|MW.NoMinigame}
	 */
	this.getMiniGame = function() {
		return miniGame;
	};

	this.setAgentAsPlayer = function() {
		player = AGENT;
	};

	this.setGamerAsPlayer = function() {
		player = GAMER;
	};

	/**
	 * Returns true if the current player is the gamer.
	 * @return {boolean}
	 */
	this.playerIsGamer = function() {
		return player === GAMER;
	};

	/**
	 * Returns true if the current player is the teachable agent.
	 * @return {boolean}
	 */
	this.playerIsAgent = function() {
		return player === AGENT;
	};

	/** @return {boolean} true if the current mode is Child Play */
	this.modeIsChild = function() {
		return gameMode === MW.GameMode.CHILD_PLAY;
	};

	/** @return {boolean} true if the current mode is Agent See */
	this.modeIsAgentSee = function() {
		return gameMode === MW.GameMode.AGENT_SEE;
	};

	/** @return {boolean} true if the current mode is Agent Do */
	this.modeIsAgentDo = function() {
		return gameMode === MW.GameMode.AGENT_DO;
	};
};
/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.FastLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.FastLearningTrack.prototype.errorRate = function(round) {
	if (round >= 0 && round < 3)
		return 0.75;
	else if (round >= 3 && round < 6)
		return 0.5;
	else if (round >= 7 && round < 13)
		return 0.25;
	else
		return 0;
};

/**
 * @returns {string}
 */
MW.FastLearningTrack.prototype.name = function() {
	return "Fast";
};/**
 * @interface
 */
MW.LearningTrack = function() {};

/**
 * @param {number} round
 * @returns {number}
 */
MW.LearningTrack.prototype.errorRate = function(round) {};

/**
 * @returns {string}
 */
MW.LearningTrack.prototype.name = function() {};/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.MediumLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.MediumLearningTrack.prototype.errorRate = function(round) {
	if (round >= 0 && round < 5)
		return 0.75;
	else if (round >= 5 && round < 10)
		return 0.5;
	else if (round >= 10 && round < 17)
		return 0.25;
	else
		return 0;
};

/**
 * @returns {string}
 */
MW.MediumLearningTrack.prototype.name = function() {
	return "Medium";
};/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.NoLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.NoLearningTrack.prototype.errorRate = function(round) {
	return 1;
};

/**
 * @returns {string}
 */
MW.NoLearningTrack.prototype.name = function() {
	return "No track";
};/**
 * @constructor
 * @implements {MW.LearningTrack}
 */
MW.RegularLearningTrack = function() {};

/** 
 * @param {number} round
 * @returns {number}
 */
MW.RegularLearningTrack.prototype.errorRate = function(round) {
	if (round >= 0 && round < 10)
		return 0.75;
	else if (round >= 10 && round < 20)
		return 0.5;
	else if (round >= 20 && round < 35)
		return 0.25;
	else
		return 0;
};

/**
 * @returns {string}
 */
MW.RegularLearningTrack.prototype.name = function() {
	return "Regular";
};/**
 * @constructor
 * @extends {MW.Minigame}
 */
MW.LadderMinigame = function () {
	"use strict";
	MW.Minigame.call(this, "Ladder");
	var
		ladder = this,
		minNumber = 1,
		maxNumber = 6,
		stepNumber = 1,
		ladderArray = [],
		targetNumber = Utils.getRandomInt(minNumber, maxNumber),
		chosenNumber = null,
		/** @const */
		minTreats = 1,
		/** @const */
		maxTreats = 3,
		tries = 0,
		/** @const */
		minTries = 3,
		collectedTreats = 0,
		birdHasTreat = false,
		interruptable = false,
		round = 0,
		lastHelpAttempt = 0,
		timesHelped = 0,
		/** @const */
		MAX_HELP = 4;

	ladder.addSetup(function () {
		var i, j = 0;
		for (i = minNumber; i <= maxNumber; i += stepNumber) {
			ladderArray[j] = i;
			j += 1;
		}
	});

	/**
	 * Agent interrupts will not be handled when generated.
	 * @private
	 */
	function disallowInterrupt() {
		interruptable = false;
		if (ladder.game.modeIsAgentDo()) {
			ladder.tell(MW.Event.MG_LADDER_FORBID_INTERRUPT);
		}
	}

	/**
	 * Agent interrupts will be handled when generated.
	 * @private
	 */
	function allowInterrupt(callback) {
		interruptable = true;
		if (ladder.game.modeIsAgentDo() && !ladder.agentIsInterrupted()) {
			ladder.tellWait(MW.Event.MG_LADDER_ALLOW_INTERRUPT, callback);
		} else {
			callback();
		}
	}

	/**
	 * Make a new treat ready to be targeted.
	 * @private
	 */
	function placeTreat() {
		targetNumber = Utils.getRandomInt(minNumber, maxNumber);
		round += 1;
		Utils.chain(
			ladder.waitable(MW.Event.MG_LADDER_PLACE_TARGET),
			function () {
				ladder.tell(MW.Event.MG_LADDER_READY_TO_PICK);
				ladder.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
				if (!ladder.game.modeIsAgentDo()) {
					ladder.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, {}, true);
				}
			}
		)();
	}

	/**
	 * When a mistake has been done.
	 * @private
	 * @param {Function} callback
	 */
	function mistake(callback) {
		ladder.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
		if (!ladder.game.modeIsAgentDo())
			ladder.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT);
		ladder.reportMistake();
		ladder.tell("Ladder.incorrect");
		if (timesHelped >= MAX_HELP) {
			ladder.tell("Ladder.agentSuggestSolution");
		}
		ladder.addAction("incorrect");
		callback();
	}

	/**
	 * @private
	 * @param {Function} callback
	 */
	function gotCorrectTarget(callback) {
		birdHasTreat = true;
		Utils.chain(
			ladder.waitable(MW.Event.MG_LADDER_GET_TARGET),
			ladder.waitable(MW.Event.MG_LADDER_RESET_SCENE),
			ladder.sendable(MW.Event.MG_LADDER_HAS_TARGET),
			function () {
				ladder.addAction("correct");
				birdHasTreat = false;
				callback();
			}
		)();
	}

	/**
	 * @private
	 * @param {Function} callback
	 */
	function gotIncorrectTarget(callback) {
		ladder.tellWait(
			MW.Event.MG_LADDER_RESET_SCENE,
			function () { mistake(callback); }
		);
	}

	/**
	 * @private
	 */
	function checkEndOfRound() {
		var
			hasMaxTreats = collectedTreats === maxTreats,
			enoughTries = tries >= minTries,
			enoughTreats = collectedTreats >= minTreats;

		if (hasMaxTreats || (enoughTries && enoughTreats)) {
			console.log("checkok");
			Utils.chain(
				ladder.waitable(MW.Event.MG_LADDER_CHEER),
				ladder.roundDone
			)();
		} else {
					console.log("placetreat");
			placeTreat();
		}
	}

	/**
	 * Open a collected treat
	 * @private
	 */
	this.openTreat = function () {
		collectedTreats += 1;
		if (!ladder.game.modeIsChild()) {
			ladder.tell(MW.Event.MG_LADDER_CONFIRM_TARGET);
			ladder.game.addWaterDrop(checkEndOfRound);
		} else {
			ladder.tellWait(MW.Event.MG_LADDER_CONFIRM_TARGET);
			ladder.tellWait(MW.Event.MG_LADDER_GET_TREAT, checkEndOfRound);
		}
	};

	/**
	 * Pick a number
	 * @public
	 * @param {number} number
	 */
	this.pick = function (number) {
		chosenNumber = number;
		tries += 1;
		Utils.chain(
			allowInterrupt,
			ladder.waitable(MW.Event.MG_LADDER_PICKED, {
				number: number,
				correct: number === targetNumber
			}),
			ladder.sendable(MW.Event.MG_LADDER_IGNORE_INPUT),
			function (next) {
				if (ladder.agentIsBeingHelped()) {
					timesHelped += 1;
				} else {
					timesHelped = 0;
				}
				if (ladder.agentIsBeingHelped() && number === targetNumber) {
					ladder.helpedAgent();
				}
				next();
			},
			function (next) {
				if (number === targetNumber &&
				    number < lastHelpAttempt &&
				    (ladder.agentIsInterrupted() ||
				     ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.betterBecauseSmaller");
				}

				if (number === targetNumber &&
				    number > lastHelpAttempt &&
				    (ladder.agentIsInterrupted() ||
				     ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.betterBecauseBigger");
				}

				if (number !== targetNumber &&
				   (ladder.agentIsInterrupted() ||
				    ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.hmm");
				}

				if (ladder.game.modeIsAgentDo()) {
					lastHelpAttempt = number;
				}

				if ((ladder.game.modeIsAgentDo() && !ladder.agentIsBeingHelped()) ||
				    (ladder.agentIsBeingHelped() && number === targetNumber)) {
					ladder.resumeAgent();
					ladder.tell(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, {}, true);
				}
				next();
			},
			ladder.waitable(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET),
			function (next) {
				disallowInterrupt();
				if (number === targetNumber) {
					gotCorrectTarget(next);
				} else {
					gotIncorrectTarget(next);
				}
				if (number < targetNumber &&
				    ladder.game.modeIsAgentDo() &&
				    !ladder.agentIsInterrupted() &&
				    !ladder.agentIsBeingHelped()) {
					ladder.tell("Ladder.agentTooLow");
				   }

				if (number > targetNumber &&
				    ladder.game.modeIsAgentDo() &&
				    !ladder.agentIsInterrupted() &&
				    !ladder.agentIsBeingHelped()) {
					ladder.tell("Ladder.agentTooHigh");
				}

				if (number < targetNumber &&
				   (ladder.game.modeIsAgentSee() ||
				    ladder.agentIsInterrupted() ||
				    ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.tooLow");
				}

				if (number > targetNumber &&
				   (ladder.game.modeIsAgentSee() ||
				    ladder.agentIsInterrupted() ||
				    ladder.agentIsBeingHelped())) {
					ladder.tell("Ladder.tooHigh");
				}
				chosenNumber = null;
			}
		)();
	};

	/**
	 * Returns the target number.
	 * @returns {number}
	 */
	this.getTargetNumber = function() {
		return targetNumber;
	};

	/**
	 * @return {number} a number on the ladder which isn't the target number.
	 */
	this.getIncorrectNumber = function() {
		var pos = Utils.getRandomInt(0, ladderArray.length - 1);
		if (ladderArray[pos] === targetNumber) {
			return this.getIncorrectNumber();
		}
		return ladderArray[pos];
	};

	/**
	 * @return {number} the number that has been chosen
	 */
	this.getChosenNumber = function () {
		if (chosenNumber === null) {
			throw {
				name: "No number chosen yet",
				game: "Ladder",
				message: "A chosen number was asked for in " + 
				         "the Ladder Game, but no number has " +
				         "yet been chosen by the user or the " +
				         "agent."
			};
		}
		return chosenNumber;
	};

	/**
	 * @return {number} the maximum number of treats that the player can get
	 * @const
	 */
	this.getMaximumTreats = function () {
		return maxTreats;
	};

	/**
	 * @return {number} the current round number, which is >= 1 if the
	 *                  minigame has started
	 */
	this.getRoundNumber = function () {
		if (round === 0) {
			throw "MinigameNotStartedException";
		} else {
			return round;
		}
	};

	/**
	 * Gets the ladder with its numbers
	 * @returns {Array.<number>}
	 */
	this.getLadder = function() {
		return ladderArray;
	};

	this.addAgentInterruptedHandler(function () {
		if (interruptable && ladder.game.modeIsAgentDo()) {
			disallowInterrupt();
			ladder.popAction();
			if (!birdHasTreat) {
				ladder.tell("Ladder.interrupt", {});
				ladder.tellWait(MW.Event.MG_LADDER_RESET_SCENE, function() {
					ladder.tell(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, {}, true);
					ladder.tell(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, {}, true);
				});
			}
		}
	});

	this.addStart(function () {
		ladder.tell(MW.Event.MG_LADDER_IGNORE_INPUT, {}, true);
		ladder.tell(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, {}, true);
		ladder.tell("Ladder.start");
		if (ladder.game.modeIsAgentSee()) {
			ladder.tellWait("Ladder.introduceAgent", placeTreat );
		} else if (ladder.game.modeIsAgentDo()) {
			ladder.tellWait("Ladder.startAgent", placeTreat );
		} else {
			placeTreat();
		}
	});

	this.addStop(function () {
		ladder.tell("Game.roundDone");
	});
}

/**
 * @constructor
 * @extends {MW.Module}
 * @param {string} tag
 */
MW.Minigame = function (tag) {
	MW.Module.call(this, tag);
	var
		that = this,
		startFunctions = [],
		stopFunctions = [],
		started = false,
		stopped = false;
	
	/** @private @type {MW.MiniGameRoundResult} */
	var roundResult = null;
	
	/** @private @type {number} */ var backendScore = 10;
	
	var _strategy = null;
	
	/**
	 * Tell the game what the player did.
	 * @param {*} action
	 */
	this.addAction = function(action) {
		roundResult.pushAction(action);
	};
	
	this.popAction = function() {
		roundResult.popAction();
	};
	
	/**
	 * @param {Function} fnc
	 */
	this.addStart = function (fnc) {
		startFunctions.push(fnc);
	};

	/**
	 * @param {Function} fnc
	 */	
	this.addStop = function (fnc) {
		stopFunctions.push(fnc);
	};
	
	this.start = function () {
		if (started)
			throw {
				name: "MW.MinigameModuleAlreadyStarted",
				message: "This minigame module (" + tag + ") " +
				         "has already been started."
			};
		started = true;
		while (startFunctions.length > 0)
			(startFunctions.shift())();
	};
	
	this.stop = function () {
		if (stopped)
			throw {
				name: "MW.MinigameModuleAlreadyStopped",
				message: "This minigame module (" + tag + ") " +
				         "has already been stopped."
			};
		stopped = true;
		while (stopFunctions.length > 0)
			(stopFunctions.shift())();
	};
	
	var subtractBackendScore = function() {
		if (backendScore > 0) {
			backendScore--;
			that.tell(MW.Event.BACKEND_SCORE_UPDATE_MODE,
				{ backendScore: backendScore }, true);
		}		
	};
	
	/**
	 * Tell the system that the player made a mistake during game play. 
	 */
	this.reportMistake = function() {
		subtractBackendScore();
		roundResult.reportMistake();
	};

	/** @return {boolean} */
	this.madeMistake = function() { return roundResult.madeMistake(); };
	
	/** @return {MW.MiniGameRoundResult} */
	this.getResult = function() {
		return roundResult;
	};
	
	/** @return {number} */
	this.getBackendScore = function() {
		return backendScore;
	};
	
	/**
	 * Call this function to tell the engine that the mini game round is
	 * over.
	 * @protected
	 */
	this.roundDone = function() {
		Log.debug("Round done", "game");
		that.tell("Game.roundDone");
		that.tell("Game.nextRound");
		that.game.miniGameDone();
	};

	/**
	 * @param {MW.Player} player
	 * @param {Object=} res
	 */
	this.play = function(player, res) {
		backendScore = 10;
		that.tell(MW.Event.BACKEND_SCORE_UPDATE_MODE, { backendScore: backendScore }, true);
		roundResult = new MW.MiniGameRoundResult();
		console.log(this._tag);
		_strategy = new player.strategies[this._tag](this, res);
		this.start();
	};
	
	var _agentIsInterrupted = false;
	var _agentIsBeingHelped = false;
	var interruptHandlers = [];
	
	this.interruptAgent = function() {
		_agentIsInterrupted = true;
		_strategy.interrupt();
		that.game.setGamerAsPlayer();
		for (var i = 0; i < interruptHandlers.length; i += 1) {
			interruptHandlers[i]();
		}
	};

	this.addAgentInterruptedHandler = function (fnc) {
		interruptHandlers.push(fnc);
	};
	
	this.resumeAgent = function() {
		_agentIsInterrupted = false;
		that.game.setAgentAsPlayer();
		_strategy.resume();
	};
	
	this.agentIsInterrupted = function() {
		return _agentIsInterrupted;
	};
	
	/**
	 * Tell the system that the teachable agent needs help.
	 */
	this.helpAgent = function() {
		_agentIsBeingHelped = true;
		that.game.setGamerAsPlayer();
	};
	
	/**
	 * Tell the system that the teachable agent has been helped, and that it
	 * can now continue on its own.
	 */
	this.helpedAgent = function() {
		_agentIsBeingHelped = false;
		that.game.setAgentAsPlayer();
	};
	
	/**
	 * Checks if the teachable agent is currently being helped by the gamer.
	 * @return {boolean}
	 */
	this.agentIsBeingHelped = function() {
		return _agentIsBeingHelped;
	};
}

/**
 * @constructor
 * @extends {MW.Minigame}
 */
MW.NoMinigame = function () {
	this.play = function() {
		throw "No implemented mini game";
	};
}
MW.NoMinigame.prototype = new MW.Minigame("NoMiniGame");


MW.MinigameConfiguration = (function() {
	
	/** @enum {Object} */
	var collection = {
		/** @enum {Object} */
		LADDER: {
			TREE: {
				game: MW.LadderMinigame,
				view: TreeView,
				title: "Tree Game"
			},
			MOUNTAIN: {
				game: MW.LadderMinigame,
				view: MountainView,
				title: "Mountain Game"
			}
		}
	};
	
	for (var key in collection) {
		var i = 0;
		var k = collection[key];
		var arr = new Array();
		for (var ley in k) {
			arr.push(k[ley]); 
			k[ley].category = k;
			i++;
		}
		k.variations = arr;
		k.sum = function() { return i; };
	}
	
	return collection;
})();
/**
 * GamerPlayer
 * @extends {MW.Player}
 * @constructor
 */
function GamerPlayer() {
	MW.Player.call(this, "GamerPlayer");
	this.tag("GamerPlayer");
	Log.debug("Creating GamerPlayer", "player");
	this.strategies = function() {};
	
	this.strategies["Ladder"] = function(game) {
		
	};
}
//GamerPlayer.prototype = new Player();
/**
 * MonkeyPlayer
 * @extends {MW.Player}
 * @constructor
 */
function MonkeyPlayer() {
	Log.debug("Creating MonkeyPlayer", "player");
	MW.Player.call(this, "MonkeyPlayer");
	var that = this;
	this.strategies = function() {};
	
	/**
	 * @param {MW.LadderMinigame} game
	 * @param {Array=} result
	 */
	this.strategies["Ladder"] = function(game, result) {
		Log.debug("Applying MonkeyPlayer's strategy to the Ladder", "player");
		
		var resultPosition = 0;
		var interrupted = false;
		var intentionalMistakePosition = Utils.getRandomInt(0, result.length - 1);
		Log.debug("Will make mistake on try number " + intentionalMistakePosition + 1, "agent");
		var tries = 0;
		
		that.on("Ladder.readyToPick", function(msg) {
			play(resultPosition++);
		});
		
		that.on("Ladder.incorrect", function(msg) {
			if (game.agentIsInterrupted()) return;
			/** @const @type {number} */ var MAX_AGENT_TRIES = 4;
			if (tries < MAX_AGENT_TRIES) {
				play(resultPosition++);
			} else if (tries === MAX_AGENT_TRIES) {
				if (!game.agentIsBeingHelped()) {
					MW.Sound.play(MW.Sounds.LADDER_PLEASE_HELP_ME);
					game.helpAgent();
				}
			}
		});
		
		that.on("Ladder.correct", function(msg) {
			tries = 0;
		});
		
		this.interrupt = function() {
			Log.debug("Interrupting agent", "agent");
			interrupted = true;
			tries = 0;
		};
		
		this.resume = function() {
			Log.debug("Resuming agent", "agent");
			interrupted = false;
		};
		
		var play = function(resultPosition) {
			if (interrupted) return;
			tries++;
			setTimeout(function() {
				Log.debug("Picking a number", "agent");
				if (resultPosition === intentionalMistakePosition || result[resultPosition] === "incorrect") {
					game.pick(game.getIncorrectNumber());
				} else {
					game.pick(game.getTargetNumber());
				}
				
			}, 2000);
		};
		
		that.on("Ladder.hasTarget", function(msg) {
			setTimeout(function() {
				game.openTreat();	
			}, 1500);
		});
		
		that.on("Game.stopMiniGame", function(msg) {
			that.forget();
		});
	};
}
/**
 * @constructor
 * @extends {MW.GlobalObject}
 */

MW.Player = function(name) {
	MW.GlobalObject.call(this, name);
};
/**
 * Definition of all the images that the application will use. They can be
 * loaded before the game starts.
 * 
 * @enum {string}
 */
MW.ImageSources = {
/** @const */ MONKEY: "monkey.png",
/** @const */ BALLOONS: "balloons.png",
/** @const */ SYMBOL_STOP: "Symbol-Stop.png",
/** @const */ SYMBOL_CHECK: "Symbol-Check.png",
/** @const */ JUNGLEBG: "Jungle_Bkg.png",
/** @const */ ELEPHANT: "elephant.png",
/** @const */ LION: "lion.png",
/** @const */ GIRAFF: "giraff.png",
/** @const */ GARDEN_BG: "bg-garden.png",
/** @const */ GARDEN_SAD_BG: "bg-sadgarden.png",
/** @const */ TREEGAME_BACKGROUND:   "minigames/treegame/background.png",
/** @const */ TREEGAME_TREEDOTS:   "minigames/treegame/treedots.png",
/** @const */ TREEGAME_COVER:        "minigames/treegame/lizard_cover.png",
/** @const */ TREEGAME_LIZARD_STANDING: "minigames/treegame/lizard/lizard-standing.png",
/** @const */ TREEGAME_LIZARD_STEP1: "minigames/treegame/lizard/lizard-step1.png",
/** @const */ TREEGAME_LIZARD_STEP2: "minigames/treegame/lizard/lizard-step2.png",
/** @const */ TREEGAME_LIZARD_MOUTH1: "minigames/treegame/lizard/mouth-1.png",
/** @const */ TREEGAME_LIZARD_MOUTH2: "minigames/treegame/lizard/mouth-2.png",
/** @const */ TREEGAME_LIZARD_MOUTH3: "minigames/treegame/lizard/mouth-3.png",
/** @const */ TREEGAME_LIZARD_MOUTH4: "minigames/treegame/lizard/mouth-4.png",
/** @const */ TREEGAME_LIZARD_TONGUE1: "minigames/treegame/lizard/tongue/tongue-1.png",
/** @const */ TREEGAME_LIZARD_TONGUE2: "minigames/treegame/lizard/tongue/tongue-2.png",
/** @const */ TREEGAME_LIZARD_TONGUE3: "minigames/treegame/lizard/tongue/tongue-3.png",
/** @const */ TREEGAME_LIZARD_TONGUE4: "minigames/treegame/lizard/tongue/tongue-4.png",
/** @const */ TREEGAME_LIZARD_TONGUE5: "minigames/treegame/lizard/tongue/tongue-last.png",
/** @const */ NUMPAD_WOOD:     "nrpad.png",
/** @const */ PARCEL_1:       "minigames/treegame/paket-1.png",
/** @const */ PARCEL_2:       "minigames/treegame/paket-2.png",
/** @const */ PARCEL_3:       "minigames/treegame/paket-3.png",
/** @const */ BUTTON_WOOD: "buttons/wood.png",
/** @const */ BUTTON_WOOD_SELECTED: "buttons/wood-selected.png",
/** @const */ DOTS_1: "numbers/dots/prick-1.png",
/** @const */ DOTS_2: "numbers/dots/prick-2.png",
/** @const */ DOTS_3: "numbers/dots/prick-3.png",
/** @const */ DOTS_4: "numbers/dots/prick-4.png",
/** @const */ DOTS_5: "numbers/dots/prick-5.png",
/** @const */ DOTS_6: "numbers/dots/prick-6.png",
/** @const */ CLOUD: "moln.png",
/** @const */ WATERDROP: "vattendroppe.png",
/** @const */ PITCHER: "vattenkanna.png",
/** @const */ PITCHER_BOTTOM: "vattenkanna-botten.png",

/** @const */ AGENT_MOUSE_NORMAL:      "agents/mouse/normal.png",
/** @const */ AGENT_MOUSE_NORMAL_NO_ARM: "agents/mouse/normal-no-arm.png",
/** @const */ AGENT_MOUSE_HEAD: "agents/mouse/head.png",
/** @const */ AGENT_FACE_NORMAL_MOUSE: "agents/mouse/facials/m-normal.png",
/** @const */ AGENT_FACE_HAPPY_MOUSE:  "agents/mouse/facials/m-glad.png",
/** @const */ AGENT_FACE_SURPRISED_MOUSE: "agents/mouse/facials/m-suprised.png"
};

MW.Images = {};

MW.ImageHandler = (function() {
	var imageHandler = {};
	
	var images = {};

	var _img_total = 0;
	var _img_progress = 0;
	for (var src in MW.Images) {
	    _img_total++;
	}
	
	imageHandler.getProgress = function() { return _img_progress; };
	
	imageHandler.loadImages = function(callback) {
		Log.debug("Loading images...", "images");
		var loadedImages = 0;
		var numImages = Object.size(MW.ImageSources);
		for (var src in MW.ImageSources) {
			var str = MW.ImageSources[src];
			MW.Images[src] = new Image();
	        MW.Images[src].onload = function(){
	            if (++loadedImages >= numImages) {
	            	callback();
	            }
	            _img_progress = loadedImages / _img_total;
	        };
	        MW.Images[src].src = "../res/img/" + str;
	    }
	};
	return imageHandler;
})();

/**
 * @constructor
 * @param {null|string} soundFile
 * @param {null|string} subtitle
 * @param {number=} instances
 */
MW.SoundEntry = function(soundFile, subtitle, instances) {
	this.soundFile = soundFile;
	this.subtitle = subtitle;
	this._useSubtitle = subtitle != null;
	this.instances = instances;
	this.getSubtitle = function() { return this.subtitle; };
	this.useSubtitle = function() { return this._useSubtitle; };
};

/**
 * @enum {MW.SoundEntry}
 */
MW.Sounds = {
	YAY:                             new MW.SoundEntry("19446__totya__yeah", "YAY"),
	BIKE_HORN:                       new MW.SoundEntry("27882__stickinthemud__bike-horn-double-toot", null),
	TADA:                            new MW.SoundEntry("60443__jobro__tada1", null),
	CLICK:                           new MW.SoundEntry("406__tictacshutup__click-1-d", null, 4),
	NO_MY_TURN:                      new MW.SoundEntry(null, "NO_MY_TURN"),
	CHOOSE_YOUR_FRIEND:              new MW.SoundEntry(null, "CHOOSE_YOUR_FRIEND"),
	THANKS_FOR_CHOOSING_ME:          new MW.SoundEntry(null, "THANKS_FOR_CHOOSING_ME"),
	BUT_YOU_CAN_INTERRUPT:           new MW.SoundEntry(null, "BUT_YOU_CAN_INTERRUPT"),
	IM_GOING_TO_PICK_THIS_ONE:       new MW.SoundEntry(null, "IM_GOING_TO_PICK_THIS_ONE"),
	YES_I_THINK_THAT_ONE_IS_BETTER:  new MW.SoundEntry(null, "YES_I_THINK_THAT_ONE_IS_BETTER"),
	MAYBE_THAT_WORKS:                new MW.SoundEntry(null, "MAYBE_THAT_WORKS"),
	YAY_HELPED_ME_GET_WATER_DROP_1:  new MW.SoundEntry(null, "YAY_HELPED_ME_GET_WATER_DROP_1"),
	YAY_HELPED_ME_GET_WATER_DROP_2:  new MW.SoundEntry(null, "YAY_HELPED_ME_GET_WATER_DROP_2"),
	LETS_FILL_THE_BUCKET:            new MW.SoundEntry(null, "LETS_FILL_THE_BUCKET"),
	WHICH_ONE_DO_YOU_THINK_IT_IS:    new MW.SoundEntry(null, "WHICH_ONE_DO_YOU_THINK_IT_IS"),
	MONKEY_HMM:                      new MW.SoundEntry(null, "MONKEY_HMM"),
	MAGIC_CHIMES:                    new MW.SoundEntry("51710__bristolstories__u-chimes3_short", null),
	DRIP:                            new MW.SoundEntry("25879__acclivity__drip1", null),

	INTRO_1:                         new MW.SoundEntry(null, "INTRO_1"),
	INTRO_2:                         new MW.SoundEntry(null, "INTRO_2"),
	INTRO_3:                         new MW.SoundEntry(null, "INTRO_3"),
	INTRO_4:                         new MW.SoundEntry(null, "INTRO_4"),
	INTRO_5:                         new MW.SoundEntry(null, "INTRO_5"),
	INTRO_GARDEN_1:                  new MW.SoundEntry(null, "INTRO_GARDEN_1"),
	INTRO_GARDEN_2:                  new MW.SoundEntry(null, "INTRO_GARDEN_2"),

	LADDER_LOOKS_FUN:                new MW.SoundEntry(null, "LADDER_LOOKS_FUN"),
	LADDER_SHOW_ME:                  new MW.SoundEntry(null, "LADDER_SHOW_ME"),
	LADDER_MY_TURN:                  new MW.SoundEntry(null, "LADDER_MY_TURN"),
	LADDER_IS_IT_RIGHT:              new MW.SoundEntry(null, "LADDER_IS_IT_RIGHT"),
	LADDER_IT_WAS_RIGHT:             new MW.SoundEntry(null, "LADDER_IT_WAS_RIGHT"),
	LADDER_PLEASE_HELP_ME:           new MW.SoundEntry(null, "LADDER_PLEASE_HELP_ME"),
	LADDER_AGENT_HELP_IN_INTERRUPT:  new MW.SoundEntry(null, "LADDER_AGENT_HELP_IN_INTERRUPT"),
	
	LADDER_TREE_OOPS_TOO_HIGH:            new MW.SoundEntry(null, "LADDER_TREE_OOPS_TOO_HIGH"),
	LADDER_TREE_OOPS_TOO_LOW:             new MW.SoundEntry(null, "LADDER_TREE_OOPS_TOO_LOW"),
	LADDER_TREE_TRY_A_SMALLER_NUMBER:     new MW.SoundEntry(null, "LADDER_TREE_TRY_A_SMALLER_NUMBER"),
	LADDER_TREE_TRY_A_BIGGER_NUMBER:      new MW.SoundEntry(null, "LADDER_TREE_TRY_A_BIGGER_NUMBER"),
	LADDER_TREE_AGENT_SUGGEST_SOLUTION_1: new MW.SoundEntry(null, "LADDER_TREE_AGENT_SUGGEST_SOLUTION_1"),
	LADDER_TREE_AGENT_SUGGEST_SOLUTION_2: new MW.SoundEntry(null, "LADDER_TREE_AGENT_SUGGEST_SOLUTION_2"),
	LADDER_TREE_BETTER_BECAUSE_BIGGER:   new MW.SoundEntry(null, "LADDER_TREE_BETTER_BECAUSE_BIGGER"),
	LADDER_TREE_BETTER_BECAUSE_SMALLER:    new MW.SoundEntry(null, "LADDER_TREE_BETTER_BECAUSE_SMALLER"),
	LADDER_TREE_AGENT_PLAY_TOO_LOW:         new MW.SoundEntry(null, "LADDER_TREE_AGENT_PLAY_TOO_LOW"),
	LADDER_TREE_AGENT_PLAY_TOO_HIGH:   new MW.SoundEntry(null, "LADDER_TREE_AGENT_PLAY_TOO_HIGH"),
	LADDER_TREE_AGENT_SEE_CORRECT:        new MW.SoundEntry(null, "LADDER_TREE_AGENT_SEE_CORRECT"),
	LADDER_TREE_TONGUE:                    new MW.SoundEntry("34208__acclivity__tongueclick1", null),
	
	LADDER_MOUNTAIN_IM_DOWN_HERE:    new MW.SoundEntry(null, "LADDER_MOUNTAIN_IM_DOWN_HERE"),
	LADDER_MOUNTAIN_IM_UP_HERE:      new MW.SoundEntry(null, "LADDER_MOUNTAIN_IM_UP_HERE"),
	LADDER_MOUNTAIN_TRY_FEWER_BALLOONS: new MW.SoundEntry(null, "LADDER_MOUNTAIN_TRY_FEWER_BALLOONS"),
	LADDER_MOUNTAIN_TRY_MORE_BALLOONS: new MW.SoundEntry(null, "LADDER_MOUNTAIN_TRY_MORE_BALLOONS"),
	LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_1: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_1"),
	LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_2: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_2"),
	LADDER_MOUNTAIN_BETTER_BECAUSE_BIGGER: new MW.SoundEntry(null, "LADDER_MOUNTAIN_BETTER_BECAUSE_BIGGER"),
	LADDER_MOUNTAIN_BETTER_BECAUSE_SMALLER: new MW.SoundEntry(null, "LADDER_MOUNTAIN_BETTER_BECAUSE_SMALLER"),
	LADDER_MOUNTAIN_AGENT_PLAY_TOO_LOW: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_PLAY_TOO_LOW"),
	LADDER_MOUNTAIN_AGENT_PLAY_TOO_HIGH: new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_PLAY_TOO_HIGH"),
	LADDER_MOUNTAIN_AGENT_SEE_CORRECT:        new MW.SoundEntry(null, "LADDER_MOUNTAIN_AGENT_SEE_CORRECT"),
	
	LADDER_MOUNTAIN_YOU_SAVED_ME:    new MW.SoundEntry(null, "LADDER_MOUNTAIN_YOU_SAVED_ME"),
	LADDER_MOUNTAIN_IM_HUNGRY:       new MW.SoundEntry(null, "LADDER_MOUNTAIN_IM_HUNGRY"),

	"NUMBER_1":                      new MW.SoundEntry(null, "NUMBER_1"),
	"NUMBER_2":                      new MW.SoundEntry(null, "NUMBER_2"),
	"NUMBER_3":                      new MW.SoundEntry(null, "NUMBER_3"),
	"NUMBER_4":                      new MW.SoundEntry(null, "NUMBER_4"),
	"NUMBER_5":                      new MW.SoundEntry(null, "NUMBER_5"),
	"NUMBER_6":                      new MW.SoundEntry(null, "NUMBER_6"),
	"NUMBER_7":                      new MW.SoundEntry(null, "NUMBER_7"),
	"NUMBER_8":                      new MW.SoundEntry(null, "NUMBER_8"),
	"NUMBER_9":                      new MW.SoundEntry(null, "NUMBER_9"),
	"NUMBER_10":                     new MW.SoundEntry(null, "NUMBER_10")
		
	,ARE_YOU_READY_TO_TEACH:
		new MW.SoundEntry(null, "ARE_YOU_READY_TO_TEACH"),

	GET_BANANA:
		new MW.SoundEntry(null/*"60443__jobro__tada1"*/, null, 2),

	FISHING_FREE_WRONG_ONES:
		new MW.SoundEntry(null, "FISHING_FREE_WRONG_ONES"),
		
	FISHING_CATCH:
		new MW.SoundEntry(null, "FISHING_CATCH"),
		
	FISHING_NOT_THIS_ONE:
		new MW.SoundEntry(null, "FISHING_NOT_THIS_ONE"),
	
	FISHING_THERE_ARE_MORE:
		new MW.SoundEntry(null, "FISHING_THERE_ARE_MORE"),
		
	FISHING_KEEP_GOING:
		new MW.SoundEntry(null, "FISHING_KEEP_GOING"),
		
	FISHING_ARE_YOU_SURE:
		new MW.SoundEntry(null, "FISHING_ARE_YOU_SURE"),
		
	FISHING_COUNT_FISH:
		new MW.SoundEntry(null, "FISHING_COUNT_FISH"),

	FISHING_COUNT_TARGET_FISH:
		new MW.SoundEntry(null, "FISHING_COUNT_TARGET_FISH"),
		
	FISHING_WINDING:
		new MW.SoundEntry(/*"34968__mike-campbell__f-s-1-fishing-reel"*/null, null), 

	FISHING_SPLASH:
		new MW.SoundEntry(/*"water_movement_fast_002"*/null, null),

	FISHING_SWOSH:
		new MW.SoundEntry(/*"60009__qubodup__swosh-22"*/ null, null),
		
	FISHING_ANGEL_CHOOSE_FISH:
		new MW.SoundEntry(null, "FISHING_ANGEL_CHOOSE_FISH"),
		
	FISHING_ANGEL_COUNT:
		new MW.SoundEntry(null, "FISHING_ANGEL_COUNT"),
	
	BUBBA_HI:
		new MW.SoundEntry(null, "BUBBA_HI"),
		
	BUBBA_HERE_TO_HELP:
		new MW.SoundEntry(null, "BUBBA_HERE_TO_HELP"),
		
	MONKEY_LEARNED_WELL:
		new MW.SoundEntry(null, "MONKEY_LEARNED_WELL"),
		
	MONKEY_DIDNT_LEARN_WELL:
		new MW.SoundEntry(null, "MONKEY_DIDNT_LEARN_WELL"),
		
	LETS_SHOW_HIM_AGAIN:
		new MW.SoundEntry(null, "LETS_SHOW_HIM_AGAIN"),
	
	THANK_YOU_FOR_HELPING:
		new MW.SoundEntry(null, "THANK_YOU_FOR_HELPING"),
		
	NOW_MONKEY_SHOW_YOU:
		new MW.SoundEntry(null, "NOW_MONKEY_SHOW_YOU")
};

MW.Sound = (function() {
	
	var sound = {};
	var stage = null;
	var subtitleLayer = null;
	var subtitles = new Array();
	var soundSources = null;
	var subtitlesOn = true;
	
	sound.setStage = function(s) { stage = s; subtitleLayer = stage._subtitleLayer; };
	
	function addSubtitle(text) {
		for (var i = 0; i < subtitles.length; i++) {
			subtitles[i].attrs.y -= 30; 
		}
		subtitles.push(text);
	};
	
	function removeSubtitle(text) {
		for (var i = 0; i < subtitles.length; i++) {
			if (subtitles[i] === text) {
				subtitles.splice(i, 1);
			}
		}
	};
	
	function initiateSources() {
		soundSources = new Array();

		for (var key in MW.Sounds) {
			var entry = MW.Sounds[key];
			MW.Sounds[key]._key = key;
			if (entry.soundFile != null) {
				var e = {
					id: key,
					src: "../res/sound/" + entry.soundFile + ".ogg|" + "../res/sound/" + entry.soundFile + ".mp3"
				};
				if (entry.instances != undefined) {
					e.data = entry.instances;
				}
				soundSources.push(e);
			}
		}
	};
	
	sound.getSources = function() {
		if (soundSources === null) initiateSources();
		return soundSources;
	};
	
	/**
	 * @param {MW.SoundEntry} entry
	 */
	sound.play = function(entry) {
		var str = entry.getSubtitle();
		Log.notify("\"" + str + "\"", "sound");
		var mute = false;
		
		if (subtitlesOn && entry.useSubtitle()) {
			var text = new Kinetic.Text({
				x: 0,
				y: subtitleLayer.getParent().attrs.height - 50,
				text: MW.Strings.get(str),
				fontSize: 26,
				fontFamily: "Nobile",
				textFill: "white",
				textStroke: "black",
				align: "center",
				fontStyle: "bold",
				width: subtitleLayer.getParent().getWidth(),
				height: 50,
				verticalAlign: "middle",
				textStrokeWidth: 2
			});
			addSubtitle(text);
			subtitleLayer.add(text);
			stage.pleaseDrawOverlayLayer();
			setTimeout(function() {
				subtitleLayer.remove(text);
				stage.pleaseDrawOverlayLayer();
				removeSubtitle(text);
			}, 3000);
		}
		if (!mute && entry.soundFile != null) {
			SoundJS.play(entry._key);
		}
	};
	
	/**
	 * @param {MW.SoundEntry} entry
	 */
	sound.stop = function(entry) {
		SoundJS.stop(entry._key);
	};

	sound.triggerSubtitles = function () {
		if (subtitlesOn) {
			subtitlesOn = false;
			console.info("Turning off subtitles");
		} else {
			subtitlesOn = true;
			console.info("Turning on subtitles");
		}
	};

	return sound;
})();

MW.Strings = (function() {
	
	var strings = {
	"INIT_LOADING_SOUNDS": {
		"sv": "Laddar ner ljud...",
		"en": "Downloading sounds..."
	},
	
	"INIT_LOADING_IMAGES": {
		"sv": "Laddar ner bilder...",
		"en": "Downloading images..."
	},
	
	"RESTART": {
		"sv": "Starta om",
		"en": "Restart"
	},
	
	"SETTINGS": {
		"sv": "Inställningar",
		"en": "Settings"
	},
	
	"YAY": {
		"sv": "Hurra!",
		"en": "Yay!"
	},
	
	"INTRO_1": {
		"sv": "Hej! De här vännerna behöver din hjälp",
		"en": "Hello! These friends need your help"
	},
	
	"INTRO_2": {
		"sv": "med att få deras trädgård att växa.",
		"en": "to make their garden grow."
	},
	
	"INTRO_3": {
		"sv": "Om du kan lära din vän hur man spelar spelen",
		"en": "If you can teach your friend how to do the games"
	},
	
	"INTRO_4": {
		"sv": "kan han eller hon samla vattendroppar -",
		"en": "he or she can collect water drops -"
	},
	
	"INTRO_5": {
		"sv": "- för att få deras trädgård att växa -",
		"en": "- to make their garden grow again -"
	},
	
	"INTRO_GARDEN_1": {
		"sv": "- från det här...",
		"en": "- from this..."
	},
	
	"INTRO_GARDEN_2": {
		"sv": "...till det här!",
		"en": "...to this!"
	},
	
	"CHOOSE_YOUR_FRIEND": {
		"sv": "Börja med att välja vilken vän du vill hjälpa!",
		"en": "First, choose the friend you would like to teach!"
	},
	
	"THANKS_FOR_CHOOSING_ME": {
		"sv": "Ja! Tack för att du valde mig!",
		"en": "Yay! Thanks for choosing me!"
	},
	
	"ARE_YOU_READY_TO_TEACH": {
		"sv": "Är du redo att lära apan?",
		"en": "Are you ready to teach monkey?"
	},
	
	"NO_MY_TURN": {
		"sv": "Glöm inte att det är MIN tur nu!",
		"en": "Remember it’s MY turn now!"
	},

	"BUT_YOU_CAN_INTERRUPT": {
		"sv": "Men du kan avbryta mig om jag gör fel.",
		"en": "But you can interrupt me if I'm making a mistake."
	},
	
	"MAYBE_THAT_WORKS": {
		"sv": "Okej, vi testar och ser om det är rätt.",
		"en": "OK, let's see if this works."
	},
	
	"YAY_HELPED_ME_GET_WATER_DROP_1": {
		"sv": "Hurra! Du hjälpte mig att få en vattendroppe",
		"en": "Yay! You helped me get a water drop"
	},
	
	"YAY_HELPED_ME_GET_WATER_DROP_2": {
		"sv": "till min trädgård, så den kan växa!",
		"en": "for my garden to grow again!"
	},
	
	"LETS_FILL_THE_BUCKET": {
		"sv": "Kom igen och fyll kannan!",
		"en": "Let's fill the bucket!"
	},
	
	"WHICH_ONE_DO_YOU_THINK_IT_IS": {
		"sv": "Vilken tror du att det är?",
		"en": "Which one do you think it is?"
	},
	
	"YES_I_THINK_THAT_ONE_IS_BETTER": {
		"sv": "Ja, det där fungerar nog bättre!",
		"en": "Yes, I think that one is better!"
	},
	
	"LADDER_TREE_BETTER_BECAUSE_BIGGER": {
		"sv": "Ja, det verkar vara ett bra val, eftersom den ÄR större!",
		"en": "Yes, that seems to be a good choice because it IS bigger!"
	},
	
	"LADDER_TREE_BETTER_BECAUSE_SMALLER": {
		"sv": "Ja, det verkar vara ett bra val, eftersom den ÄR mindre!",
		"en": "Yes, that seems to be a good choice because it IS smaller!"
	},
	
	"IM_GOING_TO_PICK_THIS_ONE": {
		"sv": "Okej, får se om den här fungerar. Hmm...",
		"en": "Ok, let's see if this works. Hmm..."
	},
	
	"FISHING_CATCH_NUMBER": {
		"sv": "Fånga nummer %1",
		"en": "Catch number %1"
	},
	
	"FISHING_CATCH": {
		"sv": "Fånga",
		"en": "Catch"
	},

	"FISHING_FREE_WRONG_ONES": {
		"sv": "Frige fiskarna som är fel",
		"en": "Put back the wrong fish"
	},
	
	"FISHING_NOT_THIS_ONE": {
		"sv": "Inte den!",
		"en": "Not this one!"
	},
	
	"FISHING_THERE_ARE_MORE": {
		"sv": "Det finns mer fiskar att fånga. Fortsätt leta!",
		"en": "There are more fish to catch. Keep looking!"
	},
	
	"FISHING_ARE_YOU_SURE": {
		"sv": "Är du säker?",
		"en": "Are you sure?"
	},
	
	"FISHING_COUNT_FISH": {
		"sv": "Räkna fiskarna!",
		"en": "Count the fish!"
	},
	
	"FISHING_COUNT_TARGET_FISH": {
		"sv": "Räkna fiskarna med",
		"en": "Count the fish with"
	},
	
	"FISHING_ANGEL_CHOOSE_FISH": {
		"sv": "Jag väljer den här fisken eftersom...",
		"en": "I choose this fish, because it..."
	},
	
	"FISHING_ANGEL_COUNT": {
		"sv": "Jag väljer den här siffran eftersom...",
		"en": "I choose this number, because..."
	},
	
	"LADDER_LOOKS_FUN": {
		"sv": "Det där såg kul ut!",
		"en": "That looked fun!"
	},
	
	"LADDER_SHOW_ME": {
		"sv": "Visa mig hur man gör!",
		"en": "Now show me how to do it!"
	},
	
	"LADDER_MY_TURN": {
		"sv": "Okej, nu ska vi se om jag klarar det här själv!",
		"en": "Ok, now let's see if I can do this on my own!"
	},
	
	"LADDER_IS_IT_RIGHT": {
		"sv": "Gör jag rätt eller fel?",
		"en": "Am I doing it right or wrong?"
	},
	
	"LADDER_IT_WAS_RIGHT": {
		"sv": "Ja! Du fick presenten!",
		"en": "Yeah! You got it!" 
	},
	
	"LADDER_TREE_OOPS_TOO_HIGH": {
		"sv": "Oj, kanske tog vi i för mycket!",
		"en": "Oops! Maybe we overdid it!"
	},
	
	"LADDER_TREE_OOPS_TOO_LOW": {
		"sv": "Hmm... Kanske var det inte tillräckligt!",
		"en": "Hmm... Maybe it wasn't enough!"
	},
	
	"LADDER_TREE_TRY_A_SMALLER_NUMBER": {
		"sv": "Vi kan väl testa en mindre och se vad som händer!",
		"en": "Let's try a smaller one and see what happens!"
	},
	
	"LADDER_TREE_TRY_A_BIGGER_NUMBER": {
		"sv": "Vad tror du? Ska vi testa en större?",
		"en": "What do you think? Shall we try a bigger one?"
	},
	
	"LADDER_TREE_AGENT_PLAY_TOO_LOW": {
		"sv": "Hmm, det gick inte. Jag undrar varför. Jag testar en större!",
		"en": "Hmm, that didn't work. I wonder why. Let me try a bigger one!"
	},
	
	"LADDER_TREE_AGENT_PLAY_TOO_HIGH": {
		"sv": "Åh, nej! Var den för stor?",
		"en": "Oh no! Was that too big?"
	},
	
	"LADDER_TREE_AGENT_SEE_CORRECT": {
		"sv": "WOO! Tack för hjälpen! Vilken fin present!",
		"en": "WOO! Thank you for helping me! What a great surprise!"
	},
	
	"LADDER_TREE_AGENT_SUGGEST_SOLUTION_1": {
		"sv": "Kanske kan vi försöka med samma siffra på",
		"en": "Maybe we should match the number on"
	},
	
	"LADDER_TREE_AGENT_SUGGEST_SOLUTION_2": {
		"sv": "nummerplattan som vid presenten?",
		"en": "the number pad to the number by the gift?"
	},
	
	"LADDER_PLEASE_HELP_ME": {
		"sv": "Kan du hjälpa mig att välja rätt?",
		"en": "Can you please help me find the right one?"
	},
	
	"LADDER_MOUNTAIN_IM_DOWN_HERE": {
		"sv": "Jag är här nere!",
		"en": "I'm down here!"
	},
	
	"LADDER_MOUNTAIN_IM_UP_HERE": {
		"sv": "Jag är här uppe!",
		"en": "I'm up here!"
	},
	
	"LADDER_MOUNTAIN_YOU_SAVED_ME": {
		"sv": "Du räddade mig!!!",
		"en": "You saved me!!!"
	},
	
	"LADDER_MOUNTAIN_IM_HUNGRY": {
		"sv": "Jag är hungrig. Kom så går vi och äter!",
		"en": "I'm hungry. Let's go eat!"
	},
	
	"LADDER_MOUNTAIN_TRY_FEWER_BALLOONS": {
		"sv": "Kanske ska vi testa med färre ballonger?",
		"en": "Perhaps we should try with fewer balloons?"
	},
	
	"LADDER_MOUNTAIN_TRY_MORE_BALLOONS": {
		"sv": "Vi kan väl testa med fler ballonger och se vad som händer?",
		"en": "Let's try with more balloons and see what happens!"
	},
	
	"LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_1": {
		"sv": "Kanske kan vi försöka med lika många ballonger",
		"en": "Maybe we should match the number of balloons"
	},
	
	"LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_2": {
		"sv": "som nivåer upp din vän är.",
		"en": "to the level your friend is stuck on."
	},
	
	"LADDER_MOUNTAIN_AGENT_PLAY_TOO_LOW": {
		"sv": "Oj, det kanske var för få ballonger.",
		"en": "Oops, maybe I used to few balloons."
	},
	
	"LADDER_MOUNTAIN_AGENT_PLAY_TOO_HIGH": {
		"sv": "Hoppsan, det var nog för många ballonger!",
		"en": "Oops, I think there were too many balloons!"
	},
	
	"LADDER_MOUNTAIN_BETTER_BECAUSE_BIGGER": {
		"sv": "Ja, det fungerar nog, för det ÄR fler ballonger!",
		"en": "Yes, this can work, beacuse that IS more ballons!"
	},
	
	"LADDER_MOUNTAIN_BETTER_BECAUSE_SMALLER": {
		"sv": "Ja, det fungerar nog, för det ÄR färre ballonger!",
		"en": "Yes, this will probably work, beacuse that IS fewer balloons!"
	},
	
	"LADDER_MOUNTAIN_AGENT_SEE_CORRECT": {
		"sv": "WOO! Tack för hjälpen! Vi räddade vår vän!",
		"en": "WOO! Thank you for helping me! We saved our friend!"
	},
	
	"BUBBA_HI": {
		"sv": "Hej! Mitt namn är Bubba!",
		"en": "Hi, my name is Bubba!"
	},
	
	"BUBBA_HERE_TO_HELP": {
		"sv": "Jag ska hjälpa dig och apan längs vägen.",
		"en": "I'm here to help you and monkey throughout his journey."
	},
	
	"MONKEY_LEARNED_WELL": {
		"sv": "Toppen! Apan lärde sig bra!",
		"en": "Great! Monkey learned well!"
	},
	
	"MONKEY_DIDNT_LEARN_WELL": {
		"sv": "Åh, nej! Apan lärde sig inte riktigt.",
		"en": "Oh no! Monkey didn't learn well."
	},
	
	"LETS_SHOW_HIM_AGAIN": {
		"sv": "Visa honom igen!",
		"en": "Let's show him again!"
	},
	
	"THANK_YOU_FOR_HELPING": {
		"sv": "Tack för att du hjälpte apan!",
		"en": "Thank you for helping monkey!"
	},
	
	"NOW_MONKEY_SHOW_YOU": {
		"sv": "Nu visar apan dig vad den har lärt sig!",
		"en": "Now monkey show you what it learned!"	
	},
	
	"MONKEYS_TURN": {
		"sv": "Apans tur!",
		"en": "Monkey's turn!"
	},
	
	"MONKEY_HMM": {
		"sv": "Apan: Hmmm...",
		"en": "Monkey: Hmm..."
	},
	
	"FISHING_KEEP_GOING": {
		"sv": "Fortsätt!",
		"en": "Keep going!"
	},
	
	"NUMBER_1": {
		"sv": "nummer 1",
		"en": "number 1"
	},

	"NUMBER_2": {
		"sv": "nummer 2",
		"en": "number 2"
	},
	
	"NUMBER_3": {
		"sv": "nummer 3",
		"en": "number 3"
	},
	
	"NUMBER_4": {
		"sv": "nummer 4",
		"en": "number 4"
	},
	
	"NUMBER_5": {
		"sv": "nummer 5",
		"en": "number 5"
	},
	
	"NUMBER_6": {
		"sv": "nummer 6",
		"en": "number 6"
	},
	
	"NUMBER_7": {
		"sv": "nummer 7",
		"en": "number 7"
	},
	
	"NUMBER_8": {
		"sv": "nummer 8",
		"en": "number 8"
	},
	
	"NUMBER_9": {
		"sv": "nummer 9",
		"en": "number 9"
	},
	
	"NUMBER_10": {
		"sv": "nummer 10",
		"en": "number 10"
	},
	
	"SETTINGS_LABEL": {
		"sv": "Inställningar",
		"en": "Settings"
	},
	
	"SETTINGS_APPLY": {
		"sv": "Verkställ",
		"en": "Apply"
	},
	
	"SETTINGS_SHOW": {
		"sv": "Visa inställningar",
		"en": "Show settings"
	},
	
	"SETTINGS_HIDE": {
		"sv": "Göm inställningar",
		"en": "Hide settings"
	},
	
	"SETTINGS_CANCEL": {
		"sv": "Avbryt",
		"en": "Cancel"
	},
	
	"SETTINGS_GLOBAL_LABEL": {
		"sv": "Globala",
		"en": "Global"
	},

	"SETTINGS_GLOBAL_LANGUAGE_LABEL": {
		"sv": "Språk (kan vara \"sv\" eller \"en\" och kräver omstart)",
		"en": "Language (can be \"sv\" or \"en\" and requires restart)"
	},
	
	"SETTINGS_GLOBAL_MONKEYSEEROUNDS_LABEL": {
		"sv": "Monkey See-rundor",
		"en": "Monkey See rounds"
	},
	
	"SETTINGS_GLOBAL_TRIESBEFOREGUARDIANANGEL_LABEL": {
		"sv": "Försök innan skyddsängel",
		"en": "Tries before guardian angel"
	},
	
	"SETTINGS_MINIGAMES_LABEL": {
		"sv": "Minispel",
		"en": "Mini-games"
	},
	
	"SETTINGS_MINIGAMES_FISHINGGAME_LABEL": {
		"sv": "Fiskespel",
		"en": "Fishing Game"
	},
	
	"SETTINGS_MINIGAMES_FISHINGGAME_TARGETNUMBER_LABEL": {
		"sv": "Målnummer",
		"en": "Target number"
	},
	
	"SETTINGS_MINIGAMES_FISHINGGAME_NUMBERCORRECT_LABEL": {
		"sv": "Antal korrekta fiskar",
		"en": "Number of correct fish"
	},
	
	"SETTINGS_MINIGAMES_FISHINGGAME_NUMBEROFFISH_LABEL": {
		"sv": "Antal fiskar totalt",
		"en": "Number of fish totally"
	},
	
	"SETTINGS_MINIGAMES_FISHINGGAME_MAXNUMBER_LABEL": {
		"sv": "Högsta möjliga nummer",
		"en": "Maximum number on fish"
	},
	
	"SETTINGS_MINIGAMES_LADDER_LABEL": {
		"sv": "Stegen",
		"en": "The Ladder"
	},
	
	"SETTINGS_MINIGAMES_LADDER_TARGETNUMBER_LABEL": {
		"sv": "Målnummer",
		"en": "Target number"
	}
	};
	
	return {
		/**
		 * @param {string} str
		 * @param {...number} var_args
		 */
		get: function(str, var_args) {
			if (strings[str] === undefined) return null;
			var tmp = strings[str][Settings.get("global", "language")];
			for(var i = 1; i < arguments.length; i++) 
			      tmp = tmp.replace("%"+i, arguments[i]);
			return tmp;
		}		
	};
})();
///**
// * @param {Function} childCtor
// * @param {Function} parentCtor
// */
//function inherit(childCtor, parentCtor) {
//	/** @constructor */
//	function tempCtor() {};
//	tempCtor.prototype = parentCtor.prototype;
//	childCtor.superClass_ = parentCtor.prototype;
//	childCtor.prototype = new tempCtor();
//	childCtor.prototype.constructor = childCtor;
//}


var _uid = 0;
function uniqueId() {
	return _uid++;
}

Object.size = function(obj) {
    var size = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/** @constructor */
function _Log () {
	console.log("Creating Log");
	/**
	 * @param {string} type
	 * @param {string} msg
	 * @param {string} tag
	 * @param {Function} output
	 */
	function write(type, msg, tag, logger, output) {
		if (tag === undefined) {
			tag = "";
		} else if (typeof tag !== "string") {
			/*
			 * The Google Closure compiler sometimes turns the tag
			 * argument into something else when it should be
			 * undefined.
			 */
			tag = "";
		}
		if (tag != "evm" && tag != "sound") {
			tag = tag.substr(0,8);
			tag = tag.toUpperCase();
			var num = 8-tag.length;
			for (var i = 0; i < num; i++) {
				tag = " " + tag;
			}
			//tag += " ";
			output.call(logger, type + " " + tag + " " + msg);
		}
	};
	
	/**
	 * @param {string} msg
	 * @param {string} tag
	 */
	this.debug = function(msg, tag) {
		write("DEBUG  ", msg, tag, console, console.debug);
	};
	
	this.warning = function(msg, tag) {
		write("WARNING", msg, tag, console, console.warn);
	};
	
	this.notify = function(msg, tag) {
		write("NOTIFY ", msg, tag, console, console.info);
	};
	
	this.error = function(msg, tag) {
		write("ERROR  ", msg, tag, console, console.error);
	};
}

var Log = new _Log();

/**
 * @param {Object} item
 */
Array.prototype.remove = function(item) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === item) {
			this.splice(i);
		}
	}
};

var Utils = new (/** @constructor */function() {

	this.isNumber = function(n) {
		return ! isNaN (n-0);
	};

	/**
	 * @param {...Function} var_args
	 */
	this.chain = function (var_args) {
		var fnc_arguments = arguments;
		return function (input_args) {
			var i, queue = [], next = null, first = true;
			for (i = 0; i < fnc_arguments.length; i += 1) {
				queue.push(fnc_arguments[i]);
			}
			/**
			 * @param {...} args
			 */
			next = function (args) {
				if (first) {
					args = input_args;
					first = false;
				}
				var fnc = (queue.shift());
				if (fnc != undefined)
					fnc(next, args);
			};
			next();
		};
	};

	this.bezier = function(percent,C1,C2,C3,C4) {
		//====================================\\
		// 13thParallel.org Beziér Curve Code \\
		//   by Dan Pupius (www.pupius.net)   \\
		//====================================\\
		
		// Modified by <bjorn.norrliden@gmail.com> to compilable JavaScript. 

		/**
		 * @constructor
		 * @param {number=} x
		 * @param {number=} y
		 */
		function coord(x,y) {
		  if(x === undefined) x=0;
		  if(y === undefined) y=0;
		  return {x: x, y: y};
		}

		function B1(t) { return t*t*t; }
		function B2(t) { return 3*t*t*(1-t); }
		function B3(t) { return 3*t*(1-t)*(1-t); }
		function B4(t) { return (1-t)*(1-t)*(1-t); }

		function getBezier(percent,C1,C2,C3,C4) {
		  var pos = new coord();
		  pos.x = C1.x*B1(percent) + C2.x*B2(percent) + C3.x*B3(percent) + C4.x*B4(percent);
		  pos.y = C1.y*B1(percent) + C2.y*B2(percent) + C3.y*B3(percent) + C4.y*B4(percent);
		  return pos;
		}
		return getBezier(percent,C1,C2,C3,C4);
	};
	
	this.scaleShape = function(shape, scale) {
		if (shape.x != undefined) shape.x *= scale;
		if (shape.y != undefined) shape.y *= scale;
		if (shape.width != undefined) shape.width *= scale;
		if (shape.height != undefined) shape.height *= scale;
		if (shape.fontSize != undefined) shape.fontSize *= scale;
		if (shape.scale != undefined) {
			if (shape.scale.x != undefined) shape.scale.x *= scale;
			if (shape.scale.y != undefined) shape.scale.y *= scale;
		}
		return shape;
	};
	
	/**
	 * @param {number} min
	 * @param {number} max
	 * @return {number} A random number in the interval [min, max].
	 */
	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	/**
	 * @param {Array} array
	 * @param {*} obj
	 * @return true if obj is in array, othwerwise false
	 */
	this.inArray = function(array, obj) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === obj)
				return true;
		}
		return false;
	};
	
	/**
	 * @constructor
	 */
	var Gridizer = function(startx, starty, stepx, stepy, width) {
		var gridXPos = 0;
		var gridYPos = 0;
		this.next = function() {
			var xp = startx + gridXPos * stepx;
			var yp = starty + gridYPos * stepy;
			gridXPos = (gridXPos + 1) % width;
			if (gridXPos == 0) {
				gridYPos++;
			}
			return { x: xp, y: yp };
		};
	};
	
	this.gridizer = function(startx, starty, stepx, stepy, width) {
		return new Gridizer(startx, starty, stepx, stepy, width);
	};
	
	/**
	 * Produces an array of given <code>size</code>, where the values are
	 * randomized in the interval [<code>start</code>, <code>end</code>].
	 * It is guaranteed that <code>injected</code> will appear in the
	 * returned array exactly <code>appearances</code> number of times.
	 * 
	 * @param  {number}   start       - start of interval
	 * @param  {number}   end         - end of interval
	 * @param  {number}   size        - size of returned array
	 * @param  {number}   injected    - injected number
	 * @param  {number}   appearances - number of times <code>injected</code>
	 *                                  will appear.
	 * @param  {boolean=} exactly     - if set, the injected number may not
	 *                                  appear at the non-crooked positions.
	 *                                  Default is false.
	 *                                 
	 * @return {Array}    An array of size <code>size</code>, with randomized
	 *                    values in the interval [<code>start</code>,
	 *                    <code>end</code>] and in which <code>injected</code>
	 *                    will appear exactly <code>appearances</code> number
	 *                    of times.
	 */
	this.crookedRandoms = function(start, end, size, injected, appearances, exactly) {
		if (arguments.length == 5)
			exactly = false;
		var array = new Array(size);
		var crookedPositions = new Array(appearances);
		for (var i = 0; i < appearances; i++) {
			var crookedPosition = this.getRandomInt(0, size - 1);
			while (this.inArray(crookedPositions, crookedPosition)) {
				crookedPosition = this.getRandomInt(0, size - 1);
			}
			crookedPositions.push(crookedPosition);
		}
		for (var i = 0; i < size; i++) {
			if (this.inArray(crookedPositions, i)) {
				array[i] = injected;
			} else {
				array[i] = this.getRandomInt(start, end);
				if (exactly) {
					while (array[i] == injected)
						array[i] = this.getRandomInt(start, end);
				}
			}
		}
		return array;
	};

});
/**
 * @constructor
 * @extends {Kinetic.Shape}
 */
Kinetic.Button = function(config) {
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
		fontSize: config.fontSize,
		x: config.width / 2,
		y: config.height / 2,
		verticalAlign: "middle",
		align: "center"
	});
	button.add(_rect);
	button.add(_text);
	button.on("mousedown touchstart", config.callback);
	return button;
};/**
 * @constructor
 */
MW.AgentView = function() {
	var view = this;
	/**
	 * @return {Kinetic.Node}
	 */
	this.getBody = function (x, y) {
		var group = new Kinetic.Group({ x: x, y: y });
		var body = new Kinetic.Image({
			image: view.standing(),
			offset: view.bodyOffset(),
			width: view.standing().width,
			height: view.standing().height
		});
		var face = new Kinetic.Image({
			image: view.normalFace(),
			x: view.faceOffset().x,
			y: view.faceOffset().y
		});
		group.add(body);
		group.add(face);
		return group;
	};

	this.getFace = function (x, y) {
		var group = new Kinetic.Group({ x: x, y: y });
		var head = new Kinetic.Image({
			image: view.head(),
			width: view.head().width,
			height: view.head().height
		});
		var face = new Kinetic.Image({
			image: view.normalFace(),
			x: view.faceOffset().x,
			y: view.faceOffset().y
		});
		group.add(head);
		group.add(face);
		return group;
	};
};

/**
 * @extends {MW.AgentView}
 * @constructor
 */
MW.MonkeyAgentView = function() {
	MW.AgentView.call(this);
	this.normalFace = function () { return MW.Images.MONKEY; };
	this.happyFace = function () { return MW.Images.MONKEY; };
	this.standing = function () { return MW.Images.MONKEY; };
};

/**
 * @extends {MW.AgentView}
 * @constructor
 */
MW.MouseAgentView = function () {
	MW.AgentView.call(this);
	this.bodyOffset = function () { return { x: 0, y: 0 }; };
	this.feetOffset = function () { return 315; };
	this.faceOffset = function () { return { x: -12, y: -11 }; };
	this.head = function () { return MW.Images.AGENT_MOUSE_HEAD; };
	this.standing = function () { return MW.Images.AGENT_MOUSE_NORMAL; };
	this.normalFace = function () { return MW.Images.AGENT_FACE_NORMAL_MOUSE; };
	this.happyFace = function () { return MW.Images.AGENT_FACE_HAPPY_MOUSE; };
};

/**
 * @constructor
 * @extends {ViewModule}
 * @param {MW.AgentChooser} chooser
 */
MW.AgentChooserView = function(chooser) {
	ViewModule.call(this, "AgentChooserView");
	var view = this;
	/** @type {Kinetic.Layer} */ var layer = null;
	/** @const @type {Object.<number>} */
	var CONFIG = {
		/** @const @type {Object.<number>} */
		GRID: {
			/** @const */ X: 363,
			/** @const */ Y: 230,
			/** @const */ WIDTH: 2
		},
		/** @const @type {Object.<number>} */
		BUTTON: {
			/** @const */ WIDTH: 250,
			/** @const */ HEIGHT: 250,
			/** @const */ MARGIN: 60
		}
	};

	/**
	 * Hold buttons
	 */
	var buttons = (function() {
		var buttons = this;
		var array = new Array();
		
		/**
		 * Add a button
		 * @param {Button} button
		 */
		buttons.add = function(button) {
			array.push(button);
			layer.add(button);
		};

		/**
		 * Enable mouse clicks on all buttons
		 */
		buttons.enableClicks = function() {
			for (var i = 0; i < array.length; i++) {
				array[i].attrs.listening = true;
			}
		};

		/**
		 * Disable mouse clicks on all buttons
		 */
		buttons.disableClicks = function() {
			for (var i = 0; i < array.length; i++) {
				array[i].attrs.listening = false;
			}
		};

		/**
		 * Bring a button to the center, hide the others
		 */
		buttons.bringForward = function(button, callback) {
			/** @const @type {number} */ var TIME_HIDE = 1000;
			/** @const @type {number} */ var TIME_MOVE = 1000;
			/** @const @type {number} */ var TIME_WAIT = 5000;
			for (var i = 0; i < array.length; i++) {
				if (array[i] === button) {
					view.getTween(array[i].attrs).wait(TIME_HIDE).to({x: view.stage.getWidth() / 2, y: view.stage.getHeight() / 2}, TIME_MOVE);
					view.getTween(array[i].attrs.scale).wait(TIME_HIDE).to({x: 1.5, y: 1.5}, TIME_MOVE).call(function() {
						MW.Sound.play(MW.Sounds.THANKS_FOR_CHOOSING_ME);
					}).wait(TIME_WAIT).call(callback);
				} else {
					view.getTween(array[i].attrs).to({alpha: 0}, TIME_HIDE);
				}
			}
		};
		
		return buttons;
	})();

	/**
	 * Create a button for an agent
	 * @constructor
	 * @extends {Kinetic.Shape}
	 */
	var Button = function(agent, x, y) {
		var g = new Kinetic.Group({ x: x, y: y });
		var rect = new Kinetic.Rect({
			width: CONFIG.BUTTON.WIDTH,
			height: CONFIG.BUTTON.HEIGHT,
			fill: {
	            start: {
	              x: CONFIG.BUTTON.WIDTH / 2,
	              y: CONFIG.BUTTON.HEIGHT / 2,
	              radius: 0
	            },
	            end: {
		              x: CONFIG.BUTTON.WIDTH / 2,
		              y: CONFIG.BUTTON.HEIGHT / 2,
	              radius: CONFIG.BUTTON.WIDTH * 0.75
	            },
	            colorStops: [0, '#00FF7F', 1, '#556B2F']
	          },
	          shadow: {
	              color: 'black',
	              blur: 15,
	              offset: [15, 15],
	              alpha: 0.5
	            },
			alpha: 0.6,
			cornerRadius: 10,
			strokeWidth: 4,
			stroke: "white",
			offset: {
				x: CONFIG.BUTTON.WIDTH / 2,
				y: CONFIG.BUTTON.HEIGHT / 2
			}
		});
		g.add(rect);
		g._rect = rect;
		g._agent = agent;
		var agentView = new agent.view();
		var img = new Kinetic.Image({
			image: agentView.happyFace(),
			offset: {
				x: agentView.happyFace().width / 2,
				y: agentView.happyFace().height / 2
			}
		});
		g.add(img);
		g.on("mousedown touchstart", function() {
			MW.Sound.play(MW.Sounds.CLICK);
			g._rect.setFill("white");
			g.moveToTop();
			buttons.bringForward(g, function() { chooser.choose(g._agent); });
			buttons.disableClicks();
		});
		return g;
	};

	/**
	 * Setup the view
	 * @private
	 */
	view.setup = function() {
		layer = new Kinetic.Layer();
		view.stage.add(layer);
		var bg = new Kinetic.Image({
			image: MW.Images.JUNGLEBG
		});
		layer.add(bg);
		var buttonGrid = Utils.gridizer(
			CONFIG.GRID.X, CONFIG.GRID.Y,
			CONFIG.BUTTON.WIDTH + CONFIG.BUTTON.MARGIN,
			CONFIG.BUTTON.HEIGHT + CONFIG.BUTTON.MARGIN,
			CONFIG.GRID.WIDTH
		);
		var agents = chooser.getAgents();
		for (var i = 0; i < agents.length; i++) {
			var pos = buttonGrid.next();
			buttons.add(new Button(agents[i], pos.x, pos.y));
		}
		MW.Sound.play(MW.Sounds.CHOOSE_YOUR_FRIEND);
	};

	/**
	 * Tear down the view
	 */
	view.addTearDown(function() {
		view.stage.remove(layer);
	});

	/**
	 * On each frame
	 */
	view.on(MW.Event.FRAME, function(msg) {
		layer.draw();
	});
};
/**
 * @constructor
 * @extends {ViewModule}
 */
MW.GardenView = function () {
	ViewModule.call(this, "GardenView");
	var
		view = this,
		sadBackground,
		happyBackground,
		layer,
		setVerdure,
		pitcherGroup,
		pitcherImage,
		waterPolygon;
	view.addSetup(function () {
		sadBackground = new Kinetic.Image({
			image: MW.Images.GARDEN_SAD_BG
		});
		happyBackground = new Kinetic.Image({
			image: MW.Images.GARDEN_BG
		});
		pitcherGroup = new Kinetic.Group({
			x: 300,
			y: 300,
			visible: false
		});
		pitcherImage = new Kinetic.Image({
			image: MW.Images.PITCHER,
			offset: {
				x: MW.Images.PITCHER.width / 2,
				y: MW.Images.PITCHER.height / 2
			}
		});
		waterPolygon = new Kinetic.Polygon({
		    points: [
				{ x: 40, y: 0 },
				{ x: 60, y: 0 },
				{ x: 80, y: 40 },
				{ x: 41, y: 63 },
				{ x: 15, y: 17 }
		    ],
			offset: {
				x: MW.Images.PITCHER.width / 2,
				y: MW.Images.PITCHER.height / 2
			},
		    fill: "blue"
		});
		layer = new Kinetic.Layer();
		view.getStage().add(layer);
		layer.add(sadBackground);
		layer.add(pitcherGroup);
		pitcherGroup.add(waterPolygon);
		pitcherGroup.add(pitcherImage);
	});
	view.addTearDown(function () {
		view.getStage().remove(layer);
	});

	/**
	 * Make the garden look like last time it was visited, before adding more
	 * water.
	 */
	setVerdure = function () {
		var verdure = view.game.getGardenVerdure();
	};

	view.on(MW.Event.FRAME, function (msg) {
		layer.draw();
	});
	view.on("Game.demonstrateGarden", function (msg) {
		MW.Sound.play(MW.Sounds.INTRO_GARDEN_1);
		happyBackground.setAlpha(0);
		layer.add(sadBackground);
		layer.add(happyBackground);
		setTimeout(function () {
			MW.Sound.play(MW.Sounds.INTRO_GARDEN_2);
			view.getTween(sadBackground.attrs).to({ alpha: 0 }, 2000);
			view.getTween(happyBackground.attrs).to({ alpha: 1 }, 2000).wait(3000).call(msg.callback);
		}, 3000);
	});
	view.on(MW.Event.WATER_GARDEN, function (msg) {
		setVerdure();
		var p = waterPolygon.attrs.points;
		var k1 = (p[0].y - p[4].y) / (p[0].x - p[4].x);
		var k2 = (p[2].y - p[1].y) / (p[2].x - p[1].x);
		var yOffset = 17;
		var newY = p[0].y + yOffset;
		var m1 = p[0].y - k1 * p[0].x;
		var m2 = p[2].y - k2 * p[2].x;
		pitcherGroup.show();
		setTimeout(function () {
			view.getTween(pitcherImage.attrs).to({ rotation: Math.PI / 3 });
			setTimeout(function () {
				// TODO: use TweenJS insted?
				waterPolygon.transitionTo({
					points: {
						0: { x: (newY - m1) / k1, y: newY },
						1: { x: (newY - m2) / k2, y: newY }
					},
					duration: 3,
					callback: function () {
					var k3 = (p[3].y - p[4].y) / (p[3].x - p[4].x);
					var m3 = p[3].y - k3 * p[3].x;
					newY += p[3].y - p[2].y;
						waterPolygon.transitionTo({
							points: {
								0: { x: (newY - m3) / k3, y: newY },
								1: { x: (newY - m2) / k2, y: newY }
							},
							duration: 3,
							callback: function () {
								newY += p[3].y - p[2].y;
								var k4 = (p[2].y - p[3].y) / (p[2].x - p[3].x);
								var m4 = p[2].y - k4 * p[2].x;
								waterPolygon.transitionTo({
									points: {
										0: { x: (newY - m3) / k3, y: newY },
										1: { x: (newY - m3) / k3, y: newY }
									},
									duration: 2,
									callback: function () {
										setTimeout(function () {
											msg.callback();
										}, 3000);
									}
								});
							}
						});
					}
				});
			}, 1000);
		}, 1000);
	});
};
/**
 * @constructor
 * @extends {ViewModule}
 */
MW.IntroductionView = function (callback) {
	ViewModule.call(this, "IntroductionView");
	var
		view = this,
		stage,
		layer;

	view.addSetup(function () {
		stage = view.getStage();
		layer = new Kinetic.Layer();
		stage.add(layer);
		
		//layer.add(new Kinetic.Rect({width:200,height:200,fill:"blue"}));

		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_1); }, 2000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_2); }, 2000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_3); }, 7000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_4); }, 7000);
		view.setTimeout(function () { MW.Sound.play(MW.Sounds.INTRO_5); }, 12000);
		view.setTimeout(function () { callback(); }, 14000);
	});

	view.addTearDown(function () {
		stage.remove(layer);
	});

	view.on(MW.Event.FRAME, function (msg) {
		layer.draw();
	});
};
/**
 * @constructor
 * @extends {ViewModule}
 */
MW.MinigameHandlerView = function () {
	ViewModule.call(this, "MinigameHandlerView");
	/** @type {MW.MinigameHandlerView} */ var view = this;
	/** @type {Kinetic.Stage}          */ var stage = view.stage;
	/** @type {Kinetic.Layer}          */ var layer = stage._gameLayer;
	/**
	 * Show the current total backend score of the minigame.
	 * @param {MW.MinigameHandlerView} view
	 */
	(function (view) {
		/** @const @type {string} */ var label = "Backend Score (current minigame):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 12,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 700,
			y: 35
		});
		var on = false;
		var running = false;
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MINIGAME, function(msg) {
			text.setText(label + " " + msg.score);
		});
		view.on(MW.Event.MINIGAME_STARTED, function(msg) {
			on = true;
			running = true;
			layer.add(text);
		});
		view.on(MW.Event.TRIGGER_SCORE, function () {
			if (running && !on) {
				layer.add(text);
				on = true;
				console.info("Turning off backend score display");
			} else if (running && on) {
				layer.remove(text);
				on = false;
				console.info("Turning on backend score display");
			}
		});
		view.addTearDown(function() {
			running = false;
			on = false;
			layer.remove(text);
		});
	})(this);

	/**
	 * Show the current learning track.
	 * @param {MW.MinigameHandlerView} view
	 */
	(function (view) {
		/** @const @type {string} */ var label = "Learning track (current game):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 12,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 700,
			y: 55
		});
		var on = false, running = false;
		view.on(MW.Event.MINIGAME_STARTED, function(msg) {
			layer.add(text);
			running = true;
			on = true;
		});
		view.on(MW.Event.LEARNING_TRACK_UPDATE, function(msg) {
			text.setText(label + " " + msg.learningTrack.name());
		});
		view.on(MW.Event.TRIGGER_SCORE, function () {
			if (running && !on) {
				layer.add(text);
				on = true;
			} else if (running && on) {
				layer.remove(text);
				on = false;
			}
		});
		view.addTearDown(function() {
			running = false;
			on = false;
			layer.remove(text);
		});
	})(this);

	/**
	 * Show the pitcher
	 */
	(function (view) {
		var pitcherImage, dropImage, pitcherBottomImage, waterRect,
		levelHeight = 6.9, dropOrigin = { x: 10, y: 20 };
		view.addSetup(function () {
			pitcherImage = new Kinetic.Image({
				image: MW.Images.PITCHER,
				x: layer.getStage().getWidth() - MW.Images.PITCHER.width - 20,
				y: 20,
				width: MW.Images.PITCHER.width,
				height: MW.Images.PITCHER.height,
				visible: false
			});
			dropImage = new Kinetic.Image({
				image: MW.Images.WATERDROP,
				offset: {
					x: MW.Images.WATERDROP.width / 2,
					y: 0
				},
				width: MW.Images.WATERDROP.width,
				height: MW.Images.WATERDROP.height,
				visible: false,
				rotation: Math.PI
			});
			pitcherBottomImage = new Kinetic.Image({
				image: MW.Images.PITCHER_BOTTOM,
				x: pitcherImage.getX(),
				y: pitcherImage.getY(),
				width: MW.Images.PITCHER_BOTTOM.width,
				height: MW.Images.PITCHER_BOTTOM.height,
				visible: false
			});
			waterRect = new Kinetic.Rect({
				fill: "#379de4",
				x: pitcherImage.getX() + 20,
				y: pitcherImage.getY() + pitcherImage.getHeight() - 4,
				width: 54,
				height: 0
			});
			layer.add(pitcherBottomImage);
			layer.add(waterRect);
			layer.add(dropImage);
			layer.add(pitcherImage);
		});
		view.addTearDown(function() {
			layer.remove(dropImage);
			layer.remove(pitcherImage);
			layer.remove(pitcherBottomImage);
			layer.remove(waterRect);
		});
		view.on(MW.Event.MINIGAME_STARTED, function (msg) {
			pitcherImage.show();
			var level = view.game.getWaterDrops();
			if (level > 0)
				pitcherBottomImage.show();
			waterRect.setHeight(waterRect.getHeight() - levelHeight * level);
		});
		view.on(MW.Event.PITCHER_LEVEL_RESET, function (msg) {
			pitcherBottomImage.hide();
			waterRect.setHeight(0);
		});
		view.on(MW.Event.PITCHER_LEVEL_SET_DROP_ORIGIN, function (msg) {
			dropOrigin.x = msg.x;
			dropOrigin.y = msg.y;
		});
		view.on(MW.Event.PITCHER_LEVEL_ADD, function (msg) {
			var x2 = pitcherImage.getX() + pitcherImage.getWidth() / 2;
			var y2 = pitcherImage.getY() + pitcherImage.getHeight() - dropImage.getHeight();
			var velocity = 200; /* px/s */
			var distance = Math.sqrt(Math.pow(dropOrigin.x - x2, 2) + Math.pow(dropOrigin.y - y2, 2));
			var time = distance / velocity * 1000;
			dropImage.setX(dropOrigin.x);
			dropImage.setY(dropOrigin.y);
			dropImage.setAlpha(1);
			dropImage.show();
			MW.Sound.play(MW.Sounds.YAY_HELPED_ME_GET_WATER_DROP_1);
			MW.Sound.play(MW.Sounds.YAY_HELPED_ME_GET_WATER_DROP_2);
			view.setTimeout(function () {
				MW.Sound.play(MW.Sounds.LETS_FILL_THE_BUCKET);
			}, 2000)
			view.getTween(dropImage.attrs)
			.to({
				x: x2 - 50,
				y: y2
			}, time * 1.2)
			.to({
				rotation: 4 * Math.PI / 3,
				x: x2 - 50,
				y: y2 - 30
			}, 300)
			.to({
				rotation: 5 * Math.PI / 3,
				x: x2 - 25,
				y: y2 - 25
			}, 300)
			.to({
				rotation: 6 * Math.PI / 3,
				x: x2,
				y: y2
			}, 300).call(function () {
				MW.Sound.play(MW.Sounds.DRIP);
				pitcherBottomImage.show();
				view.getTween(waterRect.attrs).to({ height: waterRect.getHeight() - levelHeight }, 1000);
				view.getTween(dropImage.attrs).to({ alpha: 0 }, 1000).wait(1000).call(function () {
					dropImage.hide();
					dropImage.setRotation(Math.PI);
					if (msg.callback != undefined)
						msg.callback();
				});
			});
		});
	})(this);
};
/**
 * View for illustrating general game events, such as banana retrievement and
 * system confirmation.
 * 
 * @constructor
 * @extends {ViewModule}
 */
function MonkeyWorldView() {
	ViewModule.call(this, "MonkeyWorldView");
	var stage = this.stage;
//	this._tag = "MonkeyWorldView";
	
	var layer = stage._gameLayer;
	
	this.tearDown = function() {
		this.forget();
	};
	
	/**
	 * Show a menu in which the user can choose a mini game to play.
	 * 
	 * @param {MonkeyWorldView} view
	 */
	(function(view) {
		var buttons = new Array();
		view.on("Game.showMiniGameChooser", function(msg) {
			
			var callback = msg.callback;
			var games = msg.games;
			var grid = Utils.gridizer(200, 200, 300, 100, 2);
			
			//for (var i = 0; i < games.length; i++) { (function(i) {
			
			for (var category in games) { (function() {
				for (var i = 0; i < games[category].sum(); i++) { (function() {
					console.log(games[category].variations[i]);
					var game = games[category].variations[i];
					var pos = grid.next();
					var button = new Kinetic.Group(pos);
					var rect = new Kinetic.Rect({
						width: 280,
						height: 100,
						stroke: "black",
						strokeWidth: 4
					});
					var text = new Kinetic.Text({
						text: game.title,
						fontSize: 20,
						fontFamily: "sans-serif",
						textFill: "black",
						align: "center",
						verticalAlign: "center",
						width: 280,
						height: 100,
						y: 40
					});
					text.setAlign("center");
					button.add(rect);
					button.add(text);
					button.on("mousedown touchstart", function() {
						rect.setFill("yellow");
						callback(game);
					});
					buttons.push(button);
					layer.add(button);
				})();}
			})();}
		});
		
		view.on("Game.hideMiniGameChooser", function(msg) {
			for (var i = 0; i < buttons.length; i++) {
				layer.remove(buttons[i]);
			}
			buttons = new Array();
		});
	})(this);

	/**
	 * Show loading bars and percentage numbers when downloading images, sound
	 * and possibly other resources.
	 * 
	 * @param {MonkeyWorldView} view
	 */
	(function LoadingModule(view) {
		
		/** @const */
		var BAR_CONFIG = {
			/** @const */ WIDTH: 300,
			/** @const */ HEIGHT: 30,
			/** @const */ MARGIN: 20
		};
		
		var bar = new Kinetic.Rect({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			width: BAR_CONFIG.WIDTH + BAR_CONFIG.MARGIN,
			height: BAR_CONFIG.HEIGHT + BAR_CONFIG.MARGIN,
			cornerRadius: 10,
			offset: {
				x: (BAR_CONFIG.WIDTH + BAR_CONFIG.MARGIN) / 2,
				y: (BAR_CONFIG.HEIGHT + BAR_CONFIG.MARGIN) / 2
			},
			fill: "#333",
			alpha: 0
		});
		
		var filler = new Kinetic.Rect({
			x: stage.getWidth() / 2,
			y: stage.getHeight() / 2,
			width: 0,
			height: BAR_CONFIG.HEIGHT,
			offset: {
				x: BAR_CONFIG.WIDTH / 2,
				y: BAR_CONFIG.HEIGHT / 2
			},
			fill: "#FFCC00"
		});
		
		var loadingText = new Kinetic.Text({
			fontFamily: "Arial",
			fontSize: 10,
			textFill: "black",
			fontStyle: "bold",
			textStrokeFill: "black",
			text: "Monkey World Demo",
			align: "center",
			width: stage.getWidth(),
			height: 50,
			y: stage.getHeight()/2 - 50,
			x: 0
		});
		
		view.on("Game.showLoadingScreen", function(msg) {
			layer.add(bar);
			layer.add(filler);
			layer.add(loadingText);
			bar.transitionTo({alpha:1, duration: msg.time / 1000});
		});	
		
		view.on("Game.loadingSounds", function(msg) {
			loadingText.setText(MW.Strings.get("INIT_LOADING_SOUNDS"));
		});
		view.on("Game.loadingImages", function(msg) {
			loadingText.setText(MW.Strings.get("INIT_LOADING_IMAGES"));
		});
		view.on("Game.loadingDone", function(msg) {
			layer.remove(loadingText);
			layer.remove(bar);
			layer.remove(filler);
		});
		view.on("Game.updateSoundLoading", function(msg) {
			filler.setWidth(msg.progress * BAR_CONFIG.WIDTH);
		});
		view.on("Game.updateImageLoading", function(msg) {
			filler.setWidth(msg.progress * BAR_CONFIG.WIDTH);
		});

	})(this);
};
/**
 * @extends {Kinetic.Node}
 * @constructor
 * @param {Object} config
 * @param {ViewModule} view
 */
Kinetic.MW.Lizard = function (config, view) {
	var
		group = new Kinetic.Group(config),
		image,
		walkInterval,
		walkTimeout,
		mouthInterval = 200,
		tongueInterval = 200,
		tongueImage;

	image = new Kinetic.Image({
		image: MW.Images.TREEGAME_LIZARD_STANDING,
		width: MW.Images.TREEGAME_LIZARD_STANDING.width,
		height: MW.Images.TREEGAME_LIZARD_STANDING.height
	});

	tongueImage = new Kinetic.Image({
		image: MW.Images.TREEGAME_LIZARD_TONGUE1,
		width: MW.Images.TREEGAME_LIZARD_TONGUE1.width,
		height: MW.Images.TREEGAME_LIZARD_TONGUE1.height,
		visible: false,
		x: -170 + 279,
		y: -200 + 281,
		offset: {
			x: 279,
			y: 281
		}
	});

	group.add(tongueImage);
	group.add(image);
	
	this.startWalk = function () {
		var INTERVAL = 280;
		image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP2;
		walkInterval = view.setInterval(function () {
			image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP1;
			walkTimeout = view.setTimeout(function () {
				image.attrs.image = MW.Images.TREEGAME_LIZARD_STEP2;	
			}, INTERVAL / 2);
		}, INTERVAL);
	};
	
	this.stopWalk = function () {
		view.clearInterval(walkInterval);
		view.clearTimeout(walkTimeout);
		image.attrs.image = MW.Images.TREEGAME_LIZARD_STANDING;
	};
	
	function openMouth(callback) {
		view.getTween(image.attrs)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH1 })
		.wait(mouthInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH2 })
		.wait(mouthInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH3 })
		.wait(mouthInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH4 })
		.call(callback);
	}

	function closeMouth(callback) {
		view.getTween(image.attrs)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH4 })
		.wait(mouthInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH3 })
		.wait(mouthInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH2 })
		.wait(mouthInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_MOUTH1 })
		.wait(mouthInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_STANDING })
		.call(callback);
	}

	function tongueOut(callback) {
		tongueImage.show();
		view.getTween(tongueImage.attrs)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE2 })
		.wait(tongueInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE3 })
		.wait(tongueInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE4 })
		.wait(tongueInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE5 })
		.call(callback);
	}

	function tongueIn(callback) {
		view.getTween(tongueImage.attrs)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE4 })
		.wait(tongueInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE3 })
		.wait(tongueInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE2 })
		.wait(tongueInterval)
		.to({ image: MW.Images.TREEGAME_LIZARD_TONGUE1 })
		.wait(tongueInterval)
		.to({ visible: false })
		.call(callback);
	}

	group.startWalk = this.startWalk;
	group.stopWalk = this.stopWalk;
	group.tongueOut = function (callback) {
		openMouth(function () { tongueOut(callback); });
	};

	group.tongueIn = function (callback) {
		tongueIn(function () { closeMouth(callback); });
	}

	return group;
};
/**
 * @extends {Kinetic.Node}
 * @constructor
 * @param {Object} config
 *                   Properties inherited from Kinetic.Node, except for:
 *                   {number} config.type (1-3)
 */
Kinetic.MW.Parcel = function (config) {

	var
		group,
		image,
		imageObj,
		rect;

	group = new Kinetic.Group(config);
	switch (config.type) {
	case 1: imageObj = MW.Images.PARCEL_1; break;
	case 2: imageObj = MW.Images.PARCEL_2; break;
	case 3: imageObj = MW.Images.PARCEL_3; break;
	default: throw "NoSuchParcelTypeException";
	}
	image = new Kinetic.Image({
		image: imageObj,
		width: imageObj.width,
		height: imageObj.height,
		offset: {
			x: imageObj.width / 2,
			y: imageObj.height / 2
		},
		shadow: {
		      color: 'black',
		      blur: 10,
		      offset: [3, 3],
		      alpha: 0.5
		    }
	});
	group.add(image);

	/**
	 * Shakes the parcel
	 * @param {ViewModule} view
	 */
	group.shake = function (view) {
		var
			ox = group.getX(),
			oy = group.getY(),
			offset = 5,
			timeMillis = 100;
		view.getTween(group.attrs)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox }, timeMillis);
		view.getTween(group.attrs)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy }, timeMillis);
	};

	/**
	 * Whan happens when the parcel is clicked
	 */
	group.onClick = function (fnc) {
		group.on("mousedown touchstart", fnc);
	};

	group.offClick = function (fnc) {
		group.off("mousedown touchstart");
	};

	/**
	 * Open the parcel
	 */
	group.open = function () {
		
	};

	return group;
};
/**
 * @constructor
 * @extends {ViewModule}
 * @param {string} tag
 */
function GameView(tag) {
	ViewModule.call(this, tag);
	/** @type {GameView}      */ var view  = this;
	/** @type {Kinetic.Layer} */ var layer = view.stage._gameLayer;
	/**
	 * Show the current backend score of a mini game.
	 * @param {GameView} view
	 */
	(function (view) {
		/** @const */
		var label = "Backend Score (current mode):";
		var text = new Kinetic.Text({
			text: label,
			fontSize: 12,
			fontFamily: "sans-serif",
			textFill: "black",
			align: "left",
			verticalAlign: "middle",
			x: view.stage.getWidth() - 700,
			y: 15
		});
		layer.add(text);
		var on = true, running = on;
		view.on(MW.Event.BACKEND_SCORE_UPDATE_MODE, function(msg) {
			text.setText(label + " " + msg.backendScore);
		});
		view.on(MW.Event.TRIGGER_SCORE, function () {
			if (running && !on) {
				layer.add(text);
				on = true;
			} else if (running && on) {
				layer.remove(text);
				on = false;
			}
		});
		view.addTearDown(function() {
			layer.remove(text);
			running = false;
			on = false;
		});
	})(this);

	/**
	 * Show the face of the agent in the top right corner in child play mode
	 */
	(function (view) {
		var faceImageObj = view.game.getAgentView().normalFace();
		var faceImage = new view.game.getAgentView().getFace(view.getStage().getWidth() - faceImageObj.width - 30, 12);
		faceImage.setScale(0.5);
		view.addSetup(function() {
			if (view.game.modeIsChild()) {
				layer.add(faceImage);
			}
		});
		view.addTearDown(function() {
			layer.remove(faceImage);
		});
	})(this);
}
/**
 * @constructor
 * @extends {GameView}
 * @param {MW.LadderMinigame} ladder
 */
function LadderView(tag, ladder)
{
	GameView.call(this, tag);
	this.tag(tag);
	Log.debug("Creating LadderView", "object");
	var view = this;
	var stopButton = null;
	var continueButton = null;
	var agent = null;
	/** @type {Kinetic.Line} */ var stick = null;
	var STICK_ORIGIN = {x:800, y: 650};
	
	this.addInterruptButtons = function(layer) {
		stopButton = new Kinetic.Image({
			image: MW.Images.SYMBOL_STOP, x: 750, y: 700, offset: {x:64,y:64}, alpha: 0
		});
		continueButton = new Kinetic.Image({
			image: MW.Images.SYMBOL_CHECK, x: 900, y: 700, offset: {x:64,y:64}, alpha: 0
		});
		
		layer.add(stopButton);
		layer.add(continueButton);
	};
	
	this.addAgent = function(x, y, scale, layer) {
		if (!view.game.modeIsChild()) {
			agent = new view.game.getAgentView().getBody(x, y);
			agent.setScale(scale);
			layer.add(agent);
			if (view.game.modeIsAgentDo()) {
				stick = new Kinetic.Line({
					points: [660, 570, STICK_ORIGIN.x, STICK_ORIGIN.y],
					stroke: "brown",
					strokeWidth: 2,
					lineCap: "round"
				});
				layer.add(stick);
			}
		}
	};

	view.on("Ladder.interrupt", function(msg) {
		if (view.game.modeIsAgentDo()) {
			view.removeTween(stick.attrs.points[1]);
			view.getTween(stick.attrs.points[1]).to(STICK_ORIGIN,1000).call(function() {
				MW.Sound.play(MW.Sounds.WHICH_ONE_DO_YOU_THINK_IT_IS);
			});
		}
		view.interrupt();
	});
	
	view.on("Ladder.introduceAgent", function(callback) {
		MW.Sound.play(MW.Sounds.LADDER_LOOKS_FUN);
		view.setTimeout(function() {
			MW.Sound.play(MW.Sounds.LADDER_SHOW_ME);
			view.setTimeout(function() {
				callback();
			}, 2000);
		}, 2000);
	});
	
	view.on(MW.Event.MG_LADDER_ALLOW_INTERRUPT, function(callback) {
		stopButton.on("mousedown touchstart", function() {
			view.getTween(stopButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			MW.Sound.play(MW.Sounds.BIKE_HORN);
			ladder.interruptAgent();
		});
		continueButton.on("mousedown touchstart", function() {
			view.getTween(continueButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			MW.Sound.play(MW.Sounds.TADA);
		});
		callback();
	});
	
	view.on(MW.Event.MG_LADDER_FORBID_INTERRUPT, function() {
		stopButton.off("mousedown touchstart");
		continueButton.off("mousedown touchstart");
	});
	
	view.on("Ladder.startAgent", function(callback) {
		MW.Sound.play(MW.Sounds.LADDER_MY_TURN);
		view.setTimeout(function() {
			callback();
			view.getTween(stopButton.attrs).to({alpha:1},1000);
			view.getTween(continueButton.attrs).to({alpha:1},1000);
		}, 2000);
	});
	
	view.on(MW.Event.MG_LADDER_CHEER, function(callback) {
		MW.Sound.play(MW.Sounds.YAY);
		view.setTimeout(callback, 1500);
	});
	
	view.on(MW.Event.MG_LADDER_GET_TREAT, function(callback) {
		view.getTreat(callback);		
	});

	view.on(MW.Event.MG_LADDER_CONFIRM_TARGET, function() {
		view.confirmTarget();
	});

	view.on("Ladder.betterBecauseBigger", function(msg) { MW.Sound.play(view.betterBigger); });
	view.on("Ladder.betterBecauseSmaller", function(msg) { MW.Sound.play(view.betterSmaller); });
	view.on("Ladder.hmm", function(msg) { MW.Sound.play(MW.Sounds.MAYBE_THAT_WORKS); });
	view.on("Ladder.agentSuggestSolution", function(msg) {
		view.setTimeout(function() {
			MW.Sound.play(view.suggestion1);
			view.setTimeout(function() {
				MW.Sound.play(view.suggestion1);	
			}, 2000);
		}, 2000);
	});
	
	view.on("Ladder.tooLow", function(msg) {
		MW.Sound.play(view.tooLow);
		setTimeout(function() {
			MW.Sound.play(view.tryBigger);
		}, 2000);
	});
	
	view.on("Ladder.tooHigh", function(msg) {
		MW.Sound.play(view.tooHigh);
		setTimeout(function() {
			MW.Sound.play(view.trySmaller);
		}, 2000);
	});
	
	view.on("Ladder.agentTooLow", function(msg) { MW.Sound.play(view.agentTooLow); });
	view.on("Ladder.agentTooHigh", function(msg) { MW.Sound.play(view.agentTooHigh); });
	
	/**
	 * Picked a number on the numpad
	 */
	view.on("Ladder.picked", function(callback, msg) {
		if (view.game.modeIsAgentDo() && !ladder.agentIsInterrupted() && !ladder.agentIsBeingHelped()) {
			var pos = view.getStickPoint(msg.number);
			MW.Sound.play(MW.Sounds.IM_GOING_TO_PICK_THIS_ONE);
			view.getTween(stick.attrs.points[1]).wait(1500).to(pos,3000).wait(3000).call(function() {
				view.pick(msg.number, callback);
			}).wait(1000).to(STICK_ORIGIN,1000);
		} else {
			view.pick(msg.number, callback);
		}
	});
}
/**
 * @constructor
 * @extends {LadderView}
 * @param {MW.LadderMinigame} game
 */
function MountainView(game) {
	/** @type {MountainView} */ var view = this;
	LadderView.call(this, "MtView", game);
	Log.debug("Constructing MountainView", this._tag);
	
	/**
	 * Define sounds specific for this implementation of the ladder game. 
	 */
	view.tooLow          = MW.Sounds.LADDER_MOUNTAIN_IM_UP_HERE;
	view.tooHigh         = MW.Sounds.LADDER_MOUNTAIN_IM_DOWN_HERE;
	view.tryBigger       = MW.Sounds.LADDER_MOUNTAIN_TRY_MORE_BALLOONS;
	view.trySmaller      = MW.Sounds.LADDER_MOUNTAIN_TRY_FEWER_BALLOONS;
	view.suggestion1     = MW.Sounds.LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_1;
	view.suggestion2     = MW.Sounds.LADDER_MOUNTAIN_AGENT_SUGGEST_SOLUTION_2;
	view.agentTooLow     = MW.Sounds.LADDER_MOUNTAIN_AGENT_PLAY_TOO_LOW;
	view.agentTooHigh    = MW.Sounds.LADDER_MOUNTAIN_AGENT_PLAY_TOO_HIGH;
	view.betterBigger    = MW.Sounds.LADDER_MOUNTAIN_BETTER_BECAUSE_BIGGER;
	view.betterSmaller   = MW.Sounds.LADDER_MOUNTAIN_BETTER_BECAUSE_SMALLER;
	view.agentSeeCorrect = MW.Sounds.LADDER_MOUNTAIN_AGENT_SEE_CORRECT;
	
	var allowNumpad = false;
	var resetButton = null;
	var tellMyTurn = false;
	
	var dynamicLayer = new Kinetic.Layer();
	var staticLayer = new Kinetic.Layer();
	
	var CAGE_CONFIG = {
		X: 400, Y: 600, WIDTH: 100, HEIGHT: 50, SLOPE: 10
	};
	
	var FRIEND_CONFIG = {
		WIDTH: 50, HEIGHT: 50
	};
	
	var LADDER_CONFIG = {
		HEIGHT: 60,
		WIDTH: 100,
		SLOPE: 24,
		X: 280,
		Y: 430
	};
	
	var balloonGroups = new Array();
	var cage = new Kinetic.Group({ x: CAGE_CONFIG.X, y: CAGE_CONFIG.Y });
	
	var friend = new Kinetic.Rect({
		width: FRIEND_CONFIG.WIDTH,
		height: FRIEND_CONFIG.HEIGHT,
		fill: "blue",
		stroke: "black",
		strokeWidth: 4,
		offset: {
			x: FRIEND_CONFIG.WIDTH / 2,
			y: FRIEND_CONFIG.HEIGHT
		}
	});
	
	/**
	 * @constructor
	 * @extends {Kinetic.Shape}
	 */
	Kinetic.Balloon = function(x, y) {
		var group = new Kinetic.Group({ x: x, y: y });
		var balloon = new Kinetic.Circle({
			fill: "red",
			stroke: "black",
			strokeWidth: 4,
			radius: 20
		});
		var string = new Kinetic.Line({
			stroke: "black",
			strokeWidth: 4,
			points: [0, 20, 0, 65]
		});
		group.add(string);
		group.add(balloon);
		return group;
	};
	
	var BALLOON_GRID = {
		X: 730, Y: 180, STEPX: 140, STEPY: 140, WIDTH: 2
	};
	
	view.addSetup(function() {
		Log.debug("Setting up MountainView", "mt-view");
		view.stage.add(staticLayer);
		view.stage.add(dynamicLayer);
		
		var mountain = new Kinetic.Polygon({
			points: [50, 600,
			         350, 600,
			         150, 100],
			fill: "gray",
			stroke: "black",
			strokeWidth: 4
		});
		
		cage.add(new Kinetic.Polygon({
			points: [0, 0,
			         CAGE_CONFIG.WIDTH, 0,
			         CAGE_CONFIG.WIDTH + CAGE_CONFIG.SLOPE, -CAGE_CONFIG.HEIGHT,
			         -CAGE_CONFIG.SLOPE, -CAGE_CONFIG.HEIGHT],
			fill: "#993300",
			stroke: "black",
			strokeWidth: 4
		}));
		
		var balloonGrid = new Utils.gridizer(
			BALLOON_GRID.X, BALLOON_GRID.Y, BALLOON_GRID.STEPX, BALLOON_GRID.STEPY, BALLOON_GRID.WIDTH
		);
		
		for (var i = 0; i < 6; i++) {
			(function(i) {
				var pos = balloonGrid.next();
				var group = new Kinetic.Group({ x: pos.x, y: pos.y });
				var balloons = new Kinetic.Group({ x: 40, y: 40 });
				var rect = new Kinetic.Rect({
					width: BALLOON_GRID.STEPX,
					height: BALLOON_GRID.STEPY,
					fill: "yellow",
					strokeWidth: 4,
					stroke: "black"
				});
				group.add(rect);
				balloonGroups.push(group);
				var r = 0;
				for (var j = 0; j <= i; j++) {
					if (j === 3) r++;
					balloons.add(new Kinetic.Balloon(j*30 - 2.7*r*30, r*30));
				}
				group.add(balloons);
				group._rect = rect;
				group._balloons = balloons;
				
				group.on("mousedown touchstart", function() {
					if (allowNumpad && view.game.playerIsGamer()) {
						allowNumpad = false;
						game.pick(i + 1);
					} else if (view.game.playerIsAgent() && !tellMyTurn) {
						tellMyTurn = true;
						MW.Sound.play(MW.Sounds.NO_MY_TURN);
						setTimeout(function() {
							MW.Sound.play(MW.Sounds.BUT_YOU_CAN_INTERRUPT);
							setTimeout(function() {
								tellMyTurn = false;
							}, 2000);
						}, 2000);
					}
				});
				
				dynamicLayer.add(group);
			})(i);
		};
		
		staticLayer.add(mountain);
		
		var ladder = game.getLadder();
		for (var i = 0; i < ladder.length; i++) {
			var line = new Kinetic.Line({
				points: [
					LADDER_CONFIG.X - i * LADDER_CONFIG.SLOPE,
					LADDER_CONFIG.Y - i * LADDER_CONFIG.HEIGHT,
					LADDER_CONFIG.X - i * LADDER_CONFIG.SLOPE + LADDER_CONFIG.WIDTH,
					LADDER_CONFIG.Y - i * LADDER_CONFIG.HEIGHT
				],
				stroke: "black",
				strokeWidth: 4
			});
			staticLayer.add(line);
		}
		friend.hide();
		dynamicLayer.add(friend);
		dynamicLayer.add(cage);
		view.on("frame", function() { dynamicLayer.draw(); });
		view.addInterruptButtons(dynamicLayer);
		
		view.addAgent(
			view.getStage().getWidth() - 500,
			LADDER_CONFIG.Y,
			dynamicLayer
		);
		
		staticLayer.draw();
	});
	
	view.interrupt = function() {
		resetButton();
		view.removeTween(cage.attrs);
		view.getTween(cage.attrs).to({x:CAGE_CONFIG.X,y:CAGE_CONFIG.Y});
	};
	
	view.on("Ladder.placeTarget", function(msg) {
		var level = game.getTargetNumber() - 1;
		friend.setX(LADDER_CONFIG.X - level * LADDER_CONFIG.SLOPE);
		friend.setY(LADDER_CONFIG.Y - level * LADDER_CONFIG.HEIGHT);
		friend.show();
		allowNumpad = true;
		msg.callback();
	});
	
	this.getStickPoint = function(number) {
		var r = balloonGroups[number - 1];
		return {
			x: r.getX() + r._rect.getWidth() / 2,
			y: r.getY() + r._rect.getHeight() / 2
		};
	};
	
	this.pick = function(number, callback) {
		var b = balloonGroups[number - 1]._balloons;
		var g = balloonGroups[number - 1];
		
		g._rect.setFill("red");
		
		var x = g._balloons.getX();
		var y = b.getY();
		resetButton = function() {
			view.removeTween(b.attrs);
			b.setX(x);
			b.setY(y);
			b.moveTo(g);
			g._rect.setFill("yellow");
		};
		
		var yOffset = -110;
		var xOffset = 20;
		view.getTween(b.attrs).to({x: - Math.abs(CAGE_CONFIG.X - g.getX()) + xOffset, y: CAGE_CONFIG.Y - g.getY() + yOffset }, 4000).call(function() {
			b.moveTo(cage);
			b.setX(xOffset);
			b.setY(yOffset);
			b.moveDown();
			callback();
		});
	};
	
	view.on("Ladder.approachLadder", function(msg) {
		view.getTween(cage.attrs).to({
			x: (LADDER_CONFIG.X - (msg.number - 1) * LADDER_CONFIG.SLOPE + LADDER_CONFIG.WIDTH),
			y: (LADDER_CONFIG.Y - (msg.number - 1) * LADDER_CONFIG.HEIGHT)
		}, 2000).call(msg.callback);
	});
	
	view.on("Ladder.getTarget", function(msg) {
		var friendOffsetX = CAGE_CONFIG.WIDTH / 2;
		var friendOffsetY = -FRIEND_CONFIG.HEIGHT / 2;
		MW.Sound.play(MW.Sounds.LADDER_MOUNTAIN_YOU_SAVED_ME);
		view.setTimeout(function() {
			MW.Sound.play(MW.Sounds.LADDER_MOUNTAIN_IM_HUNGRY);
		}, 2000);
		view.getTween(friend.attrs).to({ x: cage.getX() + friendOffsetX, y: cage.getY() + friendOffsetY }, 1000).call(function() {
			var time = 3000;
			view.getTween(cage.attrs).to({x:CAGE_CONFIG.X, y: CAGE_CONFIG.Y}, time);
			view.getTween(friend.attrs).to({x:CAGE_CONFIG.X + friendOffsetX, y: CAGE_CONFIG.Y + friendOffsetY}, time).call(function() {
				view.getTween(friend.attrs).to({x:CAGE_CONFIG.X + CAGE_CONFIG.WIDTH + FRIEND_CONFIG.WIDTH, y: CAGE_CONFIG.Y}, 2000).call(msg.callback);
			});
		});
	});
	
	view.on("Ladder.hasTarget", function(msg) {
		if (!view.game.modeIsAgentDo())
			game.openTreat();
		
	});
	
	view.confirmTarget = function(msg) {
		msg.callback();
	};
	
	view.on("Ladder.resetScene", function(msg) {
		var whenDone = function() {
			if (resetButton != null) resetButton();
			if (msg.allowNumpad) allowNumpad = true;
			msg.callback();
		};
		if (cage.getY() != CAGE_CONFIG.Y) {
			view.getTween(cage.attrs).to({
				x: CAGE_CONFIG.X, y: CAGE_CONFIG.Y
			}, 2000).call(whenDone);
		} else {
			whenDone();
		}
	});
	
	this.addTearDown(function() {
		Log.debug("Tearing down MountainView", this._tag);
		view.stage.remove(staticLayer);
		view.stage.remove(dynamicLayer);
	});
}
/**
 * @constructor
 * @extends {Kinetic.Group}
 * config:
 *    x          - x position, default 0
 *    y          - y position, default 0
 *    buttonWidht - 
 *    buttonHeight -
 *    min        - min number, default 1
 *    max        - max number, default 6
 *    step       - step number, default 1
 *    width      - number of buttons in width, default 2
 *    button     -
 *    buttonActive -
 *    buttonMargin -
 *    buttonOffset - offset from top left corner, where the first button appears
 *    pushed       - button pushed callback, number passed as argument
 *    representations
 *    representationsScale
 */
MW.Numpad = function(config) {
	if (config.x            === undefined) config.x            = 0;
	if (config.y            === undefined) config.y            = 0;
	if (config.min          === undefined) config.min          = 1;
	if (config.max          === undefined) config.max          = 6;
	if (config.step         === undefined) config.step         = 1;
	if (config.width        === undefined) config.width        = 2;
	if (config.pushed       === undefined) config.pushed       = function() {};
	if (config.buttonMargin === undefined) config.buttonMargin = 10;
	if (config.buttonOffset === undefined) config.buttonOffset = { x: 0, y: 0 };
	if (config.representationsScale === undefined) config.representationsScale = 1;
	
	var buttons = [];
	var publicLock = false;
	var ignore = false;
	var shadow = {
		color: 'black',
		blur: 10,
		offset: [3, 3],
		alpha: 0.5
	};
	
	var grid = new Utils.gridizer(
		config.buttonOffset.x, config.buttonOffset.y,
		config.buttonWidth + config.buttonMargin, config.buttonHeight + config.buttonMargin,
		config.width
	);
	
	var group = new Kinetic.Group({ x: config.x, y: config.y });
	
	for (var i = config.min; i <= config.max; i += config.step) { (function(i) {
		var pos = grid.next();
		var buttonGroup = new Kinetic.Group({
			x: pos.x, y: pos.y
		});
		var button = new Kinetic.Image({
			image: config.button,
			width: config.buttonWidth,
			height: config.buttonHeight,
			shadow: shadow
		});
		var representation = new Kinetic.Image({
			image: config.representations[i],
			scale: {
				x: config.representationsScale,
				y: config.representationsScale
			},
			offset: {
				x: config.representations[i].width / 2,
				y: config.representations[i].height / 2
			},
			x: config.buttonWidth / 2,
			y: config.buttonHeight / 2
		});
		var pushFunction = function(event, force) {
			if (force === undefined) force = false;
			if (ignore) return;
			if (!force && publicLock) {
				config.forbid(i);
			} else if (force || !publicLock) {
				group.lock();
				config.pushed(i);
				button.attrs.image = config.buttonActive;
				button.attrs.shadow = null;
			} 
		};
		buttonGroup.on("mousedown touchstart", function () { pushFunction(null, false); });
		buttonGroup.add(button);
		buttonGroup.add(representation);
		button.push = pushFunction;
		group.add(buttonGroup);
		buttons[i] = button;
		buttons[i].group_ = buttonGroup;
	})(i)};
	
	group.release = function() {
		for (var i = config.min; i <= config.max; i += config.step) {
			buttons[i].attrs.image = config.button;
			console.log("shadow", shadow);
			buttons[i].setShadow(shadow);
		}
	};
	
	group.lock = function() {
		publicLock = true;
	};
	
	group.unlock = function() {
		publicLock = false;
	};
	
	group.ignore = function () {
		ignore = true;
	};
	
	group.acknowledge = function () {
		ignore = false;
	};
	
	group.getButtonPosition = function(i) {
		return {
			x: group.getX() + buttons[i].group_.getX() + buttons[i].getWidth() / 2,
			y: group.getY() + buttons[i].group_.getY() + buttons[i].getHeight() / 2
		};
	};
	
	group.push = function(i) {
		buttons[i].push(null, true);
	};
	
	return group;
};

/**
 * @constructor
 * @extends {LadderView}
 * @param {MW.LadderMinigame} ladder
 */
function TreeView(ladder) {
	"use strict";
	LadderView.call(this, "TreeView", ladder);
	var
		view = this,
		scale = 1 / 2.083168317,
		i,
		numpad,
		helper,
		shakeHandler,
		shakeTreat,
		treats = [],
		background,
		staticLayer,
		dynamicLayer,
		tellMyTurn = false,
		currentPick,
		stopShakeTreat,
		treat = null,
		createTreat,
		addOnMouseActionToTreat,
		dropZoneOffset = 0,
		stepGroups = {},
		ladderStepNumber,
		ladderStepGroup,
		ladderStepPolygon,
		config = {
			tree: {
				x: 120,
				y: view.getStage().getHeight() - 160,
				stepHeight: 70,
				stepWidth: 120,
				stepNarrowing: 10
			},
			nest: {
				x: 320,
				y: 660
			},
			dropZone: {
				x: 650,
				y: view.getStage().getHeight() - 120,
				height: 200,
				offset: 0,
				offsetWidth: 75
			},
			helper: {
				x: 240,
				y: 580
			},
			treatGrid: {
				"1": { x: 100, y: 40, rotation: -Math.PI / 9 },
				"2": { x: 100, y: 100, rotation: Math.PI / 11 },
				"3": { x: 200, y: 40, rotation: -Math.PI / 12 },
				"4": { x: 200, y: 100, rotation: Math.PI / 9 }
			},
			numpad: {
				x: 550,
				y: 180
			}
		};

	/**
	 * Define sounds specific for this implementation of the ladder game.
	 */
	view.tooLow          = MW.Sounds.LADDER_TREE_OOPS_TOO_LOW;
	view.tooHigh         = MW.Sounds.LADDER_TREE_OOPS_TOO_HIGH;
	view.tryBigger       = MW.Sounds.LADDER_TREE_TRY_A_BIGGER_NUMBER;
	view.trySmaller      = MW.Sounds.LADDER_TREE_TRY_A_SMALLER_NUMBER;
	view.suggestion1     = MW.Sounds.LADDER_TREE_AGENT_SUGGEST_SOLUTION_1;
	view.suggestion2     = MW.Sounds.LADDER_TREE_AGENT_SUGGEST_SOLUTION_2;
	view.agentTooLow     = MW.Sounds.LADDER_TREE_AGENT_PLAY_TOO_LOW;
	view.agentTooHigh    = MW.Sounds.LADDER_TREE_AGENT_PLAY_TOO_HIGH;
	view.betterBigger    = MW.Sounds.LADDER_TREE_BETTER_BECAUSE_BIGGER;
	view.betterSmaller   = MW.Sounds.LADDER_TREE_BETTER_BECAUSE_SMALLER;
	view.agentSeeCorrect = MW.Sounds.LADDER_TREE_AGENT_SEE_CORRECT;

	numpad = new MW.Numpad({
		x: config.numpad.x,
		y: config.numpad.y,
		button: MW.Images.BUTTON_WOOD,
		buttonActive: MW.Images.BUTTON_WOOD_SELECTED,
		buttonWidth: MW.Images.BUTTON_WOOD.width,
		buttonHeight: MW.Images.BUTTON_WOOD.height,
		buttonMargin: 15,
		forbid: function (i) {
			tellMyTurn = true;
			MW.Sound.play(MW.Sounds.NO_MY_TURN);
			view.setTimeout(function () {
				MW.Sound.play(MW.Sounds.BUT_YOU_CAN_INTERRUPT);
				view.setTimeout(function () {
					tellMyTurn = false;
				}, 2000);
			}, 2000);
		},
		pushed: function (i) {
			if (view.game.playerIsGamer())
				ladder.pick(i);
		},
		representations: {
			"1": MW.Images.DOTS_1,
			"2": MW.Images.DOTS_2,
			"3": MW.Images.DOTS_3,
			"4": MW.Images.DOTS_4,
			"5": MW.Images.DOTS_5,
			"6": MW.Images.DOTS_6
		},
		representationsScale: 0.75
	});
	numpad.lock();

	staticLayer = new Kinetic.Layer();
	dynamicLayer = new Kinetic.Layer();
	view.getStage().add(staticLayer);
	view.getStage().add(dynamicLayer);

	/** @type {Kinetic.MW.Lizard} */
	helper = new Kinetic.MW.Lizard({
		x: config.helper.x,
		y: config.helper.y,
		scale: scale
	}, view);

	shakeTreat = function () {
		shakeHandler = view.setInterval(function () {
			treats[ladder.getRoundNumber() - 1].shake(view);
		}, 4000);
	};

	stopShakeTreat = function () {
		view.clearInterval(shakeHandler);
	};

	addOnMouseActionToTreat = function () {
		treat.onClick(ladder.openTreat);
	};
	
	view.on(MW.Event.PITCHER_LEVEL_ADD_BEFORE, function (msg) {
		view.tell(MW.Event.PITCHER_LEVEL_SET_DROP_ORIGIN, {
			x: treats[ladder.getRoundNumber() - 1].getX(),
			y: treats[ladder.getRoundNumber() - 1].getY()
		});
	});

	view.on(MW.Event.MG_LADDER_IGNORE_INPUT, function () {
		numpad.ignore();
	});
	
	view.on(MW.Event.MG_LADDER_ACKNOWLEDGE_INPUT, function () {
		numpad.acknowledge();
	});
	
	view.on(MW.Event.MG_LADDER_ALLOW_GAMER_INPUT, function () {
		numpad.unlock();
	});
	
	view.on(MW.Event.MG_LADDER_FORBID_GAMER_INPUT, function () {
		numpad.lock();
	});

	createTreat = function (callback) {
		console.log(treats);
		treat = treats[ladder.getRoundNumber() - 1];
		view.getTween(treat.attrs).wait(2000).to({
			x: 100,
			y: 150,
			rotation: 2 * Math.PI
		}, 1000).to({ rotation: 0 }).to({
			y: stepGroups[ladder.getTargetNumber()].getY() + 25,
			rotation: 2 * Math.PI * (7 - ladder.getTargetNumber())
		}, 1000).to({ rotation: 0 }).call(callback);
	};

	/**
	 * Open the treat
	 */
	view.confirmTarget = function (callback) {
		treat.offClick();
		stopShakeTreat();
		treat.open();
		numpad.release();
		staticLayer.draw();
	};

	/**
	 * Get a treat from the latest catched parcel
	 */
	view.getTreat = function (callback) {
		var balloons = new Kinetic.Image({
			x: treat.getX(),
			y: treat.getY(),
			image: MW.Images.BALLOONS,
			width: 128,
			height: 128,
			offset: {
				x: 64,
				y: 64
			},
			scale: {
				x: 0.1,
				y: 0.1
			}
		});
		dynamicLayer.add(balloons);
		view.getTween(balloons.attrs.scale).to({ x: 1, y: 1 }, 500).call(function () {
			view.getTween(balloons.attrs).to({ y: 200 }, 2000).call(callback);
		});
	};

	/**
	 * Drop a target from the tree crown. 
	 */
	view.on(MW.Event.MG_LADDER_PLACE_TARGET, function (callback, msg) {
		dropZoneOffset += 1;
		createTreat(callback);
	});

	/**
	 * Helper approaches the target
	 */
	view.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function (callback) {
		currentPick = ladder.getChosenNumber();
		view.getTween(helper.attrs).to({
			y: config.helper.y - 100
		}, 2000).to({
			rotation: -Math.PI / 8,
			x: config.helper.x - 25
		}, 1000).call(function () {
		console.log(stepGroups[2].getY());
			if (currentPick > 1) {
				view.getTween(helper.attrs).to({
					rotation: 0,
					y: 430
				}, 1000).call(function () {
					if (currentPick > 2) {
						helper.startWalk();
						view.getTween(helper.attrs).to({
							y: stepGroups[currentPick].getY()
						}, 500 * currentPick).call(function () {
							helper.stopWalk();
							callback();
						});
					} else {
						helper.stopWalk();
						callback();
					}
				});
			} else {
				callback();
			}
		});
	});

	/**
	 * Helper moves to its home
	 */
	view.on(MW.Event.MG_LADDER_RESET_SCENE, function (callback, msg) {
		var step1 = function (next) {
			helper.startWalk();
			view.getTween(helper.attrs).to({
				y: 430
			}, 500 * currentPick).call(helper.stopWalk).call(next);
		};
		var step2 = function (next) {
			view.getTween(helper.attrs).to({
				rotation: -Math.PI / 16,
				x: config.helper.x,
				y: config.helper.y - 70
			}, 1000).to({
				rotation: 0,
				y: config.helper.y - 50
			}, 1000).call(next);
		};
		var step3 = function () {
			view.getTween(helper.attrs).to({
				rotation: 0,
				x: config.helper.x,
				y: config.helper.y
			}, 2000).call(function () {
				numpad.release();
				callback();
			});
		};
		if (currentPick > 2) {
			step1(function () { step2(step3); });
		} else if (currentPick > 1) {
			step2(step3);
		} else {
			step3();
		}
	});

	/**
	 * Helper drops the treat
	 */
	view.on("Ladder.getTarget", function (callback) {
		helper.tongueOut(function () {
			var done_ = 0, done = function () {
				done_ += 1;
				if (done_ === 2)
					callback();
			};
			view.getTween(treat.attrs).to({
				x: treat.getX() + 30,
				y: treat.getY() - 30
			}).wait(200).call(function () {
				MW.Sound.play(MW.Sounds.LADDER_TREE_TONGUE);
				helper.tongueIn(done);
			}).to({
				x: config.dropZone.x + config.dropZone.offsetWidth * dropZoneOffset,
				y: config.dropZone.y,
				rotation: 3 * Math.PI
			}, 2000).to({ rotation: 0 }).call(done).call(function () {
				if (!view.game.modeIsAgentDo()) {
					addOnMouseActionToTreat();
					shakeTreat();
				}
			});
		});
	});

	view.on(MW.Event.FRAME, function () {
		dynamicLayer.draw();
	});

	view.addTearDown(function () {
		view.getStage().remove(staticLayer);
		view.getStage().remove(dynamicLayer);
	});

	view.interrupt = function () {
		view.removeTween(helper.attrs);
	};

	background = new Kinetic.Image({
		image: MW.Images.TREEGAME_BACKGROUND,
		x: 0,
		y: view.getStage().getHeight() - MW.Images.TREEGAME_BACKGROUND.height,
		width: MW.Images.TREEGAME_BACKGROUND.width,
		height: MW.Images.TREEGAME_BACKGROUND.height
	});

	staticLayer.add(background);
	staticLayer.add(new Kinetic.Image({
		image: MW.Images.TREEGAME_TREEDOTS,
		x: 144,
		y: 167
	}));
	view.addInterruptButtons(dynamicLayer);

	view.on("Ladder.helpAgent", function () {

	});

	for (i = 0; i < ladder.getLadder().length; i += 1) {
		ladderStepNumber = ladder.getLadder()[i];
		ladderStepGroup = new Kinetic.Group({
			x: config.tree.x,
			y: config.tree.y - i * config.tree.stepHeight
		});
//		ladderStepPolygon = new Kinetic.Polygon({
//			points: [
//				0, 0,
//				config.tree.stepWidth, 0,
//				config.tree.stepWidth - config.tree.stepNarrowing, config.tree.stepHeight,
//				config.tree.stepNarrowing, config.tree.stepHeight
//			],
//			stroke: "#5C4033",
//			strokeWidth: 5
//		});
//		ladderStepGroup.add(ladderStepPolygon);
		stepGroups[ladderStepNumber] = ladderStepGroup;
//		staticLayer.add(ladderStepGroup);
//		staticLayer.draw();
	}

	dynamicLayer.add(helper);

	dynamicLayer.add(new Kinetic.Image({
		image: MW.Images.TREEGAME_COVER,
		width: MW.Images.TREEGAME_COVER.width,
		height: MW.Images.TREEGAME_COVER.height,
		x: 184,
		y: view.getStage().getHeight() - MW.Images.TREEGAME_COVER.height
	}));


	this.pick = function (number, callback) {
		MW.Sound.play(MW.Sounds.CLICK);
		if (view.game.playerIsAgent()) {
			numpad.push(number);
		}
		callback();
	};

	this.getStickPoint = function (number) {
		return numpad.getButtonPosition(number);
	};

	staticLayer.add(new Kinetic.Image({
		x: config.numpad.x - 180,
		y: config.numpad.y - 280,
		image: MW.Images.NUMPAD_WOOD
	}));
	dynamicLayer.add(numpad);

	var agentView = view.game.getAgentView();
	var agentScale = 0.8;
	view.addAgent(
		view.getStage().getWidth() - 248,
		view.getStage().getHeight() - 100 - agentScale * (agentView.feetOffset() - agentView.bodyOffset().y),
		agentScale,
		dynamicLayer
	);

	/**
	 * Hang the treats in the crown
	 */
	(function (view) {
		var
			max = ladder.getMaximumTreats(),
			parcel;
		for (i = 0; i < max; i += 1) {
			parcel = new Kinetic.MW.Parcel({
				x: config.treatGrid[i + 1].x,
				y: config.treatGrid[i + 1].y,
				rotation: config.treatGrid[i + 1].rotation,
				type: (i % 3) + 1,
				scale: scale
			});
			dynamicLayer.add(parcel);
			treats.push(parcel);
		}
	}) (this);
	staticLayer.draw();
}
/**
 * @constructor
 * @extends {MW.Module}
 * @param {string} tag
 */
function ViewModule(tag) {
	MW.Module.call(this, tag);
	var that = this;
	var tweenController = new TweenController();
	
	this.addTearDown(function() {
		Log.debug("Tearing down", "ViewModule");
		tweenController.teardown();
	});
	
	/**
	 * @param {Object} target
	 * @return {Tween}
	 */
	this.getTween = function(target) {
		return tweenController.getTween(target);
	};
	
	/**
	 * @param {Object} target
	 */
	this.removeTween = function(target) {
		tweenController.removeTweens(target);
	};
	
	/**
	 * @constructor
	 * @private
	 */
	function TweenController() {
		
		var tweens = new Array();
		
		/**
		 * @param {Object} target
		 */
		this.getTween = function(target) {
			if (!Utils.inArray(tweens, target))
					tweens.push(target);
			return Tween.get(target);
		};
		
		this.removeTweens = function(target) {
			Tween.removeTweens(target);
		};
		
		/**
		 * 
		 */
		this.teardown = function() {
			for (var i = 0; i < tweens.length; i++) {
				Tween.removeTweens(tweens[i]);
			}
		};
	};
	/** @this {ViewModule} */
	this.getStage = function() {
		return this.stage;
	};
};
