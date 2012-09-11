/**
 * @extends {Kinetic.Node}
 * @constructor
 * @param {Object} config
 *                   Properties inherited from Kinetic.Node, except for:
 *                   {number} config.type (1-3)
 */
Kinetic.MW.Parcel = function (config) {

	var
		group,
		image,
		imageObj,
		rect;

	group = new Kinetic.Group(config);
	switch (config.type) {
	case 1: imageObj = MW.Images.PARCEL_1; break;
	case 2: imageObj = MW.Images.PARCEL_2; break;
	case 3: imageObj = MW.Images.PARCEL_3; break;
	default: throw "NoSuchParcelTypeException";
	}
	image = new Kinetic.Image({
		image: imageObj,
		width: imageObj.width,
		height: imageObj.height,
		scale: 0.6 + (1.0 - 0.6) * Math.random(),
		offset: {
			x: imageObj.width / 2,
			y: imageObj.height / 2
		}/*,
		shadow: {
		      color: 'black',
		      blur: 10,
		      offset: [3, 3],
		      opacity: 0.5
		    }*/
	});
	group.add(image);

	/**
	 * Shakes the parcel
	 * @param {MW.ViewModule} view
	 */
	group.shake = function (view) {
		var
			ox = group.getX(),
			oy = group.getY(),
			offset = 4,
			timeSeconds = 0.1;

		function moveTo(dir, again) {
			group.transitionTo({
				x: ox + dir * offset,
				y: oy + dir * offset,
				duration: timeSeconds,
				callback: function () {
					if (again > 0) {
						var nextAgain = again -= 1;
						moveTo(-dir, nextAgain);
					} else {
						group.transitionTo({
							x: ox,
							y: oy,
							duration: timeSeconds
						});
					}
				}
			});
		}
		moveTo(1, 9);
	};

	/**
	 * Whan happens when the parcel is clicked
	 */
	group.onClick = function (fnc) {
		group.on("mousedown touchstart", fnc);
	};

	group.offClick = function (fnc) {
		group.off("mousedown touchstart");
	};

	/**
	 * Open the parcel
	 */
	group.open = function () {
		
	};

	return group;
};
