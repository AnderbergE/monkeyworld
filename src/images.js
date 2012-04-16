/** @const */
var IMAGE_SOURCES = {
/** @const */ "fish0": "fish/0.png",
/** @const */ "fish1": "fish/1.png",
/** @const */ "bamboo": "bambu.png",
/** @const */ "plant": "plant.png",
/** @const */ "sky": "sky.png",
/** @const */ "basket": "01-tileable-basket-weave-textures-preview-003.jpg",
/** @const */ "monkey": "monkey.png",
/** @const */ "avatar": "Boo-icon.png",
/** @const */ "monkey_icon": "Gnome-Face-Monkey-64.png",
/** @const */ "green": "1333364667_Circle_Green.png",
/** @const */ "red": "1333364683_Circle_Red.png",
/** @const */ "person-yes": "Accept-Male-User.png",
/** @const */ "person-no": "Remove-Male-User.png",
/** @const */ "banana-big": "1333448754_Banana.png",
/** @const */ "banana-small": "1333448736_Banana64.png"
};

var images = {};

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
        };
        images[src].src = "../res/img/" + IMAGE_SOURCES[src];
    }
};

/**
 * 
 * @param {string} id
 * @returns {Kinetic.Image}
 */
function getImage(id) {
	return new Kinetic.Image({image:images[id]});
}