/*----------------------------------------------------------------------------*/
/*  Namespace Kinetic
/*----------------------------------------------------------------------------*/

/**
 * @constructor
 */
function Kinetic() {};



function KineticFrame() {};
KineticFrame.time = function(){};
/**
 * @param {*} frame
 */
function KineticFrameConfig(frame) {};
KineticFrame.timeDiff = function() {};

/**
 * Stage
 * v3.8.2
 * Instantiates a new Stage object. Parameter container can be a DOM id or a
 * DOM element.
 * @constructor
 * @extends {Kinetic.Node}
 * @param {Object} config
 */
Kinetic.Stage = function(config){};

/**
* @param {*} frameconfig
*/
Kinetic.Stage.prototype.onFrame = function(frameconfig){};
Kinetic.Stage.prototype.start = function(){};
Kinetic.Stage.prototype.throttle = function(){};
/**
 * @param {Kinetic.Layer} layer
 */
Kinetic.Stage.prototype.remove = function(layer) {};

/**
 * Container
 * v3.8.2
 * @constructor
 * @extends {Kinetic.Node}
 * It actually does not extend Node, this is a lazy solution to the multiple
 * inheritance (some objects extends both Node and Container).
 */
Kinetic.Container = function() {};
	Kinetic.Container.prototype.getChildren = function() {};
	/**
	 * @param {string} name
	 */
	Kinetic.Container.prototype.getChild = function(name) {};
	/**
	 * @param {Kinetic.Node} node
	 */
	Kinetic.Container.prototype.add = function(node) {};
	/**
	 * @param {Kinetic.Node} node
	 */
	Kinetic.Container.prototype.remove = function(node) {};
	Kinetic.Container.prototype.removeChildren = function() {};
	
	/** @return {number} */
	Kinetic.Container.prototype.getY = function() {};
	/** @return {number} */
	Kinetic.Container.prototype.getX = function() {};

	/**
	 * Node
	 * v3.8.2
	 * @constructor
	 */
	Kinetic.Node = function(){};
		/**
		 * @param {string} eventTypeString
		 * @param {function(Object)} handler
		 */
		Kinetic.Node.prototype.on = function(eventTypeString, handler) {};
		Kinetic.Node.prototype.off = function( eventTypeString ) {};
		Kinetic.Node.prototype.show = function() {};
		Kinetic.Node.prototype.hide = function() {};
		Kinetic.Node.prototype.getZIndex = function() {};
		Kinetic.Node.prototype.setOpacity = function( opacity ) {};
		Kinetic.Node.prototype.getOpacity= function() {};
		/**
		 * @param {number} scale
		 * @param {number=} scaleY
		 */
		Kinetic.Node.prototype.setScale = function(scale, scaleY) {};
		Kinetic.Node.prototype.getScale = function() {};
		Kinetic.Node.prototype.attrs = function() {};
		Kinetic.Node.prototype.attrs.scale = function() {};
		Kinetic.Node.prototype.attrs.offset = function() {};
		Kinetic.Node.prototype.attrs.points = function() {};
		Kinetic.Node.prototype.setPosition = function( x, y ) {};
		Kinetic.Node.prototype.getPosition = function() {};
		Kinetic.Node.prototype.getAbsolutePosition = function() {};
		Kinetic.Node.prototype.move = function( x, y ) {};
		Kinetic.Node.prototype.setRotation = function( theta ) {};
		Kinetic.Node.prototype.setRotationDeg = function( theta ) {};
		Kinetic.Node.prototype.setOffset = function(x,y) {};
		Kinetic.Node.prototype.getOffset = function() {};
		Kinetic.Node.prototype.offset = function() {};
		Kinetic.Node.prototype.getRotation = function() {};
		Kinetic.Node.prototype.getRotationDeg = function() {};
		Kinetic.Node.prototype.rotate = function( theta ) {};
		Kinetic.Node.prototype.rotateDeg = function( theta ) {};
		Kinetic.Node.prototype.listen = function( bool ) {};
		Kinetic.Node.prototype.moveToTop = function() {};
		Kinetic.Node.prototype.moveToBottom = function() {};
		Kinetic.Node.prototype.moveUp = function() {};
		Kinetic.Node.prototype.moveDown = function() {};
		Kinetic.Node.prototype.setZIndex = function( zIndex ) {};
		/**
		 * @param {Object} shadowObject
		 */
		Kinetic.Node.prototype.setShadow = function(shadowObject) {};
		Kinetic.Node.prototype.draggable = function( bool ) {};
		Kinetic.Node.prototype.draggableX = function( bool ) {};
		Kinetic.Node.prototype.draggableY = function( bool ) {};
		Kinetic.Node.prototype.isDragging = function() {};
		Kinetic.Node.prototype.moveTo = function( container ) {};
		Kinetic.Node.prototype.getParent = function() {};
		Kinetic.Node.prototype.getLayer = function() {};
		Kinetic.Node.prototype.getStage = function() {};
		/** @param {Object} config */
		Kinetic.Node.prototype.setAttrs = function(config) {};
		/** @return {Object} */
		Kinetic.Node.prototype.gettAttrs = function() {};
		Kinetic.Node.prototype.getName = function() {};
		/** @param {number} x */
		Kinetic.Node.prototype.setX = function(x) {};
		/** @param {number} y */
		Kinetic.Node.prototype.setY = function(y) {};
		/** @return {number} */
		Kinetic.Node.prototype.getY = function() {};
		/** @return {number} */
		Kinetic.Node.prototype.getX = function() {};
		Kinetic.Node.prototype.callback = function() {};
		Kinetic.Node.prototype.duration = function() {};
		Kinetic.Node.prototype.easing = function() {};
		/**
		 * @param {Object} config
		 */
		Kinetic.Node.prototype.transitionTo = function(config) {};
	

Kinetic.Stage.prototype.width = function() {};
Kinetic.Stage.prototype.height = function() {};
Kinetic.Stage.prototype.container = function() {};
	Kinetic.Stage.prototype.onFrame = function( handler ) {};
	Kinetic.Stage.prototype.start = function() {};
	Kinetic.Stage.prototype.stop = function() {};
	Kinetic.Stage.prototype.draw = function() {};
	Kinetic.Stage.prototype.clear = function() {};
	Kinetic.Stage.prototype.on = function( eventTypeString, handler ) {};
	/**
	 * @param {Kinetic.Layer} layer
	 */
	Kinetic.Stage.prototype.add = function(layer) {};
	Kinetic.Stage.prototype.setSize = function( width, height ) {};
	/**
	 * @param {number} scale
	 * @param {number=} scaleY
	 */
	Kinetic.Stage.prototype.setScale = function( scale, scaleY ) {};
	Kinetic.Stage.prototype.getScale = function() {};
	Kinetic.Stage.prototype.toDataURL = function( callback ) {};
	Kinetic.Stage.prototype.getMousePosition = function() {};
	Kinetic.Stage.prototype.getTouchPosition = function() {};
	Kinetic.Stage.prototype.getUserPosition = function() {};
	Kinetic.Stage.prototype.getContainer = function() {};
	Kinetic.Stage.prototype.getWidth = function() {};
	Kinetic.Stage.prototype.getHeight = function() {};

/**
 * Layer
 * v3.8.2
 * @constructor
 * @param {(string|Object)=} config
 * @extends {Kinetic.Container}
 */
Kinetic.Layer = function(config){};
	Kinetic.Layer.prototype.draw = function(){};
	Kinetic.Layer.prototype.clear = function(){};
	Kinetic.Layer.prototype.getCanvas = function() {};
	Kinetic.Layer.prototype.getContext = function() {};
	
	Kinetic.Layer.prototype.getChildren = function() {};
	/**
	 * @param {string} name
	 */
	Kinetic.Layer.prototype.getChild = function(name) {};
	/**
	 * @param {Kinetic.Node} node
	 */
	Kinetic.Layer.prototype.add = function(node) {};
	/**
	 * @param {Kinetic.Node} node
	 */
	Kinetic.Layer.prototype.remove = function(node) {};
	Kinetic.Layer.prototype.removeChildren = function() {};

/**
 * Group
 * v3.8.2
 * @constructor
 * @extends {Kinetic.Container}
 * @param {Object=} config
 */
Kinetic.Group = function(config){};
	Kinetic.Group.prototype.getChildren = function() {};
	/**
	 * @param {string} name
	 */
	Kinetic.Group.prototype.getChild = function(name) {};
	/**
	 * @param {Kinetic.Node} node
	 */
	Kinetic.Group.prototype.add = function(node) {};
	/**
	 * @param {Kinetic.Node} node
	 */
	Kinetic.Group.prototype.remove = function(node) {};
	Kinetic.Group.prototype.removeChildren = function() {};

/**
 * Shape
 * v3.8.2
 * @constructor
 * @param {Object=} config
 * @extends {Kinetic.Node}
 */
Kinetic.Shape = function(config){};
	Kinetic.Shape.prototype.fillStroke = function() {};
	Kinetic.Shape.prototype.getContext = function() {};
	Kinetic.Shape.prototype.getCanvas = function() {};

	Kinetic.Shape.prototype.getWidth = function() {};
	Kinetic.Shape.prototype.getHeight = function() {};
	
	/**
	 * @param {String|Object} fill
	 */
	Kinetic.Shape.prototype.setFill = function(fill) {};
	Kinetic.Shape.prototype.getFill = function() {};
	/**
	 * set stroke color
	 * @param {String} stroke
	 */
	Kinetic.Shape.prototype.setStroke = function(stroke) {};
	Kinetic.Shape.prototype.getStroke = function() {};
	/**
	 * set stroke width
	 * @param {Number} strokeWidth
	 */
	Kinetic.Shape.prototype.setStrokeWidth = function(strokeWidth) {};
	Kinetic.Shape.prototype.getStrokeWidth = function() {};
	Kinetic.Shape.prototype.fillStroke = function() {};
	
	Kinetic.Shape.prototype.transitionTo = function(state) {};
	
	Kinetic.Shape.prototype.fill = function(){};
	Kinetic.Shape.prototype.fill.colorStops = function() {};

	Kinetic.Shape.prototype.stroke = function(){};
	/**
	 * 
	 * @param text
	 * @param {number} x
	 * @param {number} y
	 */
	Kinetic.Shape.prototype.fillText = function(text, x, y){};
	/**
	 * 
	 * @param text
	 * @param {number} x
	 * @param {number} y
	 */
	Kinetic.Shape.prototype.strokeText = function(text, x, y){};
	Kinetic.Shape.prototype.drawImage = function(){};
	
	/** @return {boolean} */
	Kinetic.Shape.prototype.intersects = function(){};
	
	Kinetic.Shape.prototype.drawFunc = function(){};
	Kinetic.Shape.prototype.drawFunc.fill = function(){};
	Kinetic.Shape.prototype.drawFunc.stroke = function(){};
	/**
	 * 
	 * @param text
	 * @param {number} x
	 * @param {number} y
	 */
	Kinetic.Shape.prototype.drawFunc.fillText = function(text, x, y){};
	/**
	 * 
	 * @param text
	 * @param {number} x
	 * @param {number} y
	 */
	Kinetic.Shape.prototype.drawFunc.strokeText = function(text, x, y){};
	Kinetic.Shape.prototype.drawFunc.drawImage = function(){};

/**
 * @constructor
 * @extends {Kinetic.Shape}
 */
Kinetic.Rect = function(obj){};
Kinetic.Rect.prototype.cornerRadius = function() {};
Kinetic.Rect.prototype.setWidth = function(w) {};
Kinetic.Rect.prototype.setHeight = function(h) {};

/**
 * @constructor
 * @extends {Kinetic.Shape}
 * @param {Object=} config
 */
Kinetic.Polygon = function(config){};

/**
 * @constructor
 * @extends {Kinetic.Shape}
 * @param {Object=} obj
 */
Kinetic.Circle = function(obj){};
Kinetic.Circle.prototype.radius = function() {};
Kinetic.Circle.prototype.fill = function() {};
Kinetic.Circle.prototype.stroke = function() {};
Kinetic.Circle.prototype.strokeWidth = function() {};
Kinetic.Circle.prototype.setRadius = function(radius) {};
Kinetic.Circle.prototype.getRadius = function() {};

/**
 * @constructor
 * @extends {Kinetic.Shape}
 * @param {Object=} config
 */
Kinetic.Line = function(config){};
/** @return {Array} */
Kinetic.Line.prototype.getDashArray = function(){};
/** @return {String} */
Kinetic.Line.prototype.getLineCap = function(){};
/** @return {Array} */
Kinetic.Line.prototype.getPoints = function(){};
/** @param {Array} dashArray */
Kinetic.Line.prototype.setDashArray = function(dashArray){};
/** @param {String} lineCap */
Kinetic.Line.prototype.setLineCap = function(lineCap){};
/** @param {Array} can */
Kinetic.Line.prototype.setPoints = function(can){};
Kinetic.Line.prototype.points = function() {};
Kinetic.Line.prototype.lineCap = function() {};
Kinetic.Line.prototype.dashArray = function() {};
Kinetic.Line.prototype.fill = function() {};
Kinetic.Line.prototype.stroke = function() {};
Kinetic.Line.prototype.strokeWidth = function() {};
Kinetic.Line.prototype.lineJoin = function() {};
Kinetic.Line.prototype.shadow = function() {};
Kinetic.Line.prototype.detectonType = function() {};
Kinetic.Line.prototype.x = function() {};
Kinetic.Line.prototype.y = function() {};
Kinetic.Line.prototype.visible = function() {};
Kinetic.Line.prototype.listening = function() {};
Kinetic.Line.prototype.id = function() {};
Kinetic.Line.prototype.name = function() {};
Kinetic.Line.prototype.opacity = function() {};
Kinetic.Line.prototype.scale = function() {};
Kinetic.Line.prototype.rotation = function() {};
Kinetic.Line.prototype.rotationDeg = function() {};
Kinetic.Line.prototype.offset = function() {};
Kinetic.Line.prototype.draggable = function() {};
Kinetic.Line.prototype.dragConstraint = function() {};
Kinetic.Line.prototype.dragBounds = function() {};




/*----------------------------------------------------------------------------*/
/*  Class Kinetic.Animation
/*----------------------------------------------------------------------------*/

/**
 * @constructor
 * @param {Object} config
 * @param {Function} config.func function to be executed on each animation frame
 * @param {Kinetic.Node} config.node
 * @extends {Kinetic.Container}
 */
Kinetic.Animation = function (config) {};
Kinetic.Animation.prototype.func = function () {};
Kinetic.Animation.prototype.node = function () {};

/**
 * start animation
 */
Kinetic.Animation.prototype.start = function () {};

/**
 * stop animation
 */
Kinetic.Animation.prototype.stop = function () {};



/**
 * Text
 * @constructor
 * @extends {Kinetic.Shape}
 */
Kinetic.Text = function(config){};
/** @type {number} */ Kinetic.Text.prototype.x;
/** @type {number} */ Kinetic.Text.prototype.y;
/**
 * @param {string} text
 */
Kinetic.Text.prototype.setText = function(text){};
/**
 * @param {string} align
 */
Kinetic.Text.prototype.setAlign = function(align){};
Kinetic.Text.prototype.text = function(){};
Kinetic.Text.prototype.fontSize = function(){};
Kinetic.Text.prototype.fontFamily = function(){};
Kinetic.Text.prototype.textFill = function(){};
Kinetic.Text.prototype.align = function(){};
Kinetic.Text.prototype.verticalAlign = function(){};
Kinetic.Text.prototype.textStroke = function(){};
Kinetic.Text.prototype.textStrokeWidth = function(){};
Kinetic.Text.prototype.strokeWidth = function(){};

/**
 * @constructor
 * @param {Object=} config
 * @extends {Kinetic.Shape}
 */
Kinetic.Image = function(config){};
/** @param {Image} image **/
Kinetic.Image.prototype.setImage = function (image) {};
/** @param {number} width **/
Kinetic.Image.prototype.setWidth = function (width) {};
/** @param {number} height **/
Kinetic.Image.prototype.setHeight = function (height) {};

/*============================================================================*/
/**
 * @constructor
 */
function Context(){};
Context.prototype.beginPath = function(){};
Context.prototype.moveTo = function(x,y){};
Context.prototype.lineTo = function(x,y){};
Context.prototype.quadraticCurveTo = function(a,b,c,d){};
Context.prototype.closePath = function(){};
Context.prototype.font = function(){};
Context.prototype.fillStyle = function(){};
Context.prototype.strokeWidth = function(){};
Context.prototype.drawFunc = function(){};
Context.prototype.drawFunc.applyStyles = function(){};
Context.prototype.applyStyles = function(){};
Context.prototype.fillText = function(fillText, x, y){};
Context.prototype.image = function(){};
Context.prototype.offset = function(){};

