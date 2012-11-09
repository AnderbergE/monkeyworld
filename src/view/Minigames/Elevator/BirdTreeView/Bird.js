/**
 * Create a bird.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} scale - scale of bird, default 0
 * 		{Number} number - number of the bird, default 0
 *		{Function} drawScene - function that redraws the scene, default empty.
 * @return The bird as a Kinetic.group.
 */
MW.Bird = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.scale === undefined) config.scale = 1;
	if (config.number === undefined) config.number = 0;
	if (config.drawScene === undefined) config.drawScene = function () {};
	var group,
		bird,
		feet,
		walkAnimation,
		beak,
		talkAnimation,
		coordinates = {
			feetX: 122, feetY: 203,
			feetWalkX: 113, feetWalkY: 203,
			beakX: 172, beakY: 46,
		};
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y,
			scale: config.scale
	});
	
	/* Add bird */
	feet = new Kinetic.Image({
		x: coordinates.feetX,
		y: coordinates.feetY,
		image: MW.Images.ELEVATORGAME_CHICK_FEET_LIGHT_1
	});
	group.add(feet);
	bird = new Kinetic.Image({
		image: eval("MW.Images.ELEVATORGAME_CHICK_" + config.number)
	});
	group.add(bird);
	beak = new Kinetic.Image({
		x: coordinates.beakX,
		y: coordinates.beakY,
		image: MW.Images.ELEVATORGAME_CHICK_BEAK_OPEN_LIGHT
	});
	group.add(beak);
	
	
	/**
	 * @public
	 * @returns {Number} The width of the bird.
	 */
	group.getWidth = function () {
		return bird.getWidth();
	};
	
	/**
	 * @public
	 * @returns {Number} The height of the bird.
	 */
	group.getHeight = function () {
		return bird.getHeight();
	};
	
	/**
	 * @public
	 * @param {Boolean} show - true if the bird should show its wings.
	 */
	group.showNumber = function (show) {
		if (show) {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_SHOW_" + config.number));
			config.drawScene();
		} else {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_" + config.number));
			config.drawScene();
		}
	}
	
	/**
	 * @public
	 * @param {Boolean} walk - true if the bird should walk.
	 */
	group.walk = function (walk) {
		if (walk) {
			var leftLeg = true;
			walkAnimation = setInterval(function () {
				if (leftLeg) {
					MW.SetImage(feet, MW.Images.ELEVATORGAME_CHICK_WALK_LIGHT_1,
						coordinates.feetWalkX, coordinates.feetWalkY);
				} else {
					MW.SetImage(feet, MW.Images.ELEVATORGAME_CHICK_WALK_LIGHT_2);
					config.drawScene();
				}
				config.drawScene();
				leftLeg = !leftLeg;
			}, 150);
		} else {
			clearInterval(walkAnimation);
			MW.SetImage(feet, MW.Images.ELEVATORGAME_CHICK_FEET_LIGHT_1,
				coordinates.feetX, coordinates.feetY);
			config.drawScene();
		}
	}
	
	/**
	 * @public
	 * @param {Boolean} talk - true if the bird should talk.
	 */
	group.talk = function (talk) {
		if (talk) {
			var mouthOpen = true;
			talkAnimation = setInterval(function () {
				if (mouthOpen) {
					MW.SetImage(beak, MW.Images.ELEVATORGAME_CHICK_BEAK_OPEN_LIGHT);
				} else {
					MW.SetImage(beak, MW.Images.ELEVATORGAME_CHICK_BEAK_CLOSED_DARK);
				}
				config.drawScene();
				mouthOpen = !mouthOpen;
			}, 150);
		} else {
			clearInterval(talkAnimation);
			MW.SetImage(beak, MW.Images.ELEVATORGAME_CHICK_BEAK_OPEN_LIGHT);
			config.drawScene();
		}
	}
	
	/**
	 * TODO: This should be made in a super class, along with panda stuff.
	 * @public
	 * @param {MW.SoundEntry} sound - the sound to play
	 */
	group.say = function (sound) {
		MW.Sound.play(sound);
		group.talk(true);
		setTimeout(function () {
			group.talk(false);
		}, sound.getLength() * 1000);
	}
	
	/**
	 * @public
	 * @param {Function} callback - called when turn is complete.
	 */
	group.turn = function (callback) {
		group.transitionTo({
			x: group.getX() + (group.getWidth() * group.getScale().x),
			scale: {x: -1 * group.getScale().x, y: group.getScale().y},
			duration: 0.1,
			callback: callback
		});
	}
	
	
	return group;
};
