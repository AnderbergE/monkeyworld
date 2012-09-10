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
			offset = 5,
			timeMillis = 100;
		view.getTween(group.attrs)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox + offset }, timeMillis)
		.to({ x: ox - offset }, timeMillis)
		.to({ x: ox }, timeMillis);
		view.getTween(group.attrs)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy + offset }, timeMillis)
		.to({ y: oy - offset }, timeMillis)
		.to({ y: oy }, timeMillis);
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
