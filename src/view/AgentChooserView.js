/**
 * @constructor
 * @extends {GameView}
 * @param {MW.AgentChooser} chooser
 */
MW.AgentChooserView = function(chooser) {
	GameView.call(this);
	this.tag("AgentChooserView");
	var view = this;
	/** @type {Kinetic.Layer} */ var layer = null;
	
	/** @const @type {Object.<number>} */
	var CONFIG = {
		/** @const @type {Object.<number>} */
		GRID: {
			/** @const */ X: 400,
			/** @const */ Y: 230,
			/** @const */ WIDTH: 2
		},
		/** @const @type {Object.<number>} */
		BUTTON: {
			/** @const */ WIDTH: 250,
			/** @const */ HEIGHT: 250,
			/** @const */ MARGIN: 30
		}
	};
	
	/**
	 * Hold buttons
	 */
	var buttons = (function() {
		var buttons = this;
		var array = new Array();
		
		/**
		 * Add a button
		 * @param {Button} button
		 */
		buttons.add = function(button) {
			array.push(button);
			layer.add(button);
		};
		
		/**
		 * Enable mouse clicks on all buttons
		 */
		buttons.enableClicks = function() {
			for (var i = 0; i < array.length; i++) {
				array[i].attrs.listening = true;
			}
		};
		
		/**
		 * Disable mouse clicks on all buttons
		 */
		buttons.disableClicks = function() {
			for (var i = 0; i < array.length; i++) {
				array[i].attrs.listening = false;
			}
		};
		
		/**
		 * Bring a button to the center, hide the others
		 */
		buttons.bringForward = function(button, callback) {
			/** @const @type {number} */ var TIME_HIDE = 1000;
			/** @const @type {number} */ var TIME_MOVE = 1000;
			/** @const @type {number} */ var TIME_WAIT = 2000;
			for (var i = 0; i < array.length; i++) {
				if (array[i] === button) {
					view.getTween(array[i].attrs).wait(TIME_HIDE).to({x: view.stage.getWidth() / 2, y: view.stage.getHeight() / 2}, TIME_MOVE);
					view.getTween(array[i].attrs.scale).wait(TIME_HIDE).to({x: 1.5, y: 1.5}, TIME_MOVE).wait(TIME_WAIT).call(callback);
				} else {
					view.getTween(array[i].attrs).to({alpha: 0}, TIME_HIDE);
				}
			}
		};
		
		return buttons;
	})();
	
	/**
	 * Create a button for an agent
	 * @constructor
	 * @extends {Kinetic.Shape}
	 */
	var Button = function(agent, x, y) {
		var g = new Kinetic.Group({ x: x, y: y });
		var rect = new Kinetic.Rect({
			width: CONFIG.BUTTON.WIDTH,
			height: CONFIG.BUTTON.HEIGHT,
			fill: "red",
			alpha: 0.8,
			cornerRadius: 10,
			strokeWidth: 4,
			stroke: "white",
			centerOffset: {
				x: CONFIG.BUTTON.WIDTH / 2,
				y: CONFIG.BUTTON.HEIGHT / 2,
			}
		});
		g.add(rect);
		g._rect = rect;
		g._agent = agent;
		
		var img = new Kinetic.Image({
			image: images[agent],
			centerOffset: {
				x: images[agent].width / 2,
				y: images[agent].height / 2
			}
		});
		

		if (img.getWidth() > 200) {
			img.setWidth(200);
		}
		
		g.add(img);
		
		g.on("mousedown touchstart", function() {
			Sound.play(Sounds.CLICK);
			g._rect.setFill("yellow");
			g.moveToTop();
			buttons.bringForward(g, function() { chooser.choose(g._agent); });
			buttons.disableClicks();
		});
		return g;
	};
	
	/**
	 * Setup the view
	 * @private
	 */
	view.setup = function() {
		layer = new Kinetic.Layer();
		view.stage.add(layer);
		var bg = new Kinetic.Image({
			image: images["junglebg"],
		});
		layer.add(bg);
		var buttonGrid = Utils.gridizer(
			CONFIG.GRID.X, CONFIG.GRID.Y,
			CONFIG.BUTTON.WIDTH + CONFIG.BUTTON.MARGIN,
			CONFIG.BUTTON.HEIGHT + CONFIG.BUTTON.MARGIN,
			CONFIG.GRID.WIDTH
		);
		var agents = chooser.getAgents();
		for (var i = 0; i < agents.length; i++) {
			var pos = buttonGrid.next();
			buttons.add(new Button(agents[i], pos.x, pos.y));
		}
	};

	/**
	 * Tear down the view
	 */
	view.on(Events.TEAR_DOWN, function() {
		view.forget();
		view.stage.remove(layer);
	});
	
	/**
	 * On each frame
	 */
	view.on(Events.FRAME, function() {
		layer.draw();
	});
};
inherit(MW.AgentChooserView, GameView);