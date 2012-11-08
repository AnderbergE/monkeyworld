/**
 * Create a bird.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} scale - scale of bird, default 0
 * 		{Number} number - number of the bird, default 0
 * @return The bird as a Kinetic.group.
 */
MW.Bird = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.scale === undefined) config.scale = 1;
	if (config.number === undefined) config.number = 0;
	var group,
		bird,
		animation;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y,
			scale: config.scale
	});
	
	/* Add bird */
	bird = new Kinetic.Image({
		image: eval("MW.Images.ELEVATORGAME_CHICK_" + config.number)
	});
	group.add(bird);
	
	
	/**
	 * Walk with left foot.
	 * @private
	 */
	function walkLeft() {
		MW.SetImage(bird,
			eval("MW.Images.ELEVATORGAME_CHICK_WALK_LEFT_" + config.number));
		animation = setTimeout(walkRight, 150);
	}
	
	/**
	 * Walk with right foot.
	 * @private
	 */
	function walkRight() {
		MW.SetImage(bird,
			eval("MW.Images.ELEVATORGAME_CHICK_WALK_RIGHT_" + config.number));
		animation = setTimeout(walkLeft, 150);
	}
	
	/**
	 * Open mouth.
	 * @private
	 */
	function mouthOpen () {
		MW.SetImage(bird, 
			eval("MW.Images.ELEVATORGAME_CHICK_TALK_" + config.number));
		animation = setTimeout(mouthClosed, 150);
	}
	
	/**
	 * Close mouth.
	 * @private
	 */
	function mouthClosed () {
		MW.SetImage(bird, 
			eval("MW.Images.ELEVATORGAME_CHICK_" + config.number));
		animation = setTimeout(mouthOpen, 150);
	}
	
	
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
		/* Change width and height to avoid stretch/squeeze */
		clearTimeout(animation);
		if (show) {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_SHOW_" + config.number));
		} else {
			MW.SetImage(bird, 
				eval("MW.Images.ELEVATORGAME_CHICK_" + config.number));
		}
	}
	
	/**
	 * @public
	 * @param {Boolean} walk - true if the bird should walk.
	 */
	group.walk = function (walk) {
		clearTimeout(animation);
		if (walk) {
			walkLeft();
		} else {
			MW.SetImage(bird,
				eval("MW.Images.ELEVATORGAME_CHICK_" + config.number));
		}
	}
	
	/**
	 * @public
	 * @param {Boolean} talk - true if the bird should talk.
	 */
	group.talk = function (talk) {
		clearTimeout(animation);
		if (talk) {
			mouthOpen();
		} else {
			MW.SetImage(bird,
				eval("MW.Images.ELEVATORGAME_CHICK_" + config.number));
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
