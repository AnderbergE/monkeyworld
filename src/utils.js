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
			if (obj[prop].timeLeft > 0) {
				obj[prop].timeLeft -= diff;
				node[prop] += obj[prop].step * diff;
				done = false;
			} else {
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
	      if (config.duration !== undefined && config.duration[prop] != undefined) {
	    	  obj.values[prop].duration = config.duration[prop];
		      obj.values[prop].useDuration = true;
	      } else {
	    	  obj.values[prop].duration = Math.abs(endState[prop] - node[prop]) / config.speed[prop];
	    	  obj.values[prop].speed = config.speed[prop];
		      obj.values[prop].useDuration = false;
	      }
	      obj.values[prop].step = (endState[prop] - node[prop]) / obj.values[prop].duration;
	      obj.values[prop].timeLeft = obj.values[prop].duration;
	}
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
		this.beingAnimated[i]._animator.callbackOnTick();
		var done = this._tick(timeDiff, this.beingAnimated[i]);
		if (done/*this.isDone(this.beingAnimated[i])*/) {
			var node = this.beingAnimated[i];
			this.beingAnimated.splice(i, 1);
			if (!node._animator.doneCallback) {
				node._animator.doneCallback = true;
				node._animator.callbackWhenDone();
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