/**
 * @constructor
 * @extends {ViewModule}
 * @param {MW.AgentChooser} chooser
 */
MW.AgentChooserView = function(chooser) {
	ViewModule.call(this, "AgentChooserView");
	var view = this;
	/** @type {Kinetic.Layer} */ var layer = null;
	/** @const @type {Object.<number>} */
	var CONFIG = {
		/** @const @type {Object.<number>} */
		GRID: {
			/** @const */ X: 363,
			/** @const */ Y: 230,
			/** @const */ WIDTH: 2
		},
		/** @const @type {Object.<number>} */
		BUTTON: {
			/** @const */ WIDTH: 250,
			/** @const */ HEIGHT: 250,
			/** @const */ MARGIN: 60
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
			/** @const @type {number} */ var TIME_WAIT = 5000;
			for (var i = 0; i < array.length; i++) {
				if (array[i] === button) {
					view.getTween(array[i].attrs).wait(TIME_HIDE).to({x: view.stage.getWidth() / 2, y: view.stage.getHeight() / 2}, TIME_MOVE);
					view.getTween(array[i].attrs.scale).wait(TIME_HIDE).to({x: 1.5, y: 1.5}, TIME_MOVE).call(function() {
						MW.Sound.play(MW.Sounds.THANKS_FOR_CHOOSING_ME);
					}).wait(TIME_WAIT).call(callback);
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
			fill: {
	            start: {
	              x: CONFIG.BUTTON.WIDTH / 2,
	              y: CONFIG.BUTTON.HEIGHT / 2,
	              radius: 0
	            },
	            end: {
		              x: CONFIG.BUTTON.WIDTH / 2,
		              y: CONFIG.BUTTON.HEIGHT / 2,
	              radius: CONFIG.BUTTON.WIDTH * 0.75
	            },
	            colorStops: [0, '#00FF7F', 1, '#556B2F']
	          },
	          shadow: {
	              color: 'black',
	              blur: 15,
	              offset: [15, 15],
	              alpha: 0.5
	            },
			alpha: 0.6,
			cornerRadius: 10,
			strokeWidth: 4,
			stroke: "white",
			centerOffset: {
				x: CONFIG.BUTTON.WIDTH / 2,
				y: CONFIG.BUTTON.HEIGHT / 2
			}
		});
		g.add(rect);
		g._rect = rect;
		g._agent = agent;
		var agentView = new agent.view();
		var img = new Kinetic.Image({
			image: agentView.happyFace(),
			centerOffset: {
				x: agentView.happyFace().width / 2,
				y: agentView.happyFace().height / 2
			}
		});
		g.add(img);
		g.on("mousedown touchstart", function() {
			MW.Sound.play(MW.Sounds.CLICK);
			g._rect.setFill("white");
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
			image: MW.Images.JUNGLEBG
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
		MW.Sound.play(MW.Sounds.CHOOSE_YOUR_FRIEND);
	};

	/**
	 * Tear down the view
	 */
	view.addTearDown(function() {
		view.stage.remove(layer);
	});

	/**
	 * On each frame
	 */
	view.on(MW.Event.FRAME, function(msg) {
		layer.draw();
	});
};
