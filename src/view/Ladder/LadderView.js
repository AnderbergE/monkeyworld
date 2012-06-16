/**
 * @constructor
 * @extends {GameView}
 * @param {Ladder} ladder
 */
function LadderView(tag, ladder)
{
	GameView.call(this);
	this.tag(tag);
	Log.debug("Creating LadderView", "object");
	var view = this;
	var stopButton = null;
	var continueButton = null;
	var agent = null;
	/** @type {Kinetic.Line} */ var stick = null;
	var STICK_ORIGIN = {x:800, y: 650};
	
	this.addInterruptButtons = function(layer) {
		stopButton = new Kinetic.Image({
			image: images['symbol-stop'], x: 750, y: 700, centerOffset: {x:64,y:64}, alpha: 0
		});
		continueButton = new Kinetic.Image({
			image: images['symbol-check'], x: 900, y: 700, centerOffset: {x:64,y:64}, alpha: 0
		});
		
		layer.add(stopButton);
		layer.add(continueButton);
	};
	
	this.addAgent = function(x, y, layer) {
		agent = new Kinetic.Image({
			image: images[view.agentImage],
			x: view.getStage().getWidth() + 10,
			y: y
		});
		layer.add(agent);
		
		if (view.game.modeIsChild()) {
			var peekAgent = function() {
				view.setTimeout(function() {
					view.getTween(agent.attrs).to({x:view.getStage().getWidth() - 100, rotation: -Math.PI/5}, 1000)
					.wait(2000).to({x:view.getStage().getWidth() + 10}, 1000).call(function(){peekAgent();});
				}, 2000);
			};
			peekAgent();
		} else if (view.game.modeIsAgentSee() || view.game.modeIsAgentDo()) {
			agent.setX(x);		
		}
		
		if (view.game.modeIsAgentDo()) {
			stick = new Kinetic.Line({
				points: [660, 570, STICK_ORIGIN.x, STICK_ORIGIN.y],
				stroke: "brown",
				strokeWidth: 2,
				lineCap: "round"
			});
			layer.add(stick);
		}
	};
	
	view.on("Ladder.introduceAgent", function(msg) {
		Sound.play(Sounds.LADDER_LOOKS_FUN);
		view.setTimeout(function() {
			Sound.play(Sounds.LADDER_SHOW_ME);
			view.setTimeout(function() {
				msg.callback();
			}, 2000);
		}, 2000);
	});
	
	view.on("Ladder.allowInterrupt", function(msg) {
		stopButton.on("mousedown touchstart", function() {
			view.getTween(stopButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			Sound.play(Sounds.BIKE_HORN);
			ladder.interruptAgent();
		});
		continueButton.on("mousedown touchstart", function() {
			view.getTween(continueButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			Sound.play(Sounds.TADA);
		});
		msg.callback();
	});
	
	view.on("Ladder.disallowInterrupt", function(msg) {
		stopButton.off("mousedown touchstart");
		continueButton.off("mousedown touchstart");
	});
	
	view.on("Ladder.startAgent", function(msg) {
		Sound.play(Sounds.LADDER_MY_TURN);
		view.setTimeout(function() {
			msg.callback();
			view.getTween(stopButton.attrs).to({alpha:1},1000);
			view.getTween(continueButton.attrs).to({alpha:1},1000);
		}, 2000);
	});
	
	view.on("Ladder.cheer", function(msg) {
		view.showBig("YAY!");
		view.setTimeout(msg.callback, 1500);
	});
	
	view.on("Ladder.betterBecauseBigger", function(msg) { Sound.play(Sounds.BETTER_BECAUSE_BIGGER); });
	view.on("Ladder.betterBecauseSmaller", function(msg) { Sound.play(Sounds.BETTER_BECAUSE_SMALLER); });
	view.on("Ladder.hmm", function(msg) { Sound.play(Sounds.MAYBE_THAT_WORKS); });
	view.on("Ladder.agentSuggestSolution", function(msg) {
		view.setTimeout(function() {
			Sound.play(Sounds.LADDER_AGENT_SUGGEST_SOLUTION_1);
			view.setTimeout(function() {
				Sound.play(Sounds.LADDER_AGENT_SUGGEST_SOLUTION_2);	
			}, 2000);
		}, 2000);
	});
	
	view.on("Ladder.tooLow", function(msg) {
		Sound.play(Sounds.LADDER_OOPS_TOO_LOW);
		setTimeout(function() {
			Sound.play(Sounds.LADDER_TRY_A_BIGGER_NUMBER);
		}, 2000);
	});
	
	view.on("Ladder.tooHigh", function(msg) {
		Sound.play(Sounds.LADDER_OOPS_TOO_HIGH);
		setTimeout(function() {
			Sound.play(Sounds.LADDER_TRY_A_SMALLER_NUMBER);
		}, 2000);
	});
	
	view.on("Ladder.agentTooLow", function(msg) { Sound.play(Sounds.AGENT_PLAY_TOO_LOW); });
	view.on("Ladder.agentTooHigh", function(msg) { Sound.play(Sounds.AGENT_PLAY_TOO_HIGH); });
	
	/**
	 * Picked a number on the numpad
	 */
	view.on("Ladder.picked", function(msg) {
		if (view.game.modeIsAgentDo() && !ladder.agentIsInterrupted() && !ladder.agentIsBeingHelped()) {
			var pos = view.getStickPoint(msg.number);
			Sound.play(Sounds.IM_GOING_TO_PICK_THIS_ONE);
			view.getTween(stick.attrs.points[1]).wait(1500).to(pos,3000).wait(3000).call(function() {
				view.pick(msg.number, msg.callback);
			}).wait(1000).to(STICK_ORIGIN,1000);
		} else {
			view.pick(msg.number, msg.callback);
		}
	});
}
inherit(LadderView, GameView);
