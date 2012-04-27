/**
 * A fish.
 * @constructor
 * @param {EventManager}  ieventManager  The event manager
 * @param {number}        id             Unique ID of the fish
 * @param {number}        inumber        The number on the fish
 * @param {number}        ix             Starting x position
 * @param {number}        iy             Starting y position
 * @param {number}        ispecies       Species number
 */
function Fish(ieventManager, id, inumber, ix, iy, ispecies) {

	/** @type {EventManager} */ var eventManager = ieventManager;
	/** @type {number}       */ var targetNumber = inumber;
	/** @type {number}       */ var x = ix;
	/** @type {number}       */ var y = iy;
	/** @type {number}       */ var species = ispecies;

	/** @const @type{number} */ var MIN_SCALE = 0.7;
	/** @const @type{number} */ var MAX_SCALE = 1;
	/** @type {number}       */ var scale = (Math.random() *
                                    (MAX_SCALE - MIN_SCALE)) + MIN_SCALE;
	/** @type {number}       */ var _id = id;
	/** @enum {number}       */ var Direction = { LEFT: -1, RIGHT: 1 };
	/** @type {number}       */ var y0 = iy;
	/** @type {number}       */ var offset = Math.random() * 2 * Math.PI;
	/** @type {number}       */ var direction = 1;
	/** @const @type{number} */ var MIN_X_SPEED = 0.00006;
	/** @const @type{number} */ var MAX_X_SPEED = 0.00008;
	/** @const @type{number} */ var MIN_Y_SPEED = 0.6;
	/** @const @type{number} */ var MAX_Y_SPEED = 0.5;
	/** @const @type {number}*/ var width = 0.256*1.2;
	/** @const @type {number}*/ var height = 0.2133;
	/** @type {number}       */ var scaledWidth = scale * width;
	/** @type {number}       */ var scaledHeight = scale * height;
	/** @type {boolean}      */ var _canFree = true;

	this.toString = function() { return "Fish " + _id; };
	
	/** @type {number}       */ var xSpeed = (Math.random() *
		                            (MAX_X_SPEED - MIN_X_SPEED)) + MIN_X_SPEED;
	/** @type {number}       */ var ySpeed = (Math.random() *
			                        (MAX_Y_SPEED - MIN_Y_SPEED)) + MIN_Y_SPEED;

	this.setX = function(ix) { x = ix; };
	this.setY = function(iy) { y = iy; };
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getTargetNumber = function() { return targetNumber; };
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	this.getScaledWidth = function() { return scaledWidth; };
	this.getScaledHeight = function() { return scaledHeight; };
	this.getScale = function() { return scale; };
	this.getSpecies = function() { return species; };
	this.getDirection = function() { return direction; };
	var hooked = false;
	this.canFree = function() { return _canFree; };
	this.setCanFree = function(bool) { _canFree = bool; };
	this.getMouthPosition = function() {
		switch (species) {
		case 0: return { x: 0.1, y: 0 }; break;
		case 1: return { x: 0.1, y: 0 }; break;
		case 2: return { x: 0.1, y: 0 }; break;
		case 3: return { x: 0.1, y: 0 }; break; // blue
		case 4: return { x: 0.06, y: 0.07 }; break; // green
		case 5: return { x: 0.06, y: 0.07 }; break; // red
		case 6: return { x: 0.1, y: 0 }; break; // yellow
		default: return { x: 0, y: 0 }; break;
		}
	};
	this.hooked = function() {
		hooked = true;
	};
	
	var that = this;
	
	this.onFrame = function(frame) {
		if (!hooked) {
			y = y0 + 0.03 * Math.cos(ySpeed * (offset + frame.time * 2 * Math.PI / 3000));
			if (direction == Direction.RIGHT)
				x += xSpeed * frame.timeDiff;
			else
				x -= xSpeed * frame.timeDiff;
			
			eventManager.tell("fishinggame.fishmoved", {fish:that});
		}
	};
	
	this.hitRightWall = function(newPos) {
		direction = Direction.LEFT;
		eventManager.tell("fishinggame.fishturnedleft", {fish:this});
		x = newPos - (x - newPos);
		var that = this;
		eventManager.tell("fishinggame.fishmoved", {fish:that});
	};
	
	this.hitLeftWall = function(newPos) {
		direction = Direction.RIGHT;
		eventManager.tell("fishinggame.fishturnedright", {fish:this});
		x = newPos + (newPos - x);
		eventManager.tell("fishinggame.fishmoved", {fish:this});
	};
	
	var captured = false;
	this.isCaptured = function() {
		return captured;
	};
	
	this.capture = function() { captured = true; };
	this.free = function() {
		captured = false;
		hooked = false;
	};
	
	var clickable = null;
	this.isClickable = function() { return clickable; };
	/** @param {boolean} status */
	this.setClickable = function(status) {
		if (clickable != status) {
			clickable = status;
			if (clickable) {
				eventManager.tell("fishinggame.turnOnClick", {fish:this});	
			} else {
				eventManager.tell("fishinggame.turnOffClick", {fish:this});
			}
		}
		
	};

	eventManager.tell("fishinggame.initiatedfish", {fish:this});
}

