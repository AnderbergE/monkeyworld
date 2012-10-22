/**
 * Create a bird tree elevator.
 * @param {Hash} config:
 * 		{Number} x - x position, default 0
 * 		{Number} y - y position, default 0
 * @return The bird tree elevator as a Kinetic.group.
 */
MW.BirdTreeElevator = function (config) {
	if (config.x === undefined) config.x = 0;
	if (config.y === undefined) config.y = 0;
	var group,
		rope,
		inElevatorGroup,
		elevator,
		floorText;
	
	group = new Kinetic.Group({
			x: config.x,
			y: config.y,
	});
	
	/* Add the rope to the bucket */
	rope = new Kinetic.Image({
		y: -MW.Images.ELEVATORGAME_TREE_ELEVATOR_ROPE.height + 5,
		image: MW.Images.ELEVATORGAME_TREE_ELEVATOR_ROPE
	});
	group.add(rope);
	
	inElevatorGroup = new Kinetic.Group();
	group.add(inElevatorGroup);
	
	/* Add the bucket (elevator) */
	elevator = new Kinetic.Image({
		image: MW.Images.ELEVATORGAME_TREE_ELEVATOR_BUCKET
	});
	group.add(elevator);
	
	floorText = new Kinetic.Text({
		x: elevator.getWidth() / 2 - 5,
		y: elevator.getHeight() / 2 - 6,
		text: '0',
		fontSize: 14,
		fontFamily: 'sans-serif',
		textFill: 'white',
		fontStyle: 'bold',
		/* THIS ALIGN DOES NOT SEEM TO WORK! */
		align: 'center',
		shadow: {
			color: 'yellow',
			blur: 5,
			opacity: 1
		}
	});
	group.add(floorText);
	
	
	/**
	 * @public
	 * @returns {Number} The width of the elevator bucket.
	 */
	group.getWidth = function () {
		return elevator.getWidth();
	};
	
	/**
	 * @public
	 * @returns {Number} The height of the elevator bucket.
	 */
	group.getHeight = function () {
		return elevator.getHeight();
	};
	
	/**
	 * @public
	 * @param {Number} number - the floor number of the elevator.
	 */
	group.setFloor = function (number) {
		floorText.setText(number.toString());
	};
	
	/**
	 * Add an object to the elevator. This will be put between bucket and rope.
	 * (Note: This will inherit the elevators x and y position.)
	 * @public
	 * @param {Kinect.Node} passenger - The object to add to the elevator.
	 */
	group.addPassenger = function (passenger) {
		inElevatorGroup.add(passenger);
	}
	
	/**
	 * @public
	 * @param {Kinect.Node} passenger - The object to remove from the elevator.
	 */
	group.removePassenger = function (passenger) {
		inElevatorGroup.remove(passenger);
	}
	
	
	return group;
};
