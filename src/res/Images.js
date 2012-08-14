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
/** @const */ TREEGAME_LIZARD_STANDING: "minigames/treegame/lizard-standing.png",
/** @const */ TREEGAME_LIZARD_STEP1: "minigames/treegame/lizard-step1.png",
/** @const */ TREEGAME_LIZARD_STEP2: "minigames/treegame/lizard-step2.png",
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

