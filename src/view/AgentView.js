/**
 * @constructor
 * @extends {Kinetic.Shape}
 * @param {number} x
 * @param {number} y
 */
var AgentView = function(x, y) {
	
	var SIZE = {
		THIGH:    { width: 30, height: 40 },
		LOWERLEG: { width: 20, height: 40 },
		TORSO:    { width: 60, height: 40 },
		HEAD:     { width: 30, height: 10 },
		UPPERARM: { width: 20, height: 40 },
		FOREARM:  { width: 20, height: 40 }
	};
	
	var combine = function(type, one, two) {
		var t = new type(one);
		t.setAttrs(two);
		return t;
	};
	
	var constructor = function() {
		var body = new Kinetic.Group({ x: x, y: y });
		
		var torso = combine(Kinetic.Rect, {fill:"blue", centerOffset: {x:SIZE.TORSO.width/2, y:SIZE.TORSO.height/2}}, SIZE.TORSO);
		body.add(torso);
		
		var leftArm = new Kinetic.Group({ x: -SIZE.TORSO.WIDTH/2, y: -SIZE.TORSO.HEIGHT/2});
		//var rightArm = new Kinetic.Group({ x: x, y: y });
		var upperLeftArm = combine(Kinetic.Rect, {fill:"red",centerOffset: {y:0,x:SIZE.UPPERARM.height}}, SIZE.UPPERARM);
		//var upperRightArm = combine(Kinetic.Rect, {fill:"blue"}, SIZE.UPPERARM);
		
		leftArm.add(upperLeftArm);
		//rightArm.add(upperRightArm);
		

		body.add(leftArm);
		//body.add(rightArm);
		
		
		
		return body;
	};
	
	
	
	return constructor();
};