/**
 * Definition of all the images that the application will use. They can be
 * loaded before the game starts.
 * 
 * @enum {string}
 */
MW.ImageSources = {
///** @const */ "fish0": "fish/0.png",
///** @const */ "fish1": "fish/1.png",
///** @const */ "fish2": "fish/2.png",
///** @const */ "fish3": "fish/BlueFish_256x256.png",
///** @const */ "fish4": "fish/GreenFish_256x256.png",
///** @const */ "fish5": "fish/RedFish_256x256.png",
///** @const */ "fish6": "fish/YellowFish_256x256.png",
///** @const */ "fish7": "fish/Gold-Fish.png",
///** @const */ "fish8": "fish/Clown-Fish.png",
///** @const */ "bamboo": "bambu.png",
///** @const */ "plant": "plant.png",
///** @const */ "sky": "sky.png",
///** @const */ "basket": "01-tileable-basket-weave-textures-preview-003.jpg",
/** @const */ MONKEY: "monkey.png",
///** @const */ "avatar": "Boo-icon.png",
///** @const */ "monkey_icon": "Gnome-Face-Monkey-64.png",
///** @const */ "green": "1333364667_Circle_Green.png",
///** @const */ "red": "1333364683_Circle_Red.png",
///** @const */ "person-yes": "Accept-Male-User.png",
///** @const */ "person-no": "Remove-Male-User.png",
///** @const */ "banana-big": "1333448754_Banana.png",
///** @const */ "banana-small": "1333448736_Banana64.png",
///** @const */ "happy-face": "Positive.png",
///** @const */ "sad-face": "Negative.png",
///** @const */ "rafiki": "Rafiki.png",
/** @const */ BALLOONS: "balloons.png",
/** @const */ EYEBALL: "BeOS_Eyeball.png",
/** @const */ SYMBOL_STOP: "Symbol-Stop.png",
/** @const */ SYMBOL_CHECK: "Symbol-Check.png",
/** @const */ BIRDNEST: "Birds-Nest-psd47561.png",
/** @const */ JUNGLEBG: "Jungle_Bkg.png",
/** @const */ ELEPHANT: "elephant.png",
/** @const */ LION: "lion.png",
/** @const */ GIRAFF: "giraff.png",
/** @const */ TREEGAME_BACKGROUND:   "minigames/treegame/background.png",
/** @const */ TREEGAME_COVER:        "minigames/treegame/cover.png",
/** @const */ TREEGAME_LIZARD:       "minigames/treegame/lizard.png",
/** @const */ BUTTON_WOOD: "buttons/wood.png"
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

