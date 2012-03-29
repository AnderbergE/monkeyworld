/**
 * A fish.
 * @constructor
 * @param {EventManager}  ieventManager  The event manager
 * @param {number}        inumber        The number on the fish
 * @param {number}        ix             Starting x position
 * @param {number}        iy             Starting y position
 * @param {number}        ispecies       Species number
 */
function Fish(ieventManager, inumber, ix, iy, ispecies) {

	/** @type {EventManager} */ var eventManager = ieventManager;
	/** @type {number}       */ var number = inumber;
	/** @type {number}       */ var x = ix;
	/** @type {number}       */ var y = iy;
	/** @type {number}       */ var species = ispecies;

	/** @const @type{number} */ var MIN_SCALE = 0.7;
	/** @const @type{number} */ var MAX_SCALE = 1;
	/** @type {number}       */ var scale = (Math.random() *
                                    (MAX_SCALE - MIN_SCALE)) + MIN_SCALE;
	/** @type {number}       */ var id = uniqueId();
	/** @enum {number}       */ var Direction = { LEFT: -1, RIGHT: 1 };
	/** @type {number}       */ var y0 = iy;
	/** @type {number}       */ var offset = Math.random() * 2 * Math.PI;
	/** @type {number}       */ var direction = 1;
	/** @const @type{number} */ var MIN_X_SPEED = 0.030;
	/** @const @type{number} */ var MAX_X_SPEED = 0.040;
	/** @const @type{number} */ var MIN_Y_SPEED = 0.6;
	/** @const @type{number} */ var MAX_Y_SPEED = 0.5;
	/** @const @type {number}*/ var width = 128;
	/** @const @type {number}*/ var height = 128;
	/** @type {number}       */ var scaledWidth = scale * width;
	/** @type {number}       */ var scaledHeight = scale * height;
	/** @type {boolean}      */ var _canFree = true;

	this.toString = function() { return "Fish " + id; };
	
	/** @type {number}       */ var xSpeed = (Math.random() *
		                            (MAX_X_SPEED - MIN_X_SPEED)) + MIN_X_SPEED;
	/** @type {number}       */ var ySpeed = (Math.random() *
			                        (MAX_Y_SPEED - MIN_Y_SPEED)) + MIN_Y_SPEED;

	this.setX = function(ix) { x = ix; };
	this.setY = function(iy) { y = iy; };
	this.getX = function() { return x; };
	this.getY = function() { return y; };
	this.getNumber = function() { return number; };
	this.getWidth = function() { return width; };
	this.getHeight = function() { return height; };
	this.getScaledWidth = function() { return scaledWidth; };
	this.getScaledHeight = function() { return scaledHeight; };
	this.getScale = function() { return scale; };
	this.getSpecies = function() { return species; };
	this.getDirection = function() { return direction; };
	this.canFree = function() { return _canFree; };
	this.setCanFree = function(bool) { _canFree = bool; };
	this.getMouthPosition = function() {
		switch (species) {
		case 0: return { x: 50, y: 0 }; break;
		case 1: return { x: 50, y: 0 }; break;
		default: return { x: 0, y: 0 }; break;
		}
	};
	this.hooked = function() {
		eventManager.off("frame", this.toString());
	};
	
	this.onFrame = function(frame) {
		
	};
	
	var that = this;
	
	var onFrame = function(msg) {
		y = y0 + 15*Math.cos(ySpeed * (offset + msg.frame.time * 2 * Math.PI / 3000));
		if (direction == Direction.RIGHT)
			x += xSpeed * msg.frame.timeDiff;
		else
			x -= xSpeed * msg.frame.timeDiff;
		
		eventManager.tell("fishinggame.fishmoved", {fish:that});
	};
	
	eventManager.on("frame", onFrame, this.toString());

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
		eventManager.on("frame", onFrame, this.toString());
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

