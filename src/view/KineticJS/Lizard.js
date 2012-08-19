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
	this.tongueOut = function (callback) {
		openMouth(function () { tongueOut(callback); });
	};

	this.tongueIn = function (callback) {
		tongueIn(function () { closeMouth(callback); });
	}
	group.tongueIn = this.tongueIn;
	group.tongueOut = this.tongueOut;

	return group;
};
