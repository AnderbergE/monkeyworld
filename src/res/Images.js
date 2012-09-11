/**
 * Definition of all the images that the application will use. They can be
 * loaded before the game starts.
 * 
 * @enum {string}
 */
MW.ImageSources = {
/** @const */ BALLOONS: "balloons.png",

/** @const */ BUTTON_NO_SPRITE: "yesno/no-sprite.png",
/** @const */ BUTTON_YES_SPRITE: "yesno/yes-sprite.png",

/** @const */ JUNGLEBG: "Jungle_Bkg.png",
/** @const */ GARDEN_BG: "bg-garden.png",
/** @const */ GARDEN_SAD_BG: "bg-sadgarden.png",
/** @const */ TREEGAME_BACKGROUND:   "minigames/treegame/background.png",
/** @const */ TREEGAME_TREEDOTS:   "minigames/treegame/treedots.png",
/** @const */ TREEGAME_COVER:        "minigames/treegame/lizard_cover.png",
/** @const */ TREEGAME_LIZARD_SPRITE: "minigames/treegame/lizard/lizard-sprite.png",
/** @const */ TREEGAME_LIZARD_TONGUE_SPRITE: "minigames/treegame/lizard/tongue-sprite.png",
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
/** @const */ WATERDROP: "vattendroppe.png",
/** @const */ PITCHER: "vattenkanna.png",
/** @const */ PITCHER_BOTTOM: "vattenkanna-botten.png",

/** @const */ AGENT_MOUSE_SPRITE:      "agents/mouse/body-sprite.png",
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
	        if (MW.resPath !== undefined) {
			MW.Images[src].src = MW.resPath + "/img/" + str;
		} else {
			MW.Images[src].src = "../res/img/" + str;
		}
	    }
	};
	return imageHandler;
})();

