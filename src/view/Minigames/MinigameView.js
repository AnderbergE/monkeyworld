/**
 * @constructor
 * @extends {MW.ViewModule}
 * @param {string} tag
 */
MW.MinigameView = function(tag) {
	// TODO: Rename this object to MinigameView
	MW.ViewModule.call(this, tag);
	var agentBody = null, agentX = 0, agentY = 0;
	/** @type {MW.MinigameView}      */ var view  = this;
	/** @type {Kinetic.Layer} */ var layer = view.stage.getDynamicLayer();
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
			x: view.stage.getWidth() - 700,
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
		var faceImageObj = view.game.getAgentView().normalFace();
		var faceImage = new view.game.getAgentView().getFace(
			view,
			view.getStage().getWidth() - faceImageObj.width - 30,
			12
		);
		faceImage.setScale(0.5);
		view.addSetup(function() {
			if (view.game.modeIsChild()) {
				layer.add(faceImage);
				view.game.getAgentView().faceBlink();
				view.on(MW.Event.INTRODUCE_AGENT, function (callback) {
					MW.Sound.play(MW.Sounds.SYSTEM_FIRST_YOU_PLAY);
					setTimeout(callback, 2000);
				});
			} else if (view.game.modeIsAgentSee()) {
				agentBody = view.game.getAgentView().getBody(
					view,
					view.getStage().getWidth() - faceImageObj.width - 30,
					12
				);
				agentBody.setOpacity(0);
				layer.add(faceImage);
				view.on(MW.Event.INTRODUCE_AGENT, function (callback) {
					MW.Sound.play(MW.Sounds.SYSTEM_WELL_DONE);
					view.setTimeout(function () {
						MW.Sound.play(MW.Sounds.SYSTEM_TIME_TO_TEACH_FRIEND);
						view.setTimeout(function () {
							view.getTween(faceImage.attrs).to({ opacity: 0 }, 2000);
							view.game.getAgentView().jumpDown(agentX, agentY);
							view.setTimeout(function () {
								view.game.getAgentView().startTalk();
								MW.Sound.play(MW.Sounds.LADDER_LOOKS_FUN);
								view.setTimeout(function() {
									MW.Sound.play(MW.Sounds.LADDER_SHOW_ME);
									view.setTimeout(function () {
										view.game.getAgentView().stopTalk();
									}, 1500);
									view.setTimeout(callback, 2000);
								}, 2000);
							}, 2000);
						}, 3000);
					}, 2000);
				});
			} else if (view.game.modeIsAgentDo()) {
				agentBody = view.game.getAgentView().getBody(
					view,
					agentX,
					agentY
				);
				agentBody.hide();
				view.on(MW.Event.INTRODUCE_AGENT, function (callback) {
					view.game.getAgentView().moveBody(agentX, agentY);
					view.game.getAgentView().showBody();
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
