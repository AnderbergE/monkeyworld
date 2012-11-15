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
	if (config.number === undefined) config.number = 1;
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
		image: MW.Images.ELEVATORGAME_CHICK_FEET
	});
	group.add(feet);
	bird = new Kinetic.Image({
		image: eval("MW.Images.ELEVATORGAME_CHICK_" + config.number)
	});
	group.add(bird);
	beak = new Kinetic.Image({
		x: coordinates.beakX,
		y: coordinates.beakY,
		image: MW.Images.ELEVATORGAME_CHICK_BEAK_OPEN
	});
	group.add(beak);
	
	group.featherPos = [
		{x: 310, y: 65, r: 0},		// 1
		{x: 310, y: 100, r: 0},	// 2 
		{x: 305, y: 115, r: 0},	// 3
		{x: 295, y: 130, r: 0},	// 4
		{x: 275, y: 145, r: 0},	// 5
		{x: 26, y: 88, r: 180},		// 6
		{x: 30, y: 119, r: 0},	// 7
		{x: 36, y: 139, r: 0},	// 8
		{x: 50, y: 151, r: 0},	// 9
		{x: 69, y: 161, r: 0}		// 10
	]
	
	
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
	 * @returns {Number} The number of the bird.
	 */
	group.getNumber = function () {
		return config.number;
	};
	
	/**
	 * @public
	 * @param {Boolean} show - true if the bird should show its wings.
	 */
	group.showNumber = function (show) {
		if (show) {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_SHOW_" + config.number));
		} else {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_" + config.number));
		}
		config.drawScene();
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
					MW.SetImage(feet, MW.Images.ELEVATORGAME_CHICK_WALK_1,
						coordinates.feetWalkX, coordinates.feetWalkY);
				} else {
					MW.SetImage(feet, MW.Images.ELEVATORGAME_CHICK_WALK_2);
					config.drawScene();
				}
				config.drawScene();
				leftLeg = !leftLeg;
			}, 150);
		} else {
			clearInterval(walkAnimation);
			MW.SetImage(feet, MW.Images.ELEVATORGAME_CHICK_FEET,
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
					MW.SetImage(beak, MW.Images.ELEVATORGAME_CHICK_BEAK_OPEN);
				} else {
					MW.SetImage(beak, MW.Images.ELEVATORGAME_CHICK_BEAK_CLOSED);
				}
				config.drawScene();
				mouthOpen = !mouthOpen;
			}, 150);
		} else {
			clearInterval(talkAnimation);
			MW.SetImage(beak, MW.Images.ELEVATORGAME_CHICK_BEAK_OPEN);
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
