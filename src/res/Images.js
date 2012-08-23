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

/** @const */ BUTTON_NO_1: "yesno/no1.png",
/** @const */ BUTTON_NO_2: "yesno/no2.png",
/** @const */ BUTTON_NO_3: "yesno/no3.png",
/** @const */ BUTTON_NO_4: "yesno/no4.png",
/** @const */ BUTTON_NO_5: "yesno/no5.png",
/** @const */ BUTTON_NO_6: "yesno/no6.png",
/** @const */ BUTTON_NO_7: "yesno/no7.png",

/** @const */ BUTTON_YES_1: "yesno/yes1.png",
/** @const */ BUTTON_YES_2: "yesno/yes2.png",
/** @const */ BUTTON_YES_3: "yesno/yes3.png",
/** @const */ BUTTON_YES_4: "yesno/yes4.png",

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
/** @const */ TREEGAME_LIZARD_HOLE1: "minigames/treegame/lizard/hole/1.png",
/** @const */ TREEGAME_LIZARD_HOLE2: "minigames/treegame/lizard/hole/2.png",
/** @const */ TREEGAME_LIZARD_HOLE3: "minigames/treegame/lizard/hole/3.png",
/** @const */ NUMPAD_WOOD:     "minigames/treegame/nrpad.png",
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
/** @const */ AGENT_FACE_SURPRISED_MOUSE: "agents/mouse/facials/m-suprised.png",
/** @const */ AGENT_DANCE_MOUSE_1: "agents/mouse/dance/1.png",
/** @const */ AGENT_DANCE_MOUSE_2: "agents/mouse/dance/2.png",
/** @const */ AGENT_DANCE_MOUSE_3: "agents/mouse/dance/3.png",
/** @const */ AGENT_BLINK_MOUSE_1: "agents/mouse/facials/blink/1.png",
/** @const */ AGENT_BLINK_MOUSE_2: "agents/mouse/facials/blink/2.png",
/** @const */ AGENT_BLINK_MOUSE_3: "agents/mouse/facials/blink/3.png",
/** @const */ AGENT_TALK_MOUSE: "agents/mouse/facials/m-prat.png",
/** @const */ AGENT_FALLING_MOUSE: "agents/mouse/falling.png",
/** @const */ AGENT_ARM_POINT_1: "agents/mouse/pointing/arm-1.png",
/** @const */ AGENT_ARM_POINT_2: "agents/mouse/pointing/arm-2.png",
/** @const */ AGENT_ARM_POINT_3: "agents/mouse/pointing/arm-3.png",
/** @const */ AGENT_ARM_POINT_4: "agents/mouse/pointing/arm-4.png",
/** @const */ AGENT_ARM_POINT_AT_1: "agents/mouse/pointing/prickpek-1.png",
/** @const */ AGENT_ARM_POINT_AT_2: "agents/mouse/pointing/prickpek-2.png",
/** @const */ AGENT_ARM_POINT_AT_3: "agents/mouse/pointing/prickpek-3.png",
/** @const */ AGENT_ARM_POINT_AT_4: "agents/mouse/pointing/prickpek-4.png",
/** @const */ AGENT_ARM_POINT_AT_5: "agents/mouse/pointing/prickpek-5.png",
/** @const */ AGENT_ARM_POINT_AT_6: "agents/mouse/pointing/prickpek-6.png"
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

