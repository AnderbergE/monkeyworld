/**
 * @constructor
 * @extends {GameView}
 * @param {MW.LadderMinigame} ladder
 */
function LadderView(tag, ladder)
{
	GameView.call(this, tag);
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
			image: MW.Images.SYMBOL_STOP, x: 750, y: 700, offset: {x:64,y:64}, alpha: 0
		});
		continueButton = new Kinetic.Image({
			image: MW.Images.SYMBOL_CHECK, x: 900, y: 700, offset: {x:64,y:64}, alpha: 0
		});
		
		layer.add(stopButton);
		layer.add(continueButton);
	};
	
	this.addAgent = function(x, y, layer) {
		agent = new Kinetic.Image({
			image: view.game.getAgentView().standing(),
			x: view.getStage().getWidth() + 10,
			y: y
		});
		layer.add(agent);
		
		if (view.game.modeIsAgentSee() || view.game.modeIsAgentDo()) {
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
	
	view.on("Ladder.interrupt", function(msg) {
		if (view.game.modeIsAgentDo()) {
			view.removeTween(stick.attrs.points[1]);
			view.getTween(stick.attrs.points[1]).to(STICK_ORIGIN,1000).call(function() {
				MW.Sound.play(MW.Sounds.WHICH_ONE_DO_YOU_THINK_IT_IS);
			});
		}
		view.interrupt();
	});
	
	view.on("Ladder.introduceAgent", function(callback) {
		MW.Sound.play(MW.Sounds.LADDER_LOOKS_FUN);
		view.setTimeout(function() {
			MW.Sound.play(MW.Sounds.LADDER_SHOW_ME);
			view.setTimeout(function() {
				callback();
			}, 2000);
		}, 2000);
	});
	
	view.on(MW.Event.MG_LADDER_ALLOW_INTERRUPT, function(callback) {
		stopButton.on("mousedown touchstart", function() {
			view.getTween(stopButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			MW.Sound.play(MW.Sounds.BIKE_HORN);
			ladder.interruptAgent();
		});
		continueButton.on("mousedown touchstart", function() {
			view.getTween(continueButton.attrs).to({rotation: 8*Math.PI}, 1200).to({rotation:0});
			MW.Sound.play(MW.Sounds.TADA);
		});
		callback();
	});
	
	view.on(MW.Event.MG_LADDER_FORBID_INTERRUPT, function() {
		stopButton.off("mousedown touchstart");
		continueButton.off("mousedown touchstart");
	});
	
	view.on("Ladder.startAgent", function(callback) {
		MW.Sound.play(MW.Sounds.LADDER_MY_TURN);
		view.setTimeout(function() {
			callback();
			view.getTween(stopButton.attrs).to({alpha:1},1000);
			view.getTween(continueButton.attrs).to({alpha:1},1000);
		}, 2000);
	});
	
	view.on(MW.Event.MG_LADDER_CHEER, function(callback) {
		view.showBig("YAY!");
		view.setTimeout(callback, 1500);
	});
	
	view.on(MW.Event.MG_LADDER_GET_TREAT, function(callback) {
		view.getTreat(callback);		
	});

	view.on(MW.Event.MG_LADDER_CONFIRM_TARGET, function() {
		view.confirmTarget();
	});

	view.on("Ladder.betterBecauseBigger", function(msg) { MW.Sound.play(view.betterBigger); });
	view.on("Ladder.betterBecauseSmaller", function(msg) { MW.Sound.play(view.betterSmaller); });
	view.on("Ladder.hmm", function(msg) { MW.Sound.play(MW.Sounds.MAYBE_THAT_WORKS); });
	view.on("Ladder.agentSuggestSolution", function(msg) {
		view.setTimeout(function() {
			MW.Sound.play(view.suggestion1);
			view.setTimeout(function() {
				MW.Sound.play(view.suggestion1);	
			}, 2000);
		}, 2000);
	});
	
	view.on("Ladder.tooLow", function(msg) {
		MW.Sound.play(view.tooLow);
		setTimeout(function() {
			MW.Sound.play(view.tryBigger);
		}, 2000);
	});
	
	view.on("Ladder.tooHigh", function(msg) {
		MW.Sound.play(view.tooHigh);
		setTimeout(function() {
			MW.Sound.play(view.trySmaller);
		}, 2000);
	});
	
	view.on("Ladder.agentTooLow", function(msg) { MW.Sound.play(view.agentTooLow); });
	view.on("Ladder.agentTooHigh", function(msg) { MW.Sound.play(view.agentTooHigh); });
	
	/**
	 * Picked a number on the numpad
	 */
	view.on("Ladder.picked", function(callback, msg) {
		if (view.game.modeIsAgentDo() && !ladder.agentIsInterrupted() && !ladder.agentIsBeingHelped()) {
			var pos = view.getStickPoint(msg.number);
			MW.Sound.play(MW.Sounds.IM_GOING_TO_PICK_THIS_ONE);
			view.getTween(stick.attrs.points[1]).wait(1500).to(pos,3000).wait(3000).call(function() {
				view.pick(msg.number, callback);
			}).wait(1000).to(STICK_ORIGIN,1000);
		} else {
			view.pick(msg.number, callback);
		}
	});
}
