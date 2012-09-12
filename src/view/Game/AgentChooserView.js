/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentChooser} chooser
 */
MW.AgentChooserView = function(stage, chooser) {
	MW.ViewModule.call(this, stage, "AgentChooserView");
	console.log(stage);
	var view = this;
	/** @type {Kinetic.Layer} */ var layer = null;
	/** @const @type {Object.<number>} */
	var CONFIG = {
		/** @const @type {Object.<number>} */
		GRID: {
			/** @const */ X: 363,
			/** @const */ Y: 150,
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
					view.setTimeout(function () {
						button.transitionTo({
							x: stage.getWidth() / 2,
							y: stage.getHeight() / 2,
							scale: {
								x: 1.5,
								y: 1.5
							},
							duration: TIME_MOVE / 1000,
							callback: function () {
								MW.Sound.play(MW.Sounds.THANKS_FOR_CHOOSING_ME);
								view.setTimeout(callback, TIME_WAIT);
							}
						});
					}, TIME_HIDE);
				} else {
					array[i].transitionTo({
						opacity: 0,
						duration: TIME_HIDE / 1000
					});
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
	              opacity: 0.5
	            },
			opacity: 0.6,
			cornerRadius: 10,
			strokeWidth: 4,
			stroke: "white",
			offset: {
				x: CONFIG.BUTTON.WIDTH / 2,
				y: CONFIG.BUTTON.HEIGHT / 2
			}
		});
		g.add(rect);
		g._rect = rect;
		g._agent = agent;
		var agentView = new agent.view();
		var img = agentView.getFace(view, -110, -60);
		img.setScale(0.9);
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
	view.addSetup(function () {
		layer = new Kinetic.Layer();
		stage.add(layer);
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
	});

	/**
	 * Tear down the view
	 */
	view.addTearDown(function() {
		stage.remove(layer);
	});

	/**
	 * On each frame
	 */
	view.on(MW.Event.FRAME, function(msg) {
		layer.draw();
	});
};
