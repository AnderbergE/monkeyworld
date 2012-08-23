/**
 * @constructor
 */
MW.AgentView = function() {
	var view = this;
	var bodyGroup = null;
	var bodyImage = null;
	var bodyImageOriginal = null;
	var bodyFace = null;
	var bodyView = null;
	var faceView = null;
	var leftArmImage = null;
	var bodyX = null, bodyY = null;
	var resetting = false;
	var face = null;
	var headBlink = null;
	var talkInterval = null;
	var talkTimeout = null;

	/**
	 * @return {Kinetic.Node}
	 */
	this.getBody = function (v, x, y) {
		bodyView = v;
		bodyX = x; bodyY = y;
		bodyGroup = new Kinetic.Group({ x: bodyX, y: bodyY });
		bodyImage = new Kinetic.Image({
			image: view.standing()
		});
		bodyImageOriginal = bodyImage;
		bodyFace = new Kinetic.Image({
			image: view.normalFace(),
			x: view.faceOffset().x,
			y: view.faceOffset().y
		});
		leftArmImage = new Kinetic.Image({
			image: view.pointAtArmArray()[0],
			x: view.pointAtArmOffset().x,
			y: view.pointAtArmOffset().y,
			visible: false
		});
		bodyGroup.add(bodyImage);
		bodyGroup.add(bodyFace);
		bodyGroup.add(leftArmImage);
		return bodyGroup;
	};

	this.getFace = function (v, x, y) {
		faceView = v;
		var group = new Kinetic.Group({ x: x, y: y });
		var head = new Kinetic.Image({
			image: view.head(),
			width: view.head().width,
			height: view.head().height
		});
		face = new Kinetic.Image({
			image: view.normalFace(),
			x: view.faceOffset().x,
			y: view.faceOffset().y
		});
		headBlink = new Kinetic.Image({
			image: view.blinkArray()[0],
			visible: false,
			x: view.faceOffset().x,
			y: view.faceOffset().y
		});
		group.add(head);
		group.add(face);
		group.add(headBlink);
		
		return group;
	};

	this.jumpDown = function (x, y) {
		bodyX = x;
		bodyY = y;
		bodyView.getTween(bodyGroup.attrs).to({ alpha: 1, x: x, y: y }, 2000);
	};
	
	this.showBody = function () {
		bodyGroup.setAlpha(1);
		bodyGroup.show();
	};

	this.moveBody = function (x, y) {
		bodyX = x;
		bodyY = y;
		bodyGroup.setX(x);
		bodyGroup.setY(y);
	};

	/**
	 * @return {Function} a reset function
	 */
	this.pointAt = function (number, callback) {
		var
			waitingTime = 200,
			rollbackable = null,
			images = [
				view.pointAtArmArray()[0],
				view.pointAtArmArray()[1],
				view.pointAtArmArray()[2],
				view.pointAtArmArray()[3],
				view.pointAtButtonArray()[number - 1]
			],
			reset = false,
			resetCallback = null,
			i = 0,
			rolling = false;
		bodyImage.setImage(view.standingNoLeftArm());
		leftArmImage.show();
		var rollbackable = function () {
			rolling = true;
			leftArmImage.setImage(images[i]);
			bodyView.setTimeout(function () {
				if (!reset && i < images.length) {
					i += 1;
					rollbackable();
				} else if (reset && i >= 0) {
					i -= 1;
					rollbackable();
				} else if (i === images.length) {
					callback();
					rolling = false;
				} else if (reset && i === -1) {
					bodyImage.setImage(view.standing());
					leftArmImage.hide();
					if (resetCallback !== null && resetCallback !== undefined) {
						resetCallback();
					}
					rolling = false;
				}
			}, waitingTime);
		};
		rollbackable();
		var resetFunction = function (done) {
			resetCallback = done;
			reset = true;
			if (!rolling) {
				rollbackable();
			}
		};
		this.resetFunction = resetFunction;
		return resetFunction;
	};

	this.interruptPointAt = function () {
		this.resetFunction();
	};

	this.stopDance = function () {
		bodyView.removeTween(bodyImage.attrs);
		bodyImage.setImage(view.standing());
		bodyGroup.setX(bodyX);
		bodyGroup.setY(bodyY);
		bodyImage.setWidth(view.standing().width);
		bodyImage.setHeight(view.standing().height);
		bodyFace.show();
	};

	this.dance = function () {
		var wait = 400;
		bodyFace.hide();
		bodyGroup.setX(bodyX + view.danceOffset().x);
		bodyGroup.setY(bodyY + view.danceOffset().y);
		bodyImage.setImage(view.danceArray()[0]);
		bodyImage.setWidth(view.danceArray()[0].width);
		bodyImage.setHeight(view.danceArray()[0].height);
		bodyView.getTween(bodyImage.attrs)
		.to({ image: view.danceArray()[0] })
		.wait(wait)
		.to({ image: view.danceArray()[1] })
		.wait(wait)
		.to({ image: view.danceArray()[2] })
		.wait(wait)
		.call(view.dance);
	};

	this.faceBlink = function () {
		faceView.setInterval(function () {
			headBlink.show();
			faceView.getTween(headBlink.attrs)
			.to({ image: view.blinkArray()[1] }, 100)
			.to({ image: view.blinkArray()[2] }, 100)
			.to({ image: view.blinkArray()[1] }, 100)
			.to({ image: view.blinkArray()[0] }, 100)
			.call(function () { headBlink.hide(); });
		}, 5000);
	};

	this.startTalk = function () {
		bodyFace.setImage(view.talk());
		talkInterval = bodyView.setInterval(function () {
			bodyFace.setImage(view.normalFace());
			talkTimeout = bodyView.setTimeout(function () {
				bodyFace.setImage(view.talk());
			}, 200);
		}, 400);
	};
	
	this.stopTalk = function () {
		bodyView.clearInterval(talkInterval);
		bodyView.clearTimeout(talkTimeout);
		bodyFace.setImage(view.normalFace());
	};
};

