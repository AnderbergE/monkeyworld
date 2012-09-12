/** @constructor */
function Class() {};
/**
 * @param {Object} obj
 */
Class.extend = function (obj) {};

/** @param {...} args */
Class.prototype.init = function (args) {};

/** @param {...} args */
Class.prototype._super = function (args) {};

/*============================================================================*/
/**
 * @constructor
 */
function soundManager() {};
soundManager.prototype.play = function() {};

/**
 * @param {Function} func
 */
soundManager.onready = function(func) {};

/**
 * @param {Object} obj
 * @returns {SoundObject}
 */
soundManager.createSound = function(obj) {};

/**
 * @constructor
 */
function SoundObject() {};
SoundObject.prototype.play = function() {};
SoundObject.prototype.stop = function() {};
SoundObject.prototype.onload = function() {};
SoundObject.prototype.id = function() {};
SoundObject.prototype.url = function() {};
SoundObject.prototype.autoLoad = function() {};
SoundObject.prototype.autoPlay = function() {};


function console() {};
/**
 * @param {*} obj1
 * @param {...} objs
 */
console.log = function (obj1, objs) {};

/**
 * @param {*} obj1
 * @param {...} objs
 */
console.warn = function (obj1, objs) {};

/**
 * @param {*} obj1
 * @param {...} objs
 */
console.debug = function (obj1, objs) {};

/**
 * @param {*} obj1
 * @param {...} objs
 */
console.error = function (obj1, objs) {};

/**
 * @param {*} obj1
 * @param {...} objs
 */
console.info = function (obj1, objs) {};

/*============================================================================*/

/**
 * @constructor
 * @param {boolean=} bool
 */
function PreloadJS(bool) {};
PreloadJS.prototype.onComplete = function() {};
/**
 * @param {Function} plugin
 */
PreloadJS.prototype.installPlugin = function(plugin) {};
PreloadJS.prototype.progress = function() {};
/**
 * @param {Array} soundSources
 */
PreloadJS.prototype.loadManifest = function(soundSources) {};


/*============================================================================*/
function SoundJS() {};

/**
 * @param {Array} list
 */
SoundJS.addBatch = function(list) {};
/**
 * @param {string=} name
 * @param {string=} instance
 */
SoundJS.stop = function(name, instance) {};
/**
 * @param {string=} name
 * @param {Number=} interrupt
 * @param {Number=} volume
 * @param {boolean=} loop
 * @param {Number=} delay
 */
SoundJS.play = function(name ,interrupt ,volume ,loop ,delay ) {};
SoundJS.onLoadQueueComplete = function() {};

/*============================================================================*/
/**
 * @constructor
 * @static
 */
function Ease() {};


Ease.sineIn = function(){};

/**
 * @constructor
 */
function Tween() {};

/**
 * @static
 * @param {Object} target
 * @param {Object=} props
 * @return {Tween}
 */
Tween.get = function(target, props) {};

/**
 * Removes all existing tweens for a target. This is called automatically by new tweens if the "override" prop is true.
 * @param {Object} target
 */
Tween.removeTweens = function(target) {};

/**
 * Advances all tweens. This typically uses the Ticker class (when available), but you can call it manually if you prefer to use your own "heartbeat" implementation.
 * @static
 * @param {number} delta The change in time in milliseconds since the last tick. Required unless all tweens have useTicks set to true.
 * @param {boolean} paused Indicates whether a global pause is in effect. Tweens with ignoreGlobalPause will ignore this, but all others will pause if this is true.
 */
Tween.tick = function(delta, paused) {};

/** 
 * Queues a tween from the current values to the target properties. Set duration to 0 to jump to these value.
 * Numeric properties will be tweened from their current value in the tween to the target value. Non-numeric
 * properties will be set at the end of the specified duration.
 * @param {Object} props An object specifying property target values for this tween (Ex. {x:300} would tween the x property of the target to 300).
 * @param {number=} duration The duration of the wait in milliseconds (or in ticks if useTicks is true).
 * @param {Ease=} ease The easing function to use for this tween.
 * @return {Tween} This tween instance (for chaining calls).
 **/
Tween.prototype.to = function(props, duration, ease) {};

/**
 * Queues a wait (essentially an empty tween).
 * @param {number} duration The duration of the wait in milliseconds (or in ticks if useTicks is true).
 */
Tween.prototype.wait = function(duration) {};

/**
 * Queues an action to call the specified function. For example: myTween.wait(1000).call(myFunction); would call myFunction() after 1s.
 * @param {Function} callback The function to call.
 * @param {*=} params The parameters to call the function with. If this is omitted, then the function will be called with a single param pointing to this tween.
 * @param {Object=} scope The scope to call the function in. If omitted, it will be called in the target's scope.
 */
Tween.prototype.call = function(callback, params, scope) {};

/*============================================================================*/

/**
 * @constructor
 */
function JSON() {};

/**
 * @param {string} str
 * @return {Object}
 */
JSON.parse = function(str) {};

/**
 * @param {Object} obj
 * @return {string}
 */
JSON.stringify = function(obj) {};

/**
 * @param {string} arg1
 * @param {string=} arg2
 */
$.cookie = function(arg1, arg2) {};

/**
 * @type {Object.<Object>}
 */
var WebFontConfig = {};
WebFontConfig.google = function() {};
WebFontConfig.google.families = function() {};
