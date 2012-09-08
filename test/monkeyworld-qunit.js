$(document).ready(function(){

	//var evm = new GameEventManager();
	//MW.GlobalObject.prototype.evm = evm;
//	var gameState = new GameState();
//	var mw = null;

	module("Monkey World", {
		setup: function() {
			console.log(MW);
			this.mw = new MW.Game(null, false, false, MW.MinigameConfiguration.LADDER.TREE);
		},
		teardown: function() {
			this.mw.forget("test");
			this.mw = null;
		}
	});
	
	test("Correct default state", function() {
		this.mw.start();
		ok(this.mw.modeIsChild());
		ok(this.mw.playerIsGamer());
	});
	
	test("Play simple game in child play mode", function() {
		this.mw.start();
		this.mw.miniGameDone();
		ok(this.mw.modeIsAgentSee());
		ok(this.mw.playerIsGamer());
	});
	
	test("Transition to monkey do", function() {
		this.mw.start();
		ok(this.mw.modeIsChild(), "Start in Child Play mode");
		this.mw.miniGameDone();
		ok(this.mw.modeIsAgentSee(), "Next round is Monkey See mode");
		this.mw.miniGameDone();
		ok(this.mw.modeIsAgentDo(9), "Next rount is Monkey Do mode");
		ok(!this.mw.playerIsGamer(), "Player should not be gamer");
		ok(this.mw.playerIsAgent(), "Player should be monkey");
	});
	
	test("Finish monkey do", function() {
		this.mw.start();
		this.mw.miniGameDone(); // child play
		this.mw.miniGameDone(); // monkey see
		ok(this.mw.playerIsAgent(), "Active player is monkey");
		this.mw.miniGameDone(); // monkey do
		ok(this.mw.modeIsChild(), "Switched to child play mode");
		ok(this.mw.playerIsGamer(), "Activated gamer player");
	});
	
	test("State after restart", function() {
		this.mw.start();
		this.mw.miniGameDone(); // child play
		this.mw.miniGameDone(); // monkey see
		ok(this.mw.playerIsAgent(), "Current player should be monkey");
		this.mw.restart();
		ok(this.mw.modeIsChild(), "Should me in Child Play Mode");
		ok(this.mw.playerIsGamer(), "Current player should be gamer player");
	});
	
	test("Global scoring", function() {
		this.mw.start();
		equal(this.mw.getScore(), 0, "No global score at start");
		equal(this.mw.getMiniGame().getBackendScore(), 10, "Full local score at start");
		this.mw.getMiniGame().reportMistake();
		this.mw.getMiniGame().reportMistake();
		equal(this.mw.getMiniGame().getBackendScore(), 8, "After two mistakes, local score has been updated");
		equal(this.mw.getScore(), 0, "After two mistakes, global score isn't updated yet");
		this.mw.miniGameDone(); // enter monkey see
		equal(this.mw.getScore(), 8, "After two mistakes and miniGameDone, global score is set");
		equal(this.mw.getMiniGame().getBackendScore(), 10, "Local score is reset to 10");
		this.mw.getMiniGame().reportMistake();
		equal(this.mw.getMiniGame().getBackendScore(), 9, "Local score subtracted by one after a mistake");
		equal(this.mw.getScore(), 8, "Not called miniGameDone yet, so global score still 8");
		this.mw.miniGameDone(); // enter monkey do
		equal(this.mw.getScore(), 17, "miniGameDone: global score is now 17");
		this.mw.miniGameDone(); // done
		equal(this.mw.getScore(), 0, "now time for next minigame, reset to 0");
	});
	
	module("Game Module", {
		setup: function() {
			this.mw = new MW.Game(null, false, false, MW.MinigameConfiguration.LADDER.TREE);
			this.mw.on("Game.addBanana", function(msg) {
				if (msg.callback != undefined) msg.callback();
			}, "test");
		},
		teardown: function() {
			this.mw.forget("test");
			this.mw = null;
		}
	});
	
	test("Report mistake", function() {
		this.mw.start();
		ok(!this.mw.getMiniGame().madeMistake(), "No mistake made yet");
		var mg = this.mw.getMiniGame();
		mg.reportMistake();
		ok(mg.madeMistake(), "Mistake made");
	});
	
	module("Ladder", {
		setup: function() {
			this.mw = new MW.Game(null, false, false, MW.MinigameConfiguration.LADDER.TREE);
			//MW.GlobalObject.prototype.game = this.mw;
			
			this.getGame = function() {
				var tmpGame = new MW.Game(null, false, false, MW.MinigameConfiguration.LADDER.TREE);
				MW.GlobalObject.prototype.game = this.mw;	
			};
		},
		teardown: function() {
//			this.mw = null;
//			MW.GlobalObject.prototype.game = null;
			this.mw.forget("test");
		}
	});
	
	test("Start game", function() {
		this.mw.start();
		ok(this.mw.playerIsGamer(), "Current player should be gamer");
	});
	
	test("Pick one number", function() {
		var that = this, ladder, picked = false;
		this.mw.on(MW.Event.MG_LADDER_PICKED, function(msg) {
			equal(ladder.getChosenNumber(), 1, "Number 1 should've been picked");
			picked = true;
		}, "test");
		this.mw.start();
		ladder = that.mw.getMiniGame();
		ladder.pick(1);
		ok(picked, "A number should've been picked");
	});
	
	test("Pick incorrect number", function() {
		var that = this;
		this.mw.on(MW.Event.MG_LADDER_PLACE_TARGET, function (callback) {
			callback();
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_READY_TO_PICK, function () {
			var ladder = that.mw.getMiniGame();
			ladder.pick(ladder.getIncorrectNumber());
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_PICKED, function(callback, msg) {
			ok(!msg.correct, "Should've picked incorrect number");
			callback();
		}, "test");
		this.mw.start();
	});
	
	test("Pick target number", function() {
		var that = this;
		this.mw.on(MW.Event.MG_LADDER_PLACE_TARGET, function (callback) {
			callback();
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_READY_TO_PICK, function() {
			that.mw.getMiniGame().pick(that.mw.getMiniGame().getTargetNumber());
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_PICKED, function(msg) {
			equal(that.mw.getMiniGame().getChosenNumber(), that.mw.getMiniGame().getTargetNumber(), "Should've picked target number");
		}, "test");
		this.mw.start();
	});
	
	test("Get treat", 17, function() {
		var placed = false;
		var picked = false;
		var toLadder = false;
		var toNest = false;
		var ladder = null;
		var that = this;
		this.mw.on(MW.Event.MG_LADDER_PLACE_TARGET, function (callback) {
			ok(!placed, "1. Shouldn't have placed target yet");
			ok(!picked, "2. Shouldn't have registerd number yet");
			ok(!toLadder, "3. Shouldn't been to ladder yet");
			ok(!toNest, "4. Shouldn't be back at nest yet");
			placed = true;
			callback();
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_READY_TO_PICK, function() {
			ladder = that.mw.getMiniGame();
			ok(placed, "5. Should have placed target");
			ok(!picked, "6. Shouldn't have registerd number yet");
			ok(!toLadder, "7. Shouldn't been to ladder yet");
			ok(!toNest, "8.  Should not be back at nest");
			ladder.pick(ladder.getTargetNumber());
			//ok(toNest, "17.  Should be back at nest");
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_PICKED, function (callback) {
			ok(!picked, "9. Shouldn't have registerd number yet");
			ok(!toLadder, "10. Shouldn't been to ladder yet");
			ok(!toNest, "11. Shouldn't be back at nest yet");
			picked = true;
			callback();
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function (callback) {
			ok(false);
			ok(picked, "12. Should have registerd number");
			ok(!toLadder, "13. Shouldn't been to ladder yet");
			ok(!toNest, "14. Shouldn't be back at nest yet");
			toLadder = true;
			//callback();
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_GET_TARGET, function (callback) {
			callback();
		}, "test");
		this.mw.on(MW.Event.MG_LADDER_RESET_SCENE, function (callback, msg) {
			ok(toLadder, "15. Should have been to ladder");
			ok(!toNest, "16. Shouldn't be back at nest yet");
			toNest = true;
			//callback();
		}, "test");

		this.mw.start();

	});
	
	test("Scoring subtract to zero", function() {
		var mw = this.mw;
		var ladder = null;
		var tries = 16;
		var expected = 10;
		mw.on(MW.Event.MG_LADDER_PLACE_TARGET, function(cb) {
			ladder = mw.getMiniGame();
			equal(ladder.getBackendScore(), expected, "BE score start at " + expected);
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_READY_TO_PICK, function(msg) {
			ladder.pick(ladder.getIncorrectNumber());
		}, "test");
		mw.on(MW.Event.MG_LADDER_PICKED, function(callback, msg) {
			if (!msg.correct) {
				if (expected > 0) expected--;
			}
			callback();
		}, "test");
		mw.on("Ladder.incorrect", function(msg) {
			tries--;
			var pickNumber = tries == 0 ? ladder.getTargetNumber() : ladder.getIncorrectNumber();
			equal(ladder.getBackendScore(), expected, "BE score " + expected + " after picked wrong");
			ladder.pick(pickNumber);
		});
		mw.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_HAS_TARGET, function(msg) {
			ladder.openTreat();
		});
		mw.on(MW.Event.MG_LADDER_CONFIRM_TARGET, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_RESET_SCENE, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_GET_TREAT, function(cb) {
			cb();
		}, "test");
		mw.start();
	});
	
	test("Scoring correct after a while", function() {
		var mw = this.mw;
		var ladder = null;
		var tries = 5;
		var expected = 10;
		mw.on(MW.Event.MG_LADDER_PLACE_TARGET, function(cb) {
			ladder = mw.getMiniGame();
			equal(ladder.getBackendScore(), expected, "BE score start at " + expected);
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_READY_TO_PICK, function(msg) {
			ladder.pick(ladder.getIncorrectNumber());
		}, "test");
		mw.on(MW.Event.MG_LADDER_PICKED, function(cb, msg) {
			if (!msg.correct) {
				if (expected > 0) expected--;
			}
			cb();
		}, "test");
		mw.on("Ladder.incorrect", function(msg) {
		
			tries--;
			var pickNumber = tries == 0 ? ladder.getTargetNumber() : ladder.getIncorrectNumber();
			equal(ladder.getBackendScore(), expected, "BE score " + expected + " after picked wrong");
			ladder.pick(pickNumber);
		}, "test");
		mw.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_HAS_TARGET, function(msg) {
			ladder.openTreat();
		});
		mw.on(MW.Event.MG_LADDER_CONFIRM_TARGET, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_RESET_SCENE, function(cb) {
			if (tries === 0)
				equal(ladder.getBackendScore(), expected, "BE score " + expected + " after correct pick");
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_GET_TARGET, function(cb) {
			cb();
		}, "test");
		mw.start();
	});
	
	test("Global scoring", function() {
		var mw = this.mw;
		var ladder = null;
		mw.on(MW.Event.MG_LADDER_PLACE_TARGET, function(cb) {
			ladder = mw.getMiniGame();
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_READY_TO_PICK, function() {
			ladder.pick(ladder.getIncorrectNumber());
		}, "test");
		mw.on(MW.Event.MG_LADDER_PICKED, function(cb) {
			cb();
		}, "test");
		mw.on("Ladder.incorrect", function(msg) {
			
		});
		mw.on(MW.Event.MG_LADDER_HELPER_APPROACH_TARGET, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_HAS_TARGET, function(msg) {
			ladder.openTreat();
		});
		mw.on(MW.Event.MG_LADDER_CONFIRM_TARGET, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_RESET_SCENE, function(cb) {
			cb();
		}, "test");
		mw.on(MW.Event.MG_LADDER_GET_TARGET, function(cb) {
			cb();
		}, "test");
		equal(mw.getScore(), 0, "Backend score starts at zero");
		mw.start();
	});
});
