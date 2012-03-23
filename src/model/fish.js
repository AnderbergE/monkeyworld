/**
 * A fish.
 * @constructor
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

	this.toString = function() { return "Fish " + id; };
	
	eventManager.registerListener(this);
	
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
	this.getMouthPosition = function() {
		switch (species) {
		case 0: return { x: 50, y: 0 }; break;
		case 1: return { x: 50, y: 0 }; break;
		default: return { x: 0, y: 0 }; break;
		}
	};
	this.hooked = function() {
		eventManager.unregisterListener(this);
	};
	
	this.onFrame = function(frame) {
		
	};
	
	this.notify = function(event) {
		
		if (event instanceof FrameEvent) {

			
			y = y0 + 15*Math.cos(ySpeed * (offset + event.frame.time * 2 * Math.PI / 3000));
			if (direction == Direction.RIGHT)
				x += xSpeed * event.frame.timeDiff;
			else
				x -= xSpeed * event.frame.timeDiff;
			
			eventManager.post(new FishMovedEvent(this));
		}
	};
	
	this.hitRightWall = function(newPos) {
		direction = Direction.LEFT;
		eventManager.post(new FishTurnedLeft(this));
		x = newPos - (x - newPos);
		eventManager.post(new FishMovedEvent(this));
	};
	
	this.hitLeftWall = function(newPos) {
		direction = Direction.RIGHT;
		eventManager.post(new FishTurnedRight(this));
		x = newPos + (newPos - x);
		eventManager.post(new FishMovedEvent(this));
	};
	
	this.clicked = function() {
		//console.log("clicked " + this.toString());
	};
	
	eventManager.post(new InitiatedFishEvent({fish:this, callback: this.clicked}));
}

