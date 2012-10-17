/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {MW.Minigame} minigame
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentView} agentView
 * @param {string} tag
 */
MW.MinigameView = MW.ViewModule.extend(
/** @lends {MW.MinigameView.prototype} */
{
	/** @constructs */
	init: function (minigame, stage, agentView, tag) {
		this._super(stage, tag);
		var agentBody = null, agentX = 0, agentY = 0;
		/** @type {MW.MinigameView}      */ var view  = this;
		/** @type {Kinetic.Layer} */ var layer = stage.getDynamicLayer();
		/**
		 * Show the current backend score of a mini game.
		 * @param {MW.MinigameView} view
		 */
		/*(function (view) {
		    if (MW.GlobalSettings.debug) {
			    /** @const */
			   /* var label = "Backend Score (current mode):";
			    var text = new Kinetic.Text({
				    text: label,
				    fontSize: 12,
				    fontFamily: "sans-serif",
				    textFill: "black",
				    align: "left",
				    verticalAlign: "middle",
				    x: stage.getWidth() - 700,
				    y: 15
			    });
			    layer.add(text);
			    var on = true, running = on;
			    view.on(MW.Event.BACKEND_SCORE_UPDATE_MODE, function(msg) {
				    text.setText(label + " " + msg.backendScore);
			    });
			    view.on(MW.Event.TRIGGER_SCORE, function () {
				    if (running && !on) {
					    layer.add(text);
					    on = true;
				    } else if (running && on) {
					    layer.remove(text);
					    on = false;
				    }
			    });
			    view.addTearDown(function() {
				    if (on) {
					    layer.remove(text);
				    }
				    running = false;
				    on = false;
			    });
		    }
		})(this);*/

		/**
		 * Show the face of the agent in the top right corner in child play mode
		 */
		(function (view) {
			view.addSetup(function() {
				if (minigame.modeIsChild()) {
					/*var faceImageObj = new agentView(layer, {
			            x: stage.getWidth() - 260,
				        y: 12,
				        scale: 0.5
			        });
			        view.addTearDown(function () {
			            faceImageObj._remove();
			        });
			        faceImageObj.hideBody();*/
					view.on(MW.Event.INTRODUCE_MODE, function (callback) {
						MW.Sound.play(MW.Sounds.SYSTEM_FIRST_YOU_PLAY);
						setTimeout(callback, 2000);
					});
				} else if (minigame.modeIsAgentSee()) {
			        var faceImageObj = new agentView(layer, {
			            x: stage.getWidth() - 260,
				        y: 12,
				        scale: 0.5
			        });
			        view.addTearDown(function () {
			            faceImageObj._remove();
			        });
			        faceImageObj.hideBody();
					view.on(MW.Event.INTRODUCE_MODE, function (callback) {
						MW.Sound.play(MW.Sounds.SYSTEM_WELL_DONE);
						view.setTimeout(function () {
							MW.Sound.play(MW.Sounds.SYSTEM_TIME_TO_TEACH_FRIEND);
							view.setTimeout(function () {
								faceImageObj.transitionTo({ opacity: 0, duration: 2});
								callback();
							}, 3000);
						}, 2000);
					});
				} else if (minigame.modeIsAgentDo()) {
				    view.on(MW.Event.INTRODUCE_MODE, function (callback) {
				        callback();
				    });
				}
			});
		})(this);

		this.getAgentBody = function () {
			if (agentBody === null) {
				throw {
					name: "AgentBodyNotInitiatedYet",
					message: "The body view of the agent has not yet been initated"
				};
			}
			return agentBody;
		};

		this.setInitialAgentPosition = function (x, y) {
			agentX = x;
			agentY = y;
		};
	}
});

