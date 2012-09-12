/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentChooser} chooser
 */
MW.AgentChooserView = MW.ViewModule.extend(
/** @lends {MW.AgentChooserView.prototype} */
{
	/** @constructs */
	init: function (stage, chooser) {
		this._super(stage, "AgentChooserView");
		this._chooser = chooser;
		var view = this;
		/** @type {Kinetic.Layer} */ this._layer = null;
		/** @const @type {Object.<number>} */
		this.CONFIG = {
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
		this._buttons = (function() {
			var buttons = this;
			var array = new Array();
		
			/**
			 * Add a button
			 */
			buttons.add = function(button) {
				array.push(button);
				view._layer.add(button);
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
								x: view.getStage().getWidth() / 2,
								y: view.getStage().getHeight() / 2,
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
		this._Button = function(agent, x, y) {
			var g = new Kinetic.Group({ x: x, y: y });
			var CONFIG = view.CONFIG;
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
				view._buttons.bringForward(g, function() { view._chooser.choose(g._agent); });
				view._buttons.disableClicks();
			});
			return g;
		};
	},
	
	/**
	 * Setup the view
	 * @private
	 */
	setup: function () {
		this._super();
		this._layer = new Kinetic.Layer();
		this.getStage().add(this._layer);
		var bg = new Kinetic.Image({
			image: MW.Images.JUNGLEBG
		});
		this._layer.add(bg);
		var CONFIG = this.CONFIG;
		var buttonGrid = Utils.gridizer(
			CONFIG.GRID.X, CONFIG.GRID.Y,
			CONFIG.BUTTON.WIDTH + CONFIG.BUTTON.MARGIN,
			CONFIG.BUTTON.HEIGHT + CONFIG.BUTTON.MARGIN,
			CONFIG.GRID.WIDTH
		);
		var agents = this._chooser.getAgents();
		for (var i = 0; i < agents.length; i++) {
			var pos = buttonGrid.next();
			this._buttons.add(new this._Button(agents[i], pos.x, pos.y));
		}
		MW.Sound.play(MW.Sounds.CHOOSE_YOUR_FRIEND);
		this._layer.draw();
	},

	/**
	 * Tear down the view
	 */
	tearDown: function() {
		this._super();
		this.getStage().remove(this._layer);
	}
});

