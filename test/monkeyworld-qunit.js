$(document).ready(function(){

	var evm = new GameEventManager();
	MW.GlobalObject.prototype.evm = evm;
	var gameState = new GameState();
	var mw = null;

	module("Monkey World", {
		setup: function() {
			mw = new MW.Game(false);
			MW.GlobalObject.prototype.game = mw;
		},
		teardown: function() {
			evm.forget("test");
			mw = null;
			MW.GlobalObject.prototype.game = null;
		}
	});
	
	test("Correct default state", function() {
		equal(mw.numberOfBananas(), 0);
		equal(mw.getMode(), GameMode.CHILD_PLAY);
		equal(mw.getRound(), 1);
		ok(mw.playerIsGamer());
	});
	
	test("Play simple game in child play mode", function() {
		mw.start();
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 0);
		equal(mw.getMode(), GameMode.CHILD_PLAY);
		equal(mw.getRound(), 1);
		ok(mw.playerIsGamer());
	});
	
	test("Deny transition to monkey see mode", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.no();
		}, "test");
		mw.start();
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 0);
		equal(mw.getMode(), GameMode.CHILD_PLAY);
		equal(mw.getRound(), 2);
		ok(mw.playerIsGamer());
	});
	
	test("Deny, then accept transition to monkey see mode", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.no();
		}, "test");
		evm.on("Game.addBanana", function(msg) {
			if (msg.callback != undefined) msg.callback();
		}, "test");
		mw.start();
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 0);
		equal(mw.getMode(), GameMode.CHILD_PLAY);
		equal(mw.getRound(), 2);
		ok(mw.playerIsGamer());
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 1);
		equal(mw.getMode(), GameMode.MONKEY_SEE);
		equal(mw.getRound(), 1);
		ok(mw.playerIsGamer());
	});
	
	test("Transition to monkey see mode", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		evm.on("Game.addBanana", function(msg) {
			if (msg.callback != undefined) msg.callback();
		}, "test");
		mw.start();
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 1);
		equal(mw.getMode(), GameMode.MONKEY_SEE);
		equal(mw.getRound(), 1);
		ok(mw.playerIsGamer());
	});
	
	test("Add monkey see round", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		evm.on("Game.addBanana", function(msg) {
			if (msg.callback != undefined) msg.callback();
		}, "test");
		Settings.set("global", "monkeySeeRounds", 3);
		mw.start();
		mw.miniGameDone();
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 1);
		equal(mw.getMode(), GameMode.MONKEY_SEE);
		equal(mw.getRound(), 2);
		ok(mw.playerIsGamer());
	});
	
	test("Add many monkey see round", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		evm.on("Game.addBanana", function(msg) {
			if (msg.callback != undefined) msg.callback();
		}, "test");
		Settings.set("global", "monkeySeeRounds", 10);
		mw.start();
		mw.miniGameDone();
		mw.miniGameDone();
		mw.miniGameDone();
		mw.miniGameDone();
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 1);
		equal(mw.getMode(), GameMode.MONKEY_SEE);
		equal(mw.getRound(), 5);
		ok(mw.playerIsGamer());
	});
	
	test("Transition to monkey do", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		evm.on("Game.addBanana", function(msg) {
			if (msg.callback != undefined) msg.callback();
		}, "test");
		Settings.set("global", "monkeySeeRounds", 3);
		mw.start();
		mw.miniGameDone();
		mw.miniGameDone();
		mw.miniGameDone();
		mw.miniGameDone();
		equal(mw.numberOfBananas(), 2);
		equal(mw.getMode(), GameMode.MONKEY_DO);
		equal(mw.getRound(), 1);
		ok(mw.playerIsMonkey());
	});
	
	test("Finish monkey do correctly", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		evm.on("Game.addBanana", function(msg) {
			if (msg.callback != undefined) msg.callback();
		}, "bananatester");
		Settings.set("global", "monkeySeeRounds", 3);
		mw.start();
		mw.miniGameDone(); // child play
		mw.miniGameDone(); // monkey see 1
		mw.miniGameDone(); // monkey see 2
		mw.miniGameDone(); // monkey see 3
		ok(mw.playerIsMonkey(), "Active player is monkey");
		mw.miniGameDone(); // monkey do 1
		ok(mw.playerIsMonkey(), "Active player is monkey");
		mw.miniGameDone(); // monkey do 2
		ok(mw.playerIsMonkey(), "Active player is monkey");
		mw.miniGameDone(); // monkey do 3
		equal(mw.numberOfBananas(), 4, "Number of bananas is now 4");
		equal(mw.getMode(), GameMode.CHILD_PLAY, "Switched to child play mode");
		equal(mw.getRound(), 1, "Reset round to 1");
		ok(mw.playerIsGamer(), "Activated gamer player");
		ok(!mw.madeMistake(), "No player mistake made");
		evm.forget("bananatester");
	});
	
	test("Restart", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		Settings.set("global", "monkeySeeRounds", 3);
		mw.start();
		mw.miniGameDone(); // child play
		mw.miniGameDone(); // monkey see 1
		mw.miniGameDone(); // monkey see 2
		mw.miniGameDone(); // monkey see 3
		mw.miniGameDone(); // monkey do 1
		mw.miniGameDone(); // monkey do 2
		equal(mw.numberOfBananas(), 2, "Should have two bananas");
		ok(mw.playerIsMonkey(), "Current player should be monkey");
		mw.restart();
		equal(mw.numberOfBananas(), 0, "Should have zero bananas");
		equal(mw.getMode(), GameMode.CHILD_PLAY, "Should me in Child Play Mode");
		equal(mw.getRound(), 1, "Should be round 1");
		ok(mw.playerIsGamer(), "Current player should be gamer player");
		ok(!mw.madeMistake(), "No player mistake made");
	});
	
	test("Make mistake in monkey see", function() {
		evm.on("Game.askIfReadyToTeach", function(msg) {
			evm.forget("test");
			msg.yes();
		}, "test");
		Settings.set("global", "monkeySeeRounds", 3);
		mw.start();
		mw.miniGameDone(); // child play
		mw.miniGameDone(); // monkey see 1
		mw.getMiniGame().reportMistake();
		mw.miniGameDone(); // monkey see 2
		ok(mw.madeMistake(), "Register that player did mistake");
	});
	
	module("Game Module", {
		setup: function() {
			mw = new MW.Game(false);
			MW.GlobalObject.prototype.game = mw;
			evm.on("Game.addBanana", function(msg) {
				if (msg.callback != undefined) msg.callback();
			}, "test");
		},
		teardown: function() {
			evm.forget("test");
			mw = null;
			MW.GlobalObject.prototype.game = null;
		}
	});
	
	test("Report mistake", function() {
		mw.start();
		ok(!mw.getMiniGame().madeMistake(), "No mistake made yet");
		var mg = mw.getMiniGame();
		mg.reportMistake();
		ok(mg.madeMistake(), "Mistake made");
	});
	
	module("Ladder", {
		setup: function() {
			mw = new MW.Game(false, Ladder);
			MW.GlobalObject.prototype.game = mw;
		},
		teardown: function() {
			mw = null;
			MW.GlobalObject.prototype.game = null;
			evm.forget("test");
		}
	});
	
	test("Start game", function() {
		mw.start();
		ok(mw.playerIsGamer(), "Current player should be gamer");
	});
	
	test("Pick one number", function() {
		evm.on("Ladder.picked", function(msg) {
			equal(msg.number, 1, "Number 1 should've been picked");
			picked = true;
		}, "test");
		var picked = false;
		mw.start();
		var ladder = mw.getMiniGame();
		ladder.pick(1);
		mw.miniGameDone();
		ok(picked, "A number should've been picked");
	});
	
	test("Pick incorrect number", function() {
		evm.on("Ladder.picked", function(msg) {
			ok(!msg.correct, "Should've picked incorrect number");
		}, "test");
		Settings.set("miniGames", "ladder", "targetNumber", 2);
		mw.start();
		var ladder = mw.getMiniGame();
		ladder.pick(3);
	});
	
	test("Pick target number", function() {
		evm.on("Ladder.picked", function(msg) {
			ok(msg.correct, "Should've picked incorrect number");
		}, "test");
		Settings.set("miniGames", "ladder", "targetNumber", 2);
		mw.start();
		var ladder = mw.getMiniGame();
		ladder.pick(2);
	});
	
	test("Pick redeived target number", function() {
		mw.start();
		var ladder = mw.getMiniGame();
		evm.on("Ladder.picked", function(msg) {
			equal(msg.number, ladder.getTargetNumber(), "Should've picked target number");
		}, "test");
		ladder.pick(ladder.getTargetNumber());
	});
	
	test("Get treat", function() {
		var picked = false;
		var toLadder = false;
		var toNest = false;
		mw.start();
		var ladder = mw.getMiniGame();
		evm.on("Ladder.picked", function(msg) {
			ok(!picked, "Shouldn't have registerd number yet");
			ok(!toLadder, "Shouldn't been to ladder yet");
			ok(!toNest, "Shouldn't be back at nest yet");
			picked = true;
		}, "test");
		evm.on("Ladder.birdFlyToLadder", function(msg) {
			ok(picked, "Should have registerd number");
			ok(!toLadder, "Shouldn't been to ladder yet");
			ok(!toNest, "Shouldn't be back at nest yet");
			toLadder = true;
			msg.callback();
		}, "test");
		evm.on("Ladder.birdFlyToNest", function(msg) {
			ok(picked, "Should have registerd number");
			ok(toLadder, "Should have been to ladder");
			ok(!toNest, "Shouldn't be back at nest yet");
			toNest = true;
		}, "test");
		evm.on("Ladder.dropTreat", function(msg) {
			msg.callback();
			mw.miniGameDone();
		}, "test");
		ladder.pick(ladder.getTargetNumber());
		ok(picked, "Should have registerd number");
		ok(toLadder, "Should have been to ladder");
		ok(toNest, "Should be back at nest");
	});
	
	module("Fishing Game", {
		setup: function() {
			mw = new MW.Game(false);
			MW.GlobalObject.prototype.game = mw;
			evm.on("FishingGame.catch", function(msg) { msg.done(); }, "test");
			evm.on("FishingGame.free", function(msg) { msg.done(); }, "test");
		},
		teardown: function() {
			mw = null;
			MW.GlobalObject.prototype.game = null;
			evm.forget("test");
		}
	});

	
	test("Number of fish", function() {
		var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 123, 500, 1232, 6050];
		Settings.set("miniGames", "fishingGame", "numberCorrect", 0);
		Settings.set("miniGames", "fishingGame", "maxNumber", 9);
		for (var i = 0; i < data.length; i++) {
			Settings.set("miniGames", "fishingGame", "numberOfFish", data[i]);
			var fg = new FishingGame(gameState);
			equal(fg.getNumberOfFish(), data[i]);
		}
	});

	test("Catch one correct fish", function() {
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", 565);
		Settings.set("miniGames", "fishingGame", "numberCorrect", 200);
		var gfg = new FishingGame(gameState);
		var correctFish = gfg.getOneCorrectFish();
		gfg.catchFish(correctFish);
		var basket = gfg.getBasket();
		equal(basket[0].toString(), correctFish.toString());
	});
	
	test("Catch many correct fish", function() {
		var FISH_TO_CATCH = 200;
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", 565);
		Settings.set("miniGames", "fishingGame", "numberCorrect", FISH_TO_CATCH);
		var gfg = new FishingGame(gameState);
		var correct = new Array();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			var fish = gfg.getOneCorrectFish();
			correct.push(fish);
			gfg.catchFish(fish);
		}
		var basket = gfg.getBasket();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			equal(basket[i].toString(), correct[i].toString());	
		}
	});
	
	test("Catch one incorrect fish", function() {
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", 565);
		Settings.set("miniGames", "fishingGame", "numberCorrect", 200);
		var gfg = new FishingGame(gameState);
		var incorrectFish = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrectFish);
		var basket = gfg.getBasket();
		equal(basket[0].toString(), incorrectFish.toString());
	});
	
	test("Catch many incorrect fish", function() {
		var FISH_TO_CATCH = 200;
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", 565);
		Settings.set("miniGames", "fishingGame", "numberCorrect", FISH_TO_CATCH);
		var gfg = new FishingGame(gameState);
		var incorrect = new Array();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			var fish = gfg.getOneIncorrectFish();
			incorrect.push(fish);
			gfg.catchFish(fish);
		}
		var basket = gfg.getBasket();
		for (var i = 0; i < FISH_TO_CATCH; i++) {
			equal(basket[i].toString(), incorrect[i].toString());	
		}
	});
	
	test("Catch different fish in different order", function() {
		var caught = new Array();
		var CORRECT_NUMBER = 5;
		var data =
			[true, false, true, true, true, false, false, false, true, true,
			 false, false, true, false, false, true, true, true, false, false,
			 false, false, false, false, true, true, true, true, false, false];
		var numCorrect = 0;
		var numIncorrect = 0;
		for (var i = 0; i < data.length; i++) {
			if (data[i]) numCorrect++; else numIncorrect++;
		};
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", numCorrect + numIncorrect);
		Settings.set("miniGames", "fishingGame", "numberCorrect", numCorrect);
		Settings.set("miniGames", "fishingGame", "targetNumber", CORRECT_NUMBER);
		var gfg = new FishingGame(gameState);
		for (var i = 0; i < numCorrect + numIncorrect; i++) {
			var fish = (data[i] ? gfg.getOneCorrectFish() : gfg.getOneIncorrectFish());
			caught.push(fish);
			gfg.catchFish(fish);
		}
		var basket = gfg.getBasket();
		for (var i = 0; i <  numCorrect + numIncorrect; i++) {
			if (data[i])
				equal(basket[i].getTargetNumber(), CORRECT_NUMBER);
			else
				notEqual(basket[i].getTargetNumber(), CORRECT_NUMBER);
			equal(basket[i].toString(), caught[i].toString());
		};
	});
	
	test("Catch and free one fish", function() {
		var CORRECT_NUMBER = 5;
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", 50);
		Settings.set("miniGames", "fishingGame", "numberCorrect", 10);
		Settings.set("miniGames", "fishingGame", "targetNumber", CORRECT_NUMBER);
		var gfg = new FishingGame(gameState);
		var fish = gfg.getOneCorrectFish();
		gfg.catchFish(fish);
		var basket = gfg.getBasket();
		equal(basket[0].toString(), fish.toString());
		equal(gfg.getOneCorrectlyCapturedFish().toString(), fish.toString());
		gfg.freeFish(fish);
		equal(basket[0], undefined);
		equal(gfg.getOneCorrectlyCapturedFish(), null);
	});
	
	test("Catch and free fish in different order", function() {
		var TARGET_NUMBER = 5;
		var NUMBER_CORRECT = 5;
		var NUMBER_INCORRECT = 5;
		var numberTotal = NUMBER_CORRECT + NUMBER_INCORRECT;
		
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", numberTotal);
		Settings.set("miniGames", "fishingGame", "numberCorrect", NUMBER_CORRECT);
		Settings.set("miniGames", "fishingGame", "targetNumber", TARGET_NUMBER);
		var gfg = new FishingGame(gameState);
		var basket = gfg.getBasket();
		var correct1 = gfg.getOneCorrectFish();
		gfg.catchFish(correct1);
		equal(gfg.getOneCorrectlyCapturedFish().toString(), correct1.toString());
		
		var correct2 = gfg.getOneCorrectFish();
		gfg.catchFish(correct2);
		equal(basket[1].toString(), correct2.toString());
		
		var correct3 = gfg.getOneCorrectFish();
		gfg.catchFish(correct3);
		equal(basket[2].toString(), correct3.toString());
		
		var correct4 = gfg.getOneCorrectFish();
		
		var incorrect1 = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrect1);
		equal(basket[3].toString(), incorrect1.toString());
		
		var incorrect2 = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrect2);
		equal(basket[4].toString(), incorrect2.toString());
		
		var incorrect3 = gfg.getOneIncorrectFish();
		gfg.catchFish(incorrect3);
		equal(basket[5].toString(), incorrect3.toString());
		
		gfg.freeFish(correct1);
		equal(basket[0], null);
		
		gfg.freeFish(correct2);
		equal(basket[1], null);
		
		gfg.freeFish(incorrect2);
		equal(basket[4], null);
		
		gfg.catchFish(correct4);
		equal(basket[0], correct4.toString());
		
		gfg.freeFish(correct3);
		equal(basket[2], null);
		
		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
		
		gfg.freeFish(incorrect2);
		equal(basket[1], null);

		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
		
		gfg.freeFish(incorrect2);
		equal(basket[1], null);

		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
		
		gfg.freeFish(incorrect2);
		equal(basket[1], null);

		gfg.catchFish(incorrect2);
		equal(basket[1], incorrect2.toString());
	});
	
	test("Basket slots", function() {
		var TARGET_NUMBER = 5;
		var NUMBER_CORRECT = 5;
		var NUMBER_INCORRECT = 5;
		var numberTotal = NUMBER_CORRECT + NUMBER_INCORRECT;
		Settings.set("miniGames", "fishingGame", "maxNumber", 21);
		Settings.set("miniGames", "fishingGame", "numberOfFish", numberTotal);
		Settings.set("miniGames", "fishingGame", "numberCorrect", NUMBER_CORRECT);
		Settings.set("miniGames", "fishingGame", "targetNumber", TARGET_NUMBER);
		var gfg = new FishingGame(gameState);
		equal(gfg.getNextBasketSlot(), 0);
		gfg.catchFish(gfg.getOneCorrectFish());
		equal(gfg.getNextBasketSlot(), 1);
		gfg.catchFish(gfg.getOneCorrectFish());
		gfg.catchFish(gfg.getOneCorrectFish());
		equal(gfg.getNextBasketSlot(), 3);
		gfg.freeFish(gfg.getOneCorrectlyCapturedFish());
		equal(gfg.getNextBasketSlot(), 0);
		gfg.catchFish(gfg.getOneCorrectlyCapturedFish());
		gfg.catchFish(gfg.getOneCorrectlyCapturedFish());
		equal(gfg.getNextBasketSlot(), 4);
	});

});