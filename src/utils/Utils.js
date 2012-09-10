///**
// * @param {Function} childCtor
// * @param {Function} parentCtor
// */
//function inherit(childCtor, parentCtor) {
//	/** @constructor */
//	function tempCtor() {};
//	tempCtor.prototype = parentCtor.prototype;
//	childCtor.superClass_ = parentCtor.prototype;
//	childCtor.prototype = new tempCtor();
//	childCtor.prototype.constructor = childCtor;
//}


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

/** @constructor */
function _Log () {
	/**
	 * @param {string} type
	 * @param {string} msg
	 * @param {string} tag
	 * @param {Function} output
	 */
	function write(type, msg, tag, logger, output) {
		if (tag === undefined) {
			tag = "";
		} else if (typeof tag !== "string") {
			/*
			 * The Google Closure compiler sometimes turns the tag
			 * argument into something else when it should be
			 * undefined.
			 */
			tag = "";
		}
		if (tag != "evm" && tag != "sound") {
			tag = tag.substr(0,8);
			tag = tag.toUpperCase();
			var num = 8-tag.length;
			for (var i = 0; i < num; i++) {
				tag = " " + tag;
			}
			//tag += " ";
			output.call(logger, type + " " + tag + " " + msg);
		}
	};
	
	/**
	 * @param {string} msg
	 * @param {string} tag
	 */
	this.debug = function(msg, tag) {
		write("DEBUG  ", msg, tag, console, console.debug);
	};
	
	this.warning = function(msg, tag) {
		write("WARNING", msg, tag, console, console.warn);
	};
	
	this.notify = function(msg, tag) {
		write("NOTIFY ", msg, tag, console, console.info);
	};
	
	this.error = function(msg, tag) {
		write("ERROR  ", msg, tag, console, console.error);
	};
}

var Log = new _Log();

/**
 * @param {Object} item
 */
Array.prototype.remove = function(item) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === item) {
			this.splice(i);
		}
	}
};

var Utils = new (/** @constructor */function() {

	this.isNumber = function(n) {
		return ! isNaN (n-0);
	};

	/**
	 * @param {...Function} var_args
	 */
	this.chain = function (var_args) {
		var fnc_arguments = arguments;
		return function (input_args) {
			var i, queue = [], next = null, first = true;
			for (i = 0; i < fnc_arguments.length; i += 1) {
				queue.push(fnc_arguments[i]);
			}
			/**
			 * @param {...} args
			 */
			next = function (args) {
				if (first) {
					args = input_args;
					first = false;
				}
				var fnc = (queue.shift());
				if (fnc != undefined)
					fnc(next, args);
			};
			next();
		};
	};

	this.bezier = function(percent,C1,C2,C3,C4) {
		//====================================\\
		// 13thParallel.org Beziér Curve Code \\
		//   by Dan Pupius (www.pupius.net)   \\
		//====================================\\
		
		// Modified by <bjorn.norrliden@gmail.com> to compilable JavaScript. 

		/**
		 * @constructor
		 * @param {number=} x
		 * @param {number=} y
		 */
		function coord(x,y) {
		  if(x === undefined) x=0;
		  if(y === undefined) y=0;
		  return {x: x, y: y};
		}

		function B1(t) { return t*t*t; }
		function B2(t) { return 3*t*t*(1-t); }
		function B3(t) { return 3*t*(1-t)*(1-t); }
		function B4(t) { return (1-t)*(1-t)*(1-t); }

		function getBezier(percent,C1,C2,C3,C4) {
		  var pos = new coord();
		  pos.x = C1.x*B1(percent) + C2.x*B2(percent) + C3.x*B3(percent) + C4.x*B4(percent);
		  pos.y = C1.y*B1(percent) + C2.y*B2(percent) + C3.y*B3(percent) + C4.y*B4(percent);
		  return pos;
		}
		return getBezier(percent,C1,C2,C3,C4);
	};
	
	this.scaleShape = function(shape, scale) {
		if (shape.x != undefined) shape.x *= scale;
		if (shape.y != undefined) shape.y *= scale;
		if (shape.width != undefined) shape.width *= scale;
		if (shape.height != undefined) shape.height *= scale;
		if (shape.fontSize != undefined) shape.fontSize *= scale;
		if (shape.scale != undefined) {
			if (shape.scale.x != undefined) shape.scale.x *= scale;
			if (shape.scale.y != undefined) shape.scale.y *= scale;
		}
		return shape;
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
