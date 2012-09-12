/**
 * @constructor
 * @extends {MW.MinigameView}
 * @param {MW.LadderMinigame} ladderMinigame
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentView} agentView
 * @param {String} tag
 */
MW.LadderView = MW.MinigameView.extend(
/** @lends {MW.LadderView.prototype} */
{
	/** @constructs */
	init: function (ladderMinigame, stage, agentView, tag) {
		this._super(ladderMinigame, stage, agentView, tag);
		this.tag(tag);
		var view = this;
		var stopButton = null;
		var continueButton = null;
		var agent = null;
	
		this.addInterruptButtons = function(layer) {
			stopButton = new Kinetic.MW.NoButton(view, {
				x: 750, y: 600, opacity: 0
			});
			continueButton = new Kinetic.MW.YesButton(view, {
				x: 900, y: 600, opacity: 0
			});
			stopButton.setScale(0.4);
			continueButton.setScale(0.4);
			layer.add(stopButton);
			layer.add(continueButton);
		};
	
		this.addAgent = function(x, y, scale, layer) {
			if (!ladderMinigame.modeIsChild()) {
				//agent = new agentView.getBody(view, x, y);
				view.setInitialAgentPosition(x, y);
				view.getAgentBody().setScale(scale);
				layer.add(view.getAgentBody());
			}
		};

		this.on(MW.Event.MG_LADDER_INTERRUPT, function(msg) {
			view.interrupt();
			if (ladderMinigame.modeIsAgentDo()) {
				agentView.interruptPointAt();
				MW.Sound.play(MW.Sounds.WHICH_ONE_DO_YOU_THINK_IT_IS);
			}
		});

		this.on(MW.Event.MG_LADDER_ALLOW_INTERRUPT, function(callback) {
			stopButton.on("mousedown touchstart", function() {
				stopButton.animate();
				MW.Sound.play(MW.Sounds.BIKE_HORN);
				ladderMinigame.interruptAgent();
			});
			continueButton.on("mousedown touchstart", function() {
				continueButton.animate();
				MW.Sound.play(MW.Sounds.TADA);
			});
			callback();
		});
	
		this.on(MW.Event.MG_LADDER_FORBID_INTERRUPT, function() {
			stopButton.off("mousedown touchstart");
			continueButton.off("mousedown touchstart");
		});
	
		this.on(MW.Event.MG_LADDER_START_AGENT, function(callback) {
			MW.Sound.play(MW.Sounds.LADDER_MY_TURN);
			view.setTimeout(function() {
				callback();
				stopButton.transitionTo({ opacity: 1, duration: 1 });
				continueButton.transitionTo({ opacity: 1, duration: 1 });
			}, 2000);
		});
	
		this.on(MW.Event.MG_LADDER_CHEER, function(callback) {
			MW.Sound.play(MW.Sounds.YAY);
			if (!ladderMinigame.modeIsChild()) {
				agentView.dance();
				view.setTimeout(function () {
					agentView.stopDance();
					view.setTimeout(callback, 1500);
				}, 3000);
			} else {
				view.setTimeout(callback, 4000);
				//ladderMinigame.evm.print();
				//callback();
			}
		});
	
		this.on(MW.Event.MG_LADDER_GET_TREAT, function(callback) {
			view.getTreat(callback);		
		});

		this.on(MW.Event.MG_LADDER_CONFIRM_TARGET, function() {
			view.confirmTarget();
		});

		this.on("Ladder.betterBecauseBigger", function(msg) { MW.Sound.play(view.betterBigger); });
		this.on("Ladder.betterBecauseSmaller", function(msg) { MW.Sound.play(view.betterSmaller); });
		this.on("Ladder.hmm", function(msg) { MW.Sound.play(MW.Sounds.MAYBE_THAT_WORKS); });
		this.on("Ladder.agentSuggestSolution", function(msg) {
			view.setTimeout(function() {
				MW.Sound.play(view.suggestion1);
				view.setTimeout(function() {
					MW.Sound.play(view.suggestion1);	
				}, 2000);
			}, 2000);
		});
	
		this.on("Ladder.tooLow", function(msg) {
			MW.Sound.play(view.tooLow);
			setTimeout(function() {
				MW.Sound.play(view.tryBigger);
			}, 2000);
		});
	
		this.on("Ladder.tooHigh", function(msg) {
			MW.Sound.play(view.tooHigh);
			setTimeout(function() {
				MW.Sound.play(view.trySmaller);
			}, 2000);
		});
	
		this.on("Ladder.agentTooLow", function(msg) { MW.Sound.play(view.agentTooLow); });
		this.on("Ladder.agentTooHigh", function(msg) { MW.Sound.play(view.agentTooHigh); });
	}
});

