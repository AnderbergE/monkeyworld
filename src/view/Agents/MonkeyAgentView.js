/**
 * @extends {MW.AgentView}
 * @constructor
 */
MW.MonkeyAgentView = function() {
	MW.AgentView.call(this);
	this.bodyOffset = function () { return { x: 0, y: 0 }; };
	this.feetOffset = function () { return 315; };
	this.faceOffset = function () { return { x: -12, y: -11 }; };
	this.head = function () { return MW.Images.AGENT_MOUSE_HEAD; };
	this.standing = function () { return MW.Images.AGENT_MOUSE_NORMAL; };
	this.standingNoLeftArm = function () { return MW.Images.AGENT_MOUSE_NORMAL_NO_ARM; };
	this.normalFace = function () { return MW.Images.AGENT_FACE_NORMAL_MOUSE; };
	this.happyFace = function () { return MW.Images.AGENT_FACE_HAPPY_MOUSE; };
	this.danceArray = function () {
		return [
			MW.Images.AGENT_DANCE_MOUSE_1,
			MW.Images.AGENT_DANCE_MOUSE_2,
			MW.Images.AGENT_DANCE_MOUSE_3
		];
	};
	this.danceOffset = function () { return { x: 0, y: -51 }; };
	this.pointAtArmArray = function () {
		return [
			MW.Images.AGENT_ARM_POINT_1,
			MW.Images.AGENT_ARM_POINT_2,
			MW.Images.AGENT_ARM_POINT_3,
			MW.Images.AGENT_ARM_POINT_4
		];
	};
	this.pointAtArmOffset = function () {
		return { x: -216, y: -196 };
	};
	this.pointAtButtonArray = function () {
			return [
			MW.Images.AGENT_ARM_POINT_AT_1,
			MW.Images.AGENT_ARM_POINT_AT_2,
			MW.Images.AGENT_ARM_POINT_AT_3,
			MW.Images.AGENT_ARM_POINT_AT_4,
			MW.Images.AGENT_ARM_POINT_AT_5,
			MW.Images.AGENT_ARM_POINT_AT_6
		];
	};
};

/**
 * @extends {MW.AgentView}
 * @constructor
 */
MW.MouseAgentView = function () {
	MW.AgentView.call(this);
	this.bodyOffset = function () { return { x: 0, y: 0 }; };
	this.feetOffset = function () { return 315; };
	this.faceOffset = function () { return { x: -12, y: -11 }; };
	this.head = function () { return MW.Images.AGENT_MOUSE_HEAD; };
	this.standing = function () { return MW.Images.AGENT_MOUSE_NORMAL; };
	this.standingNoLeftArm = function () { return MW.Images.AGENT_MOUSE_NORMAL_NO_ARM; };
	this.normalFace = function () { return MW.Images.AGENT_FACE_NORMAL_MOUSE; };
	this.happyFace = function () { return MW.Images.AGENT_FACE_HAPPY_MOUSE; };
	this.danceArray = function () {
		return [
			MW.Images.AGENT_DANCE_MOUSE_1,
			MW.Images.AGENT_DANCE_MOUSE_2,
			MW.Images.AGENT_DANCE_MOUSE_3
		];
	};
	this.danceOffset = function () { return { x: 0, y: -51 }; };
	this.pointAtArmArray = function () {
		return [
			MW.Images.AGENT_ARM_POINT_1,
			MW.Images.AGENT_ARM_POINT_2,
			MW.Images.AGENT_ARM_POINT_3,
			MW.Images.AGENT_ARM_POINT_4
		];
	};
	this.pointAtArmOffset = function () {
		return { x: -216, y: -196 };
	};
	this.pointAtButtonArray = function () {
			return [
			MW.Images.AGENT_ARM_POINT_AT_1,
			MW.Images.AGENT_ARM_POINT_AT_2,
			MW.Images.AGENT_ARM_POINT_AT_3,
			MW.Images.AGENT_ARM_POINT_AT_4,
			MW.Images.AGENT_ARM_POINT_AT_5,
			MW.Images.AGENT_ARM_POINT_AT_6
		];
	};
};

