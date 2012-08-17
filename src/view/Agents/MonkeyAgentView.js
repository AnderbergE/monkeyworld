/**
 * @extends {MW.AgentView}
 * @constructor
 */
MW.MonkeyAgentView = function() {
	MW.AgentView.call(this);
	this.normalFace = function () { return MW.Images.MONKEY; };
	this.happyFace = function () { return MW.Images.MONKEY; };
	this.standing = function () { return MW.Images.MONKEY; };
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
	this.normalFace = function () { return MW.Images.AGENT_FACE_NORMAL_MOUSE; };
	this.happyFace = function () { return MW.Images.AGENT_FACE_HAPPY_MOUSE; };
};

