/**
 * @extends {Kinetic.Node}
 * @constructor
 * @param {Object} config
 */
Kinetic.MW.Lizard = function (config) {
	var
		group = new Kinetic.Group(config),
		sprite,
		tongueSprite,
		walkInterval,
		walkTimeout,
		mouthInterval = 200,
		tongueInterval = 200,
		animations = {},
		tongueAnimations = {},
		hasInit = false;

	animations["idle"] = [
		{ x: 0, y: 0, width: 181, height: 309 }
	];

	animations["walking"] = [
		{ x: 0, y: 718, width: 181, height: 309 },
		{ x: 0, y: 359, width: 181, height: 309 }

	];

	animations["openMouth"] = [
		{ x: 0, y: 1077, width: 181, height: 309 },
		{ x: 0, y: 1436, width: 181, height: 309 },
		{ x: 0, y: 1795, width: 181, height: 309 },
		{ x: 231, y: 0, width: 181, height: 309 }
	];

	animations["closeMouth"] = [
		{ x: 231, y: 0, width: 181, height: 309 },
		{ x: 0, y: 1795, width: 181, height: 309 },
		{ x: 0, y: 1436, width: 181, height: 309 },
		{ x: 0, y: 1077, width: 181, height: 309 }
	];

	animations["keepMouthOpen"] = [
		{ x: 231, y: 0, width: 181, height: 309 }
	];

	tongueAnimations["idleIn"] = [
		{ x: 0, y: 0, width: 500, height: 500 }
	];

	tongueAnimations["out"] = [
		{ x: 0, y: 0, width: 500, height: 500 },
		{ x: 0, y: 550, width: 500, height: 500 },
		{ x: 0, y: 1100, width: 500, height: 500 },
		{ x: 0, y: 1650, width: 500, height: 500 },
		{ x: 550, y: 0, width: 500, height: 500 }
	];

	tongueAnimations["in"] = [
		{ x: 550, y: 0, width: 500, height: 500 },
		{ x: 0, y: 1650, width: 500, height: 500 },
		{ x: 0, y: 1100, width: 500, height: 500 },
		{ x: 0, y: 550, width: 500, height: 500 },				
		{ x: 0, y: 0, width: 500, height: 500 }
	];

	tongueAnimations["idleOut"] = [
		{ x: 550, y: 0, width: 500, height: 500 }
	];

	sprite = new Kinetic.Sprite({
		image: MW.Images.TREEGAME_LIZARD_SPRITE,
		animations: animations,
		animation: "idle",
		frameRate: 5
	});
	
	tongueSprite = new Kinetic.Sprite({
		image: MW.Images.TREEGAME_LIZARD_TONGUE_SPRITE,
		animations: tongueAnimations,
		animation: "idleIn",
		frameRate: 10,
		visible: false,
		x: -170 + 279,
		y: -200 + 281,
		offset: {
			x: 279,
			y: 281
		}
	});

	group.add(tongueSprite);
	group.add(sprite);

	this.startWalk = function () {
		sprite.setAnimation("walking");
	};
	
	this.stopWalk = function () {
		sprite.setAnimation("idle");
	};
	
	function openMouth(callback) {
		sprite.setAnimation("openMouth");
		sprite.afterFrame(animations["openMouth"].length - 1, function () {
			sprite.setAnimation("keepMouthOpen");
			callback();
		});
	}

	function closeMouth(callback) {
		sprite.setAnimation("closeMouth");
		sprite.afterFrame(animations["closeMouth"].length - 1, function () {
			sprite.setAnimation("idle");
			callback();
		});
	}

	function tongueOut(callback) {
		tongueSprite.setAnimation("out");
		tongueSprite.show();
		tongueSprite.afterFrame(tongueAnimations["out"].length - 1, function () {
			tongueSprite.setAnimation("idleOut");
			callback();
		});
	}

	function tongueIn(callback) {
		tongueSprite.setAnimation("in");
		tongueSprite.afterFrame(tongueAnimations["in"].length - 1, function () {
			tongueSprite.setAnimation("idleIn");
			tongueSprite.hide();
			callback();
		});
	}

	group.startWalk = this.startWalk;
	group.stopWalk = this.stopWalk;
	this.tongueOut = function (callback) {
		openMouth(function () { tongueOut(callback); });
	};

	this.tongueIn = function (callback) {
		tongueIn(function () { closeMouth(callback); });
	}
	this.start = function () {
		sprite.start();
		tongueSprite.start();
	};
	group.tongueIn = this.tongueIn;
	group.tongueOut = this.tongueOut;
	group.start = this.start;

	return group;
};
