var _uid = 0;
function uniqueId() {
	return _uid++;
}

Object.size = function(obj) {
    var size = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var Log = new(/** @constructor */ function() {
	
	function write(type, msg, tag) {
		if (tag === undefined) {
			tag = "";
		}
		tag = tag.substr(0,8);
		tag = tag.toUpperCase();
		var num = 8-tag.length;
		for (var i = 0; i < num; i++) {
			tag = " " + tag;
		}
		//tag += " ";
		console.log(/*type + " " + */tag + " " + msg);
	};
	
	this.debug = function(msg, tag) {
		write("DEBUG  ", msg, tag);
	};
	
	this.warning = function(msg, tag) {
		write("WARNING", msg, tag);
	};
	
	this.notify = function(msg, tag) {
		write("NOTIFY ", msg, tag);
	};
	
});

var Utils = new (/** @constructor */function() {
	
	this.isNumber = function(n) {
		return ! isNaN (n-0);
	};

	/**
	 * @param {number} min
	 * @param {number} max
	 * @return {number} A random number in the interval [min, max].
	 */
	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
	/**
	 * @param {Array} array
	 * @param {*} obj
	 * @return true if obj is in array, othwerwise false
	 */
	this.inArray = function(array, obj) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === obj)
				return true;
		}
		return false;
	};
	
	/**
	 * @constructor
	 */
	var Gridizer = function(startx, starty, stepx, stepy, width) {
		var gridXPos = 0;
		var gridYPos = 0;
		this.next = function() {
			var xp = startx + gridXPos * stepx;
			var yp = starty + gridYPos * stepy;
			gridXPos = (gridXPos + 1) % width;
			if (gridXPos == 0) {
				gridYPos++;
			}
			return { x: xp, y: yp };
		};
	};
	
	this.gridizer = function(startx, starty, stepx, stepy, width) {
		
		return new Gridizer(startx, starty, stepx, stepy, width);
	};
	
	/**
	 * Produces an array of given <code>size</code>, where the values are
	 * randomized in the interval [<code>start</code>, <code>end</code>].
	 * It is guaranteed that <code>injected</code> will appear in the
	 * returned array exactly <code>appearances</code> number of times.
	 * 
	 * @param  {number}   start       - start of interval
	 * @param  {number}   end         - end of interval
	 * @param  {number}   size        - size of returned array
	 * @param  {number}   injected    - injected number
	 * @param  {number}   appearances - number of times <code>injected</code>
	 *                                  will appear.
	 * @param  {boolean=} exactly     - if set, the injected number may not
	 *                                  appear at the non-crooked positions.
	 *                                  Default is false.
	 *                                 
	 * @return {Array}    An array of size <code>size</code>, with randomized
	 *                    values in the interval [<code>start</code>,
	 *                    <code>end</code>] and in which <code>injected</code>
	 *                    will appear exactly <code>appearances</code> number
	 *                    of times.
	 */
	this.crookedRandoms = function(start, end, size, injected, appearances, exactly) {
		if (arguments.length == 5)
			exactly = false;
		var array = new Array(size);
		var crookedPositions = new Array(appearances);
		var alreadyTaken = new Array();
		for (var i = 0; i < appearances; i++) {
			var crookedPosition = this.getRandomInt(0, size - 1);
			while (this.inArray(crookedPositions, crookedPosition)) {
				crookedPosition = this.getRandomInt(0, size - 1);
			}
			crookedPositions.push(crookedPosition);
		}
		for (var i = 0; i < size; i++) {
			if (this.inArray(crookedPositions, i)) {
				array[i] = injected;
			} else {
				array[i] = this.getRandomInt(start, end);
				if (exactly) {
					while (array[i] == injected)
						array[i] = this.getRandomInt(start, end);
				}
			}
		}
		return array;
	};
});

/**
 * Handles simple animations.
 * @author <bjorn.norrliden@gmail.com>
 * @constructor
 */
function Animator() {
	
	/**
	 * Holds the nodes currently being animated.
	 * 
	 * @type {Array.<Kinetic.Node|Object>}
	 * @private
	 */
	this.beingAnimated = new Array();
	
	/**
	 * Increases the values of the node.
	 * 
	 * @param {Number} diff
	 * @param {Kinetic.Node|Object} node
	 * @private
	 */
	this._tick = function(diff, node) {
		var obj = node._animator.values;
		var done = true;
		for (var prop in obj) {
			/*if (obj[prop]._ticks === undefined)
				obj[prop]._ticks = 0;
			else
				obj[prop]._ticks++;*/
			if (obj[prop].timeLeft > 0) {
				obj[prop].timeLeft -= diff;
				node[prop] += obj[prop].step * diff;
				done = false;
			} else {
				/*if (obj[prop]._told === undefined) {
					obj[prop]._told = true;
					//console.log("Mean ticks: " + obj[prop]._ticks / obj[prop].duration);
					console.log("Duration: " + obj[prop].duration + ", Step: " + obj[prop].step);
				}*/
				node[prop] = obj[prop].to;
			}
		}
		return done;
	};
	
	/**
	 * Checks if the animation of a node should stop.
	 * 
	 * @param {Kinetic.Node|Object} node
	 * @private
	 */
	this.isDone = function(node) {
		var obj = node._animator.values;
		var sum = 0;
		for (var prop in obj) {
			sum += Math.pow(node[prop] - obj[prop].to, 2);
		}
		var dist = Math.sqrt(sum);
		/*
		 * If the distance has increased, then we missed the snapping point. But
		 * since we know that this happened, we just snap it anyway. This can
		 * happen if the node moves too fast or if the browser window is
		 * unfocused.
		 */
		if (dist <= 0.5 || dist > node._animator.lastDistance) {
			for (var prop in obj) {
				node[prop] = obj[prop].to;
			}
			return true;
		} else {
			node._animator.lastDistance = dist;
			return false;
		}
	};
};

/**
 * Register a node to be animated.
 * 
 * Configuration:
 *    duration | speed : the duration or speed
 *    onFrame          : callback on each frame
 *    onFinish         : callback when animation is done
 * 
 * @param {Kinetic.Node|Object} node
 * @param {Object} endState
 * @param {Object} configuration.
 */
Animator.prototype.animateTo = function(node, endState, config) {
	node._animator = {};
	var obj = node._animator;
	obj.values = {};
	for (var prop in endState) {
	      obj.values[prop] = {};
	      obj.values[prop].to = endState[prop];
	      if (config.duration != undefined) {
	    	  var dur = config.duration;
	    	  if (!Utils.isNumber(config.duration)) {
	    		  if (config.duration[prop] === undefined)
	    			  alert('Not defined duration for ' + prop);
	    		  dur = config.duration[prop];
	    	  }
	    	  obj.values[prop].duration = dur;
		      obj.values[prop].useDuration = true;
	      } else {
	    	  obj.values[prop].duration = Math.abs(endState[prop] - node[prop]) / config.speed[prop];
	    	  obj.values[prop].speed = config.speed[prop];
		      obj.values[prop].useDuration = false;
	      }
	      obj.values[prop].step = (endState[prop] - node[prop]) / obj.values[prop].duration;
	      obj.values[prop].timeLeft = obj.values[prop].duration;
	}
	obj.doCallbackOnTick = config.onFrame != undefined;
	obj.doCallbackWhenDone = config.onFinish != undefined;
	obj.callbackOnTick = config.onFrame;
	obj.callbackWhenDone = config.onFinish;
	obj.lastDistance = Number.MAX_VALUE;
	obj.doneCallback = false;
	this.beingAnimated.push(node);
};

/**
 * Move all nodes currently under the Animator's control. To do this, the
 * time difference since the last frame is needed. This function must be called
 * on every frame to produce an animation.
 * 
 * @param {Number} timeDiff
 */
Animator.prototype.tick = function(timeDiff) {
	for (var i = 0; i < this.beingAnimated.length; i++) {
		if (this.beingAnimated[i]._animator.doCallbackOnTick) {
			this.beingAnimated[i]._animator.callbackOnTick();
		}
		var done = this._tick(timeDiff, this.beingAnimated[i]);
		if (done/*this.isDone(this.beingAnimated[i])*/) {
			var node = this.beingAnimated[i];
			this.beingAnimated.splice(i, 1);
			if (!node._animator.doneCallback) {
				node._animator.doneCallback = true;
				if (node._animator.doCallbackWhenDone) {
					node._animator.callbackWhenDone();
				}
			}
		}
	}
};

/**
 * Change the end state of a node. This makes it possible to animate towards a
 * moving target.
 * 
 * @param {Kinetic.Node|Object} node
 * @param {Object} endState
 */
Animator.prototype.updateEndState = function(node, endState) {
	var obj = node._animator;
	for (var prop in endState) {
	      obj.values[prop].to = endState[prop];
	      if (obj.values[prop].useDuration) {
	    	  obj.values[prop].step = (endState[prop] - node[prop]) / obj.values[prop].timeLeft;
	      } else {
	    	  obj.values[prop].duration = Math.abs(endState[prop] - node[prop]) / obj.values[prop].speed;
		      obj.values[prop].step = (endState[prop] - node[prop]) / obj.values[prop].duration;
		      obj.values[prop].timeLeft = obj.values[prop].duration;
	      }
	}
};