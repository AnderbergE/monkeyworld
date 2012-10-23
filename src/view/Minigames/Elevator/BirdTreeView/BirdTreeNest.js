/**
 * Create a bird tree nest.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * 		{Number} number - number of the branch, default 0
 *		{Boolean} facingRight - if the bird should face right, default true
 * @return The bird tree nest as a Kinetic.group.
 */
MW.BirdTreeNest = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	if (config.number === undefined) config.number = 0;
	if (config.facingRight === undefined) config.facingRight = true;
	var group,
		mother,
		chickGroup,
		chickAnimation,
		motherCelebrate,
		nest;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y,
	});
	
	/* Add the mother */
	mother = new Kinetic.Image({
		image: eval("MW.Images.ELEVATORGAME_NEST_MOTHER_" + config.number)
	});
	group.add(mother);
	
	/* Add the group where the chicks will be added */
	chickGroup = new Kinetic.Group({});
	/* This animation runs when the chicks celebrate */
	chickAnimation = new Kinetic.Animation({
		func: function (frame) {
			if (chickGroup.getChildren().length > 0) {
				chickGroup.getChildren()[0].setY(
					chickGroup.getChildren()[0].getY() +
					0.75 * Math.sin(frame.time * 2 * Math.PI / 300));
				if (chickGroup.getChildren().length > 1) {
					chickGroup.getChildren()[1].setY(
						chickGroup.getChildren()[1].getY() +
						0.75 * Math.sin(-frame.time * 2 * Math.PI / 300));
				}
			}
		}
	});
	group.add(chickGroup);
	
	/* Add the nest */
	nest = new Kinetic.Image({
		x: config.facingRight ? 0 :
			mother.getWidth() - MW.Images.ELEVATORGAME_NEST.width,
		y: mother.getHeight() - MW.Images.ELEVATORGAME_NEST.height / 3 * 2,
		image: MW.Images.ELEVATORGAME_NEST
	});
	group.add(nest);
	
	
	/**
	 * @private
	 * @param {Boolean} showWings - true if the mother's 'wings should be up.
	 */
	function flap (showWings) {
		if (showWings) {
			MW.SetImage(mother,
				eval("MW.Images.ELEVATORGAME_NEST_MOTHER_FLAP_" +
					config.number));
		} else {
			MW.SetImage(mother,
				eval("MW.Images.ELEVATORGAME_NEST_MOTHER_" +
					config.number));
		}
	}
	
	
	/**
	* @public
	* @returns {Number} The width of the bird tree nest.
	*/
	group.getWidth = function () {
		return nest.getWidth();
	};
	
	/**
	* @public
	* @returns {Number} The height of the bird tree nest.
	*/
	group.getHeight = function () {
		/* This is not the exact height, but approximately correct */
		return mother.getHeight();
	};
	
	/**
	 * Add a chick beside the mother in the nest.
	 * @public
	 */
	group.addChick = function () {
		if (chickGroup.getChildren().length < 1) {
			var img = eval("MW.Images.ELEVATORGAME_NEST_CHICK_" +
				config.number);
			chickGroup.add(new Kinetic.Image({
				x: config.facingRight ? mother.getWidth() - img.width / 2 :
					mother.getX() - img.width / 2,
				y: mother.getHeight() - img.height - 3,
				image: img 
			}));
		} else if (chickGroup.getChildren().length < 2) {
			var img = eval("MW.Images.ELEVATORGAME_NEST_CHICK_" +
				config.number);
			chickGroup.add(new Kinetic.Image({
				x: config.facingRight ? mother.getWidth() :
					mother.getX() - img.width,
				y: mother.getHeight() - img.height - 6,
				image: img 
			}));
			/* it looks better with this chick behind the other one */
			chickGroup.getChildren()[0].moveUp();
		} /* Do not add more birds than two. */
	}
	
	/**
	 * @public
	 * @param {Boolean} celebrate - true if the nest should celebrate.
	 */
	group.celebrate = function (celebrate) {
		if (celebrate) {
			chickAnimation.start();
			var showingWings = false;
			motherCelebrate = setInterval(function () {
				showingWings = !showingWings;
				flap(showingWings);
			}, 150);
		} else {
			chickAnimation.stop();
			clearInterval(motherCelebrate);
			flap(false);
		}
	}
	
	/**
	 * @public
	 * @param {Boolean} scare - true if the mother should scare.
	 */
	group.scare = function (scare) {
		flap(scare);
	}
	
	
	return group;
};
