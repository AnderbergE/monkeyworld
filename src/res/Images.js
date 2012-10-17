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

/** @const */ ELEVATORGAME_BACKGROUND:			"minigames/elevatorgame/background.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_1:	"minigames/elevatorgame/button1.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_2:	"minigames/elevatorgame/button2.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_3:	"minigames/elevatorgame/button3.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_4:	"minigames/elevatorgame/button4.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_5:	"minigames/elevatorgame/button5.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_6:	"minigames/elevatorgame/button6.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_7:	"minigames/elevatorgame/button7.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_8:	"minigames/elevatorgame/button8.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_9:	"minigames/elevatorgame/button9.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_10:	"minigames/elevatorgame/button10.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_1:	"minigames/elevatorgame/button1c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_2:	"minigames/elevatorgame/button2c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_3:	"minigames/elevatorgame/button3c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_4:	"minigames/elevatorgame/button4c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_5:	"minigames/elevatorgame/button5c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_6:	"minigames/elevatorgame/button6c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_7:	"minigames/elevatorgame/button7c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_8:	"minigames/elevatorgame/button8c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_9:	"minigames/elevatorgame/button9c.png",
/** @const */ ELEVATORGAME_BUTTON_FINGERS_DOWN_10:	"minigames/elevatorgame/button10c.png",
/** @const */ ELEVATORGAME_CHICK_1:				"minigames/elevatorgame/ChickOrange1_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_1:		"minigames/elevatorgame/ChickOrange1_2.png",
/** @const */ ELEVATORGAME_CHICK_2:				"minigames/elevatorgame/ChickPurple2_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_2:		"minigames/elevatorgame/ChickPurple2_2.png",
/** @const */ ELEVATORGAME_CHICK_3:				"minigames/elevatorgame/ChickBlack3_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_3:		"minigames/elevatorgame/ChickBlack3_2.png",
/** @const */ ELEVATORGAME_CHICK_4:				"minigames/elevatorgame/ChickGreen4_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_4:		"minigames/elevatorgame/ChickGreen4_2.png",
/** @const */ ELEVATORGAME_CHICK_5:				"minigames/elevatorgame/ChickRed5_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_5:		"minigames/elevatorgame/ChickRed5_2.png",
/** @const */ ELEVATORGAME_CHICK_6:				"minigames/elevatorgame/ChickYellow6_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_6:		"minigames/elevatorgame/ChickYellow6_2.png",
/** @const */ ELEVATORGAME_CHICK_7:				"minigames/elevatorgame/ChickBlue7_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_7:		"minigames/elevatorgame/ChickBlue7_2.png",
/** @const */ ELEVATORGAME_CHICK_8:				"minigames/elevatorgame/ChickLightPink8_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_8:		"minigames/elevatorgame/ChickLightPink8_2.png",
/** @const */ ELEVATORGAME_CHICK_9:				"minigames/elevatorgame/ChickPink9_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_9:		"minigames/elevatorgame/ChickPink9_2.png",
/** @const */ ELEVATORGAME_CHICK_10:			"minigames/elevatorgame/ChickTurkos10_1.png",
/** @const */ ELEVATORGAME_CHICK_SHOW_10:		"minigames/elevatorgame/ChickTurkos10_2.png",
/** @const */ ELEVATORGAME_TREE_BOLE:			"minigames/elevatorgame/mWorldTreeBole.png",
/** @const */ ELEVATORGAME_TREE_TOP:			"minigames/elevatorgame/TreeTop.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_LEFT_1:	"minigames/elevatorgame/mWorldTreeBranchLeft2.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_LEFT_2:	"minigames/elevatorgame/mWorldTreeBranchLeft4.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_LEFT_3:	"minigames/elevatorgame/mWorldTreeBranchLeft6.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_LEFT_4:	"minigames/elevatorgame/mWorldTreeBranchLeftHighest.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_RIGHT_1:	"minigames/elevatorgame/mWorldTreeBranchRight1.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_RIGHT_2:	"minigames/elevatorgame/mWorldTreeBranchRight3.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_RIGHT_3:	"minigames/elevatorgame/mWorldTreeBranchRight5.png",
/** @const */ ELEVATORGAME_TREE_BRANCH_RIGHT_4:	"minigames/elevatorgame/mWorldTreeBranchRightHighest.png",
/** @const */ ELEVATORGAME_TREE_ELEVATOR_ROPE:	"minigames/elevatorgame/elevator.png",
/** @const */ ELEVATORGAME_TREE_ELEVATOR_BUCKET:"minigames/elevatorgame/bucket.png",

/** @const */ AGENT_MOUSE_SPRITE:      "agents/mouse/body-sprite.png",
/** @const */ AGENT_MOUSE_FACIALS_SPRITE:      "agents/mouse/facials-sprite.png",
/** @const */ AGENT_MOUSE_BLINK_SPRITE:      "agents/mouse/blink-sprite.png",
/** @const */ AGENT_MOUSE_POINT_AT_SPRITE:      "agents/mouse/pointat-sprite.png"
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

MW.SetImage = function (imageObject, newImage, x, y) {
	imageObject.setImage(newImage);
	imageObject.setWidth(newImage.width);
	imageObject.setHeight(newImage.height);
	if (!(x === undefined)) {
		imageObject.setX(x);
	}
	if (!(y === undefined)) {
		imageObject.setY(y);
	}
}