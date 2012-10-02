/**
 * @constructor
 * @extends {MW.MinigameView}
 * @param {MW.ElevatorMinigame} elevatorMinigame
 * @param {Kinetic.Stage} stage
 * @param {MW.AgentView} agentView
 * @param {String} tag
 */
MW.ElevatorView = MW.MinigameView.extend(
/** @lends {MW.ElevatorView.prototype} */
{
	/** @constructs */
	init: function (elevatorMinigame, stage, agentView, tag) {
		this._super(elevatorMinigame, stage, agentView, tag);
		this.tag(tag);
		var view = this;
		var stopButton = null;
		var continueButton = null;
		var agent = null;
		var agentPosition = {};
		var agentLayer = null;
		var agentScale = 0.8;
	
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
	
		this.addAgent = function(x, y, layer, scale) {
			agentPosition.x = x;
			agentPosition.y = y;
			agentLayer = layer;
			agentScale = scale;
		};

        this.agentTalk = function (timeout) {
            agent.talk(timeout);
        };

        this.pointAt = function (number, callback) {
			agent.pointAt(elevatorMinigame.getChosenNumber(), function () {
				view.setTimeout(function () {
					if (!elevatorMinigame.agentIsInterrupted()) {
						view.pick(elevatorMinigame.getChosenNumber(), callback);
						view.setTimeout(function () {
							agent.resetPointAt(function () {});
						}, 1000);
					}
				}, 3000);
			});
        }

		this.on(MW.Event.MG_LADDER_INTERRUPT, function(msg) {
			view.interrupt();
			if (elevatorMinigame.modeIsAgentDo()) {
				agent.resetPointAt();
				agent.talk(2000);
				MW.Sound.play(MW.Sounds.WHICH_ONE_DO_YOU_THINK_IT_IS);
			}
		});

		this.on(MW.Event.MG_LADDER_ALLOW_INTERRUPT, function(callback) {
			stopButton.on("mousedown touchstart", function() {
				stopButton.animate();
				MW.Sound.play(MW.Sounds.BIKE_HORN);
				elevatorMinigame.interruptAgent();
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
    		agent.talk(2000);
			MW.Sound.play(MW.Sounds.LADDER_MY_TURN);
			view.setTimeout(function() {
				callback();
				stopButton.transitionTo({ opacity: 1, duration: 1 });
				continueButton.transitionTo({ opacity: 1, duration: 1 });
			}, 2000);
		});
	
		this.on(MW.Event.MG_LADDER_CHEER, function(callback) {
			MW.Sound.play(MW.Sounds.YAY);
			if (!elevatorMinigame.modeIsChild()) {
				agent.dance();
				view.setTimeout(function () {
					agent.idle();
					view.setTimeout(callback, 1500);
				}, 3000);
			} else {
				view.setTimeout(callback, 4000);
				//elevatorMinigame.evm.print();
				//callback();
			}
		});

		this.on(MW.Event.INTRODUCE_AGENT, function (callback) {
    		if (elevatorMinigame.modeIsAgentSee()) {
		        agent = new agentView(agentLayer, {
	                x: stage.getWidth() - 260,
			        y: 12,
	                opacity: 0,
	                scale: agentScale
	            });
	            if (view.hasIntroducedAgent !== undefined) {
	                view.hasIntroducedAgent();
                }
                continueButton.moveToTop();
                stopButton.moveToTop();
	            agent.jump();
		        agent.transitionTo({
		            opacity: 1,
		            duration: 1,
		            callback: function () {
		                agent.transitionTo({
	                        x: agentPosition.x,
	                        y: agentPosition.y + agent.feetOffset().y,
	                        duration: 1,
	                        callback: function () {
	                            agent.idle();
	                            agent.talk();
		                        MW.Sound.play(MW.Sounds.LADDER_LOOKS_FUN);
		                        view.setTimeout(function() {
			                        MW.Sound.play(MW.Sounds.LADDER_SHOW_ME);
			                        view.setTimeout(function () {
				                        agent.neutral();
				                        callback();
			                        }, 1500);
		                        }, 2000);
	                        }
	                    });
		            }
		        });
	        } else {
        		if (elevatorMinigame.modeIsAgentDo()) {
		            agent = new agentView(agentLayer, {
	                    x: agentPosition.x,
			            y: agentPosition.y,
	                    scale: agentScale
	                });
	                if (view.hasIntroducedAgent !== undefined) {
	                    view.hasIntroducedAgent();
                    }
                    continueButton.moveToTop();
                    stopButton.moveToTop();
	                agent.setY(agentPosition.y + agent.feetOffset().y);
	                agent.idle();
	            }
	            callback();
	        }
		});

		this.on(MW.Event.MG_LADDER_GET_TREAT, function(callback) {
			view.getTreat(callback);		
		});

		this.on(MW.Event.MG_LADDER_CONFIRM_TARGET, function() {
			view.confirmTarget();
		});

		this.on("Elevator.betterBecauseBigger", function(msg) { agent.talk(2000); MW.Sound.play(view.betterBigger); });
		this.on("Elevator.betterBecauseSmaller", function(msg) { agent.talk(2000);MW.Sound.play(view.betterSmaller); });
		this.on("Elevator.hmm", function(msg) { agent.talk(2000);MW.Sound.play(MW.Sounds.MAYBE_THAT_WORKS); });
		this.on("Elevator.agentSuggestSolution", function(msg) {
    		agent.talk(4000);
			view.setTimeout(function() {
				MW.Sound.play(view.suggestion1);
				view.setTimeout(function() {
					MW.Sound.play(view.suggestion1);
				}, 2000);
			}, 2000);
		});
	
		this.on("Elevator.tooLow", function(msg) {
		    agent.talk(4000);
			MW.Sound.play(view.tooLow);
			setTimeout(function() {
				MW.Sound.play(view.tryBigger);
			}, 2000);
		});
	
		this.on("Elevator.tooHigh", function(msg) {
		    agent.talk(4000);
			MW.Sound.play(view.tooHigh);
			setTimeout(function() {
				MW.Sound.play(view.trySmaller);
			}, 2000);
		});
	
		this.on("Elevator.agentTooLow", function(msg) { agent.talk(2000); MW.Sound.play(view.agentTooLow); });
		this.on("Elevator.agentTooHigh", function(msg) { agent.talk(2000); MW.Sound.play(view.agentTooHigh); });
	}
});

