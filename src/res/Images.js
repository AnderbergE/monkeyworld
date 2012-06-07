/**
 * Definition of all the images that the application will use. They can be
 * loaded before the game starts.
 * 
 * @const
 */
var IMAGE_SOURCES = {
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
/** @const */ "monkey": "monkey.png",
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
/** @const */ "balloons": "balloons.png",
/** @const */ "eyeball": "BeOS_Eyeball.png",
/** @const */ "symbol-stop": "Symbol-Stop.png",
/** @const */ "symbol-check": "Symbol-Check.png",
/** @const */ "birdnest": "Birds-Nest-psd47561.png",
/** @const */ "junglebg": "Jungle_Bkg.png",
/** @const */ "elephant": "elephant.png",
/** @const */ "lion": "lion.png",
/** @const */ "giraff": "giraff.png"
};

var images = {};

var _img_total = 0;
var _img_progress = 0;
for (var src in IMAGE_SOURCES) {
    _img_total++;
}

function loadImages(callback) {
	Log.debug("Loading images...", "images");
	var loadedImages = 0;
	var numImages = Object.size(IMAGE_SOURCES);
	for (var src in IMAGE_SOURCES) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
            	callback();
            }
            _img_progress = loadedImages / _img_total;
        };
        images[src].src = "../res/img/" + IMAGE_SOURCES[src];
    }
};
