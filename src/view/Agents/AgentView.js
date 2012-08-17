/**
 * @constructor
 */
MW.AgentView = function() {
	var view = this;
	/**
	 * @return {Kinetic.Node}
	 */
	this.getBody = function (x, y) {
		var group = new Kinetic.Group({ x: x, y: y });
		var body = new Kinetic.Image({
			image: view.standing(),
			offset: view.bodyOffset(),
			width: view.standing().width,
			height: view.standing().height
		});
		var face = new Kinetic.Image({
			image: view.normalFace(),
			x: view.faceOffset().x,
			y: view.faceOffset().y
		});
		group.add(body);
		group.add(face);
		return group;
	};

	this.getFace = function (x, y) {
		var group = new Kinetic.Group({ x: x, y: y });
		var head = new Kinetic.Image({
			image: view.head(),
			width: view.head().width,
			height: view.head().height
		});
		var face = new Kinetic.Image({
			image: view.normalFace(),
			x: view.faceOffset().x,
			y: view.faceOffset().y
		});
		group.add(head);
		group.add(face);
		return group;
	};
};

