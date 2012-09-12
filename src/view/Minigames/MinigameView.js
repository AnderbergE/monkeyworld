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
		(function (view) {
			/** @const */
			var label = "Backend Score (current mode):";
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
		})(this);

		/**

		 * Show the face of the agent in the top right corner in child play mode
		 */
		(function (view) {
			var faceImageObj = agentView.normalFace();
			var faceImage = new agentView.getFace(
				view,
				stage.getWidth() - faceImageObj.width - 30,
				12
			);
			faceImage.setScale(0.5);
			view.addSetup(function() {
				if (minigame.modeIsChild()) {
					layer.add(faceImage);
					agentView.faceBlink();
					view.on(MW.Event.INTRODUCE_AGENT, function (callback) {
						MW.Sound.play(MW.Sounds.SYSTEM_FIRST_YOU_PLAY);
						setTimeout(callback, 2000);
					});
				} else if (minigame.modeIsAgentSee()) {
					agentBody = agentView.getBody(
						view,
						stage.getWidth() - faceImageObj.width - 30,
						12
					);
					agentBody.setOpacity(0);
					layer.add(faceImage);
					view.on(MW.Event.INTRODUCE_AGENT, function (callback) {
						MW.Sound.play(MW.Sounds.SYSTEM_WELL_DONE);
						view.setTimeout(function () {
							MW.Sound.play(MW.Sounds.SYSTEM_TIME_TO_TEACH_FRIEND);
							view.setTimeout(function () {
								faceImage.transitionTo({ opacity: 0, duration: 2});
								agentView.jumpDown(agentX, agentY);
								view.setTimeout(function () {
									agentView.startTalk();
									MW.Sound.play(MW.Sounds.LADDER_LOOKS_FUN);
									view.setTimeout(function() {
										MW.Sound.play(MW.Sounds.LADDER_SHOW_ME);
										view.setTimeout(function () {
											agentView.stopTalk();
										}, 1500);
										view.setTimeout(callback, 2000);
									}, 2000);
								}, 2000);
							}, 3000);
						}, 2000);
					});
				} else if (minigame.modeIsAgentDo()) {
					agentBody = agentView.getBody(
						view,
						agentX,
						agentY
					);
					agentBody.hide();
					view.on(MW.Event.INTRODUCE_AGENT, function (callback) {
						agentView.moveBody(agentX, agentY);
						agentView.showBody();
						callback();
					});
				}
			});
			view.addTearDown(function() {
				layer.remove(faceImage);
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

