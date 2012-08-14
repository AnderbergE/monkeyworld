/**
 * @extends {MW.AgentView}
 * @constructor
 */
MW.MonkeyAgentView = function() {
	MW.AgentView.call(this);
	this.normalFace = function () { return MW.Images.MONKEY; };
	this.happyFace = function () { return MW.Images.MONKEY; };
	this.sadFace = function () { return MW.Images.MONKEY; };
	this.standing = function () { return MW.Images.MONKEY; };
};


MW.MouseAgentView = function () {
	MW.AgentView.call(this);
	this.standing = function () { return MW.Images.AGENT_FACE_NORMAL_MOUSE; };
	this.normalFace = function () { return MW.Images.AGENT_FACE_NORMAL_MOUSE; };
	this.happyFace = function () { return MW.Images.AGENT_FACE_HAPPY_MOUSE; };
	this.sadFace = function () { return MW.Images.AGENT_FACE_SAD_MOUSE; };
};